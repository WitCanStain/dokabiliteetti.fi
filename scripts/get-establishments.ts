import { db } from '../src/db/index'
import { establishments } from '@/db/schema'

async function main(): Promise<void> {
  console.log('='.repeat(70))
  console.log('🏢 Fetching All Establishments')
  console.log('='.repeat(70))
  console.log()

  try {
    const allEstablishments = await db.select().from(establishments)

    if (allEstablishments.length === 0) {
      console.log('No establishments found in the database.')
      return
    }

    console.log(`Found ${allEstablishments.length} establishments:\n`)

    allEstablishments.forEach((est, index) => {
      console.log(`${index + 1}. ${est.name}`)
      console.log(`   ID: ${est.id}`)
      console.log(`   Business ID: ${est.businessId}`)
      console.log(`   License Number: ${est.licenseNumber}`)
      console.log(`   Street Address: ${est.streetAddress || 'N/A'}`)
      console.log(`   City: ${est.city || 'N/A'}`)
      console.log(`   Postcode: ${est.postcode || 'N/A'}`)
      console.log(`   Municipality: ${est.municipality || 'N/A'}`)
      console.log(`   State: ${est.state || 'N/A'}`)
      console.log(`   Country: ${est.country || 'N/A'}`)
      console.log(`   Country Code: ${est.countryCode || 'N/A'}`)
      console.log(`   Location: ${est.location}`)
      console.log(`   Created At: ${est.createdAt}`)
      console.log(`   Updated At: ${est.updatedAt}`)
      console.log()
    })

    console.log('='.repeat(70))
    console.log(`✅ Total: ${allEstablishments.length} establishments`)
    console.log('='.repeat(70))
  } catch (error) {
    console.error('Error fetching establishments:', error)
    process.exit(1)
  }
}

main()
