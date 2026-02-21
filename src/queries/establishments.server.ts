import { getTableColumns, sql } from 'drizzle-orm'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'
import { db } from '@/db'
import { establishments } from '@/db/schema'

export const getClosestEstablishmentsDb = async (
  location: GeoLocation,
  limit: number = 10,
) => {
  const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)` // TODO: turn 4326 into a constant somewhere
  const result = await db
    .select({
      ...getTableColumns(establishments),
      distance: sql<number>`ST_Distance(ST_SetSRID(${establishments.location}, 4326)::geography, ${sqlPoint}::geography)`,
    })
    .from(establishments)
    .orderBy(sql`ST_SetSRID(${establishments.location}, 4326) <-> ${sqlPoint}`)
    .limit(limit)

  return result
}
