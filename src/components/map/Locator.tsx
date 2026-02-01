import { useEffect, useRef, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

type LatLngTuple = [number, number]

export default function Locator({ fallback }: { fallback: LatLngTuple }) {
  const map = useMap()
  const [position, setPosition] = useState<LatLngTuple | null>(null)
  const [locating, setLocating] = useState(false)

  const accuracyCircleRef = useRef<L.Circle | null>(null)

  useEffect(() => {
    const onLocationFound = (e: L.LocationEvent) => {
      const coords: LatLngTuple = [e.latlng.lat, e.latlng.lng]

      setPosition(coords)
      setLocating(false)

      map.flyTo(coords, Math.max(map.getZoom(), 16))

      accuracyCircleRef.current?.remove()
      accuracyCircleRef.current = L.circle(e.latlng, {
        radius: e.accuracy,
        color: 'red',
        fillOpacity: 0.1,
      }).addTo(map)
    }

    const onLocationError = (e: L.ErrorEvent) => {
      console.warn('Leaflet location error:', e.message)
      setLocating(false)

      accuracyCircleRef.current?.remove()
      accuracyCircleRef.current = L.circle(fallback, {
        radius: 50,
        color: 'red',
        fillOpacity: 0.1,
      }).addTo(map)
    }

    map.on('locationfound', onLocationFound)
    map.on('locationerror', onLocationError)

    return () => {
      map.off('locationfound', onLocationFound)
      map.off('locationerror', onLocationError)
      accuracyCircleRef.current?.remove()
    }
  }, [map, fallback])

  const locateMe = () => {
    setLocating(true)

    map.locate({
      setView: false,
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000,
    })
  }

  return (
    <>
      {/* Locate button */}
      <button
        onClick={locateMe}
        disabled={locating}
        className="leaflet-control locate-button"
        aria-busy={locating}
      >
        {locating ? 'Locating…' : 'Use my location'}
      </button>

      {/* Marker */}
      <Marker position={position ?? fallback}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  )
}
