import {
  geometry,
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const establishments = pgTable(
  'establishments',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),
  },
  (t) => [index('spatial_index').using('gist', t.location)],
)
