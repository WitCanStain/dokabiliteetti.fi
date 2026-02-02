import { useEffect, useState } from 'react'

export type GeoLocation = {
  lat: number
  lon: number
}

/**
 * Hook to get approximate user location based on their IP address
 * using the Geoapify API.
 */
export function useGeoIpLocation(apiKey: string) {
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeoIpLocation = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        console.log(`geoapi json:`, data)

        // Extract location if available
        if (
          data.location &&
          data.location.latitude &&
          data.location.longitude
        ) {
          setLocation({
            lat: data.location.latitude,
            lon: data.location.longitude,
          })
        } else {
          setError('Location data not available in IP geolocation response')
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred'
        console.warn('IP geolocation unavailable:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (apiKey) {
      fetchGeoIpLocation()
    }
  }, [apiKey])

  return { location, loading, error }
}
