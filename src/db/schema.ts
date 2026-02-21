import {
  geometry,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const establishments = pgTable(
  'establishments',
  {
    id: serial().primaryKey(),
    businessId: text('business_id').notNull(),
    licenseNumber: text('license_number').notNull(),
    name: text().notNull(),
    streetAddress: text('street_address'),
    city: text(),
    postcode: text(),
    municipality: text(),
    state: text(),
    country: text(),
    countryCode: text('country_code'),
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [
    index('spatial_index').using('gist', t.location),
    uniqueIndex('unique_business').on(t.businessId, t.licenseNumber),
  ],
)
