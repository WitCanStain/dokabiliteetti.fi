import { useEffect, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import MapContent from './MapContent'
import MapControls from './MapControls'
import { useGeoIpLocation } from '@/hooks/useGeoIpLocation'
import { useDarkModeContext } from '@/contexts/DarkModeContext'

type LatLngTuple = [number, number]

export default function Map({
  mapApiKey,
  geoipApiKey,
}: {
  mapApiKey: string
  geoipApiKey: string
}) {
  const defaultFallback: LatLngTuple = [60.17, 24.94]
  const [fallback, setFallback] = useState<LatLngTuple>(defaultFallback)
  const { isDark } = useDarkModeContext()
  const [locating, setLocating] = useState(false)

  // Fetch IP-based location to set as initial fallback
  const { location: ipLocation } = useGeoIpLocation(geoipApiKey)

  useEffect(() => {
    if (ipLocation) {
      setFallback([ipLocation.lat, ipLocation.lon])
    }
  }, [ipLocation])

  const lightUrl = `https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${mapApiKey}`
  const darkUrl = `https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${mapApiKey}`
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://thunderforest.com">Thunderforest</a>'

  const tileUrl = isDark ? darkUrl : lightUrl

  return (
    <div className="map-wrapper">
      <MapContainer
        center={fallback}
        zoom={16}
        zoomControl={false}
        className="map-container"
        style={{ height: '100vh', width: '100%' }}
      >
        <MapControls onLocate={() => setLocating(true)} locating={locating} />

        <MapContent
          fallback={fallback}
          tileUrl={tileUrl}
          attribution={attribution}
          locating={locating}
          onLocateFinish={() => setLocating(false)}
        />
      </MapContainer>
    </div>
  )
}
