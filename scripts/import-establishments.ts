import { readFileSync, readdirSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../src/db/index'
import {
  establishments,
  establishments as establishmentsTable,
} from '@/db/schema'

// Define the CSV row schema based on your geocoded data
const CSVRowSchema = z.object({
  original_asiakastunnus: z.string(),
  original_lupanumero: z.string(),
  original_nimi: z.string(),
  original_katuosoite: z.string(),
  original_postinumero: z.string(),
  original_postitoimipaikka: z.string(),
  original_kunta: z.string(),
  'original_asiakkaan-nimi': z.string().optional(),
  original_alkamispaivamaara: z.string().optional(),
  original_paattamispaivamaara: z.string().nullish(),
  lat: z.coerce.number().refine((n) => !isNaN(n), 'Invalid latitude'),
  lon: z.coerce.number().refine((n) => !isNaN(n), 'Invalid longitude'),
  formatted: z.string().optional(),
  name: z.string().optional(),
  housenumber: z.string().optional(),
  street: z.string().optional(),
  postcode: z.string().optional(),
  suburb: z.string().optional(),
  county: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  confidence: z.coerce.number(),
  confidence_city_level: z.string().optional(),
  confidence_street_level: z.string().optional(),
  confidence_building_level: z.string().optional(),
  attribution: z.string().optional(),
  attribution_license: z.string().optional(),
  attribution_url: z.string().optional(),
})

// Parsed establishment type for database
type ParsedEstablishment = {
  businessId: string
  licenseNumber: string
  name: string
  streetAddress: string
  city: string
  postcode: string
  municipality: string
  state: string
  country: string
  countryCode: string
  location: {
    x: number
    y: number
  }
}

/**
 * Parse and validate a CSV row
 */
function parseCSVRow(
  row: unknown,
  rowNumber?: number,
  fileName?: string,
): ParsedEstablishment | null {
  try {
    const result = CSVRowSchema.safeParse(row)

    if (!result.success) {
      const location =
        rowNumber && fileName ? ` in ${fileName} (row ${rowNumber})` : ''
      const errors = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')
      console.error(`  ⚠ Validation error${location}: ${errors}`)
      return null
    }

    const validated = result.data

    // Skip rows without required coordinates
    if (isNaN(validated.lat) || isNaN(validated.lon)) {
      return null
    }

    return {
      businessId: validated.original_asiakastunnus,
      licenseNumber: validated.original_lupanumero,
      name: validated.name || validated.original_nimi,
      streetAddress: validated.street || validated.original_katuosoite || '',
      city: validated.city || validated.original_postitoimipaikka || '',
      postcode: validated.postcode || validated.original_postinumero || '',
      municipality: validated.original_kunta || '',
      state: validated.state || '',
      country: validated.country || 'Finland',
      countryCode: validated.country_code || 'fi',
      location: {
        x: validated.lon,
        y: validated.lat,
      },
    }
  } catch (error) {
    const location =
      rowNumber && fileName ? ` in ${fileName} (row ${rowNumber})` : ''
    if (error instanceof z.ZodError) {
      const issue = error.issues[0]
      console.error(
        `  ⚠ Validation error${location}: ${issue.message} ${issue.path.join('.')}`,
      )
    } else {
      console.error(`  ⚠ Error parsing row${location}:`, error)
    }
    return null
  }
}

/**
 * Read and parse all CSV files
 */
function readCSVFiles(directory: string): Array<ParsedEstablishment> {
  const results: Array<ParsedEstablishment> = []

  const files = readdirSync(directory).filter((f) => f.endsWith('.csv'))

  if (files.length === 0) {
    console.log(`⚠ No CSV files found in ${directory}`)
    return results
  }

  console.log(`Found ${files.length} CSV file(s)\n`)

  for (const file of files) {
    console.log(`📖 Reading ${file}...`)

    try {
      const filePath = `${directory}/${file}`
      const content = readFileSync(filePath, 'utf-8')

      // Quick, explicit header parse so we can print the real column names and count.
      // This also helps diagnose delimiter/quote issues before we try to parse all rows.
      const headerPreview: Array<Array<string>> = parse(content, {
        to_line: 1,
        columns: false,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
        quote: '"',
        escape: '"',
        relax_quotes: true,
      })

      const headers = headerPreview[0] ?? []
      console.log(`   CSV headers (${headers.length}):`, headers)

      // Parse one data row (line 2) to validate column count without processing the whole file.
      const firstRecordPreview: Array<Array<string>> = parse(content, {
        from_line: 2,
        to_line: 2,
        columns: false,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
        quote: '"',
        escape: '"',
        relax_quotes: true,
      })
      const firstRecord = firstRecordPreview[0] ?? []
      console.log(
        `   First data row fields (${firstRecord.length}):`,
        firstRecord,
      )

      const records = parse(content, {
        columns: (header) =>
          header.map((h) =>
            String(h)
              .trim()
              // Some exporters include literal quotes in the header values.
              .replace(/^['"]|['"]$/g, ''),
          ),
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
        // The CSV is comma-delimited; commas inside quoted fields are OK as long as quoting is correct.
        quote: '"',
        escape: '"',
        relax_quotes: true,
        // If you still have broken quoting in some rows, this prevents hard-failing the entire file.
        relax_column_count: true,
      })

      // Print the columns
      if (records.length > 0) {
        const columns = Object.keys(records[0] as Record<string, unknown>)
        console.log(`   Columns (${columns.length}):`, columns)
      }

      let count = 0
      let rowNumber = 2 // Start at 2 since row 1 is headers
      for (const record of records) {
        const parsed = parseCSVRow(record, rowNumber, file)
        if (parsed) {
          results.push(parsed)
          count++
        }
        rowNumber++
      }

      console.log(`   ✓ Loaded ${count} establishments\n`)
    } catch (error) {
      console.error(`   ✗ Error reading ${file}:`, error)
    }
  }

  return results
}

/**
 * Insert establishments into database
 */
async function insertEstablishments(
  establishmentsData: Array<ParsedEstablishment>,
): Promise<{ inserted: number; updated: number; failed: number }> {
  let inserted = 0
  const updated = 0
  let failed = 0

  console.log(`💾 Inserting ${establishmentsData.length} establishments...\n`)

  for (const est of establishmentsData) {
    try {
      await db
        .insert(establishmentsTable)
        .values({
          ...est,
          location: sql`ST_SetSRID(ST_MakePoint(${est.location.x}, ${est.location.y}), 4326)`,
        })
        .onConflictDoNothing({ target: establishments.id })
      inserted++
    } catch (error) {
      failed++
      console.error(`   ✗ Failed to insert:`, error)
    }
  }

  return { inserted, updated, failed }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('='.repeat(70))
  console.log('🏢 Establishment Data Importer')
  console.log('='.repeat(70))
  console.log()

  // Read CSV files
  const establishmentRows = readCSVFiles('data/geocoded')

  if (establishmentRows.length === 0) {
    console.log('✗ No establishments found to import')
    process.exit(1)
  }

  console.log(`✓ Loaded ${establishmentRows.length} total establishments\n`)

  // Insert into database
  const { inserted, updated, failed } =
    await insertEstablishments(establishmentRows)

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('✅ Import Complete!')
  console.log('='.repeat(70))
  console.log(`  Inserted: ${inserted}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Total: ${establishmentRows.length}`)
  console.log()
}

// Run main function
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
