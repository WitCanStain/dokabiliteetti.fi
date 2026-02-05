import {
  geometry,
  index,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const establishments = pgTable(
  'establishments',
  {
    id: serial().primaryKey(),
    licenseNumber: text('license_number').notNull().unique(),
    name: text().notNull(),
    streetAddress: text('street_address'),
    city: text(),
    postcode: text(),
    county: text(),
    state: text(),
    country: text(),
    countryCode: text('country_code'),
    formatted: text(),
    confidence: real(),
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [index('spatial_index').using('gist', t.location)],
)
