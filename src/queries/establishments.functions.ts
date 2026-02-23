import { useMutation, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getClosestEstablishmentsDb } from './establishments.server'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'

// Schema for establishment response
const EstablishmentSchema = z.object({
  id: z.number(),
  businessId: z.string(),
  licenseNumber: z.string(),
  name: z.string(),
  streetAddress: z.string().nullable(),
  city: z.string().nullable(),
  postcode: z.string().nullable(),
  municipality: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  countryCode: z.string().nullable(),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  distance: z.number().optional(),
})

export type Establishment = z.infer<typeof EstablishmentSchema>

// API function to fetch closest establishments

export const getClosestEstablishments = createServerFn({ method: 'GET' })
  .inputValidator((data: { location: GeoLocation; limit?: number }) => data)
  .handler(async ({ data }): Promise<Array<Establishment>> => {
    console.log('here 2')
    const results = await getClosestEstablishmentsDb(
      data.location,
      data.limit || 10,
    )
    console.log(`establishments: ${JSON.stringify(results)}`)
    return results
  })
// export async function getClosestEstablishments(
//   location: Location,
//   limit: number = 10,
// ): Promise<Array<Establishment>> {
//   const response = await fetch('/api/establishments/closest', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       lat: location.lat,
//       lon: location.lon,
//       limit,
//     }),
//   })

//   if (!response.ok) {
//     throw new Error('Failed to fetch closest establishments')
//   }

//   const data = await response.json()
//   return z.array(EstablishmentSchema).parse(data)
// }

// Tanstack Query hook
export function useClosestEstablishments(
  location: GeoLocation | null,
  limit: number = 10,
) {
  return useQuery({
    queryKey: [
      'establishments',
      'closest',
      location?.lat,
      location?.lng,
      limit,
    ],
    queryFn: async () => {
      if (!location) throw new Error('Location is required')
      const result = await getClosestEstablishments({
        data: { location, limit },
      })
      return result
    },
    enabled: location !== null, // Only run query if location is provided
  })
}

// Mutation hook if you need to manually trigger the query
export function useClosestEstablishmentsMutation() {
  return useMutation({
    mutationFn: ({
      location,
      limit = 10,
    }: {
      location: GeoLocation
      limit?: number
    }) => getClosestEstablishments({ data: { location, limit } }),
  })
}
