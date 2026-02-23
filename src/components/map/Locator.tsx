import { useEffect, useRef, useState } from 'react'
import { Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import PersonMarker from './PersonMarker'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'

export default function Locator({
  fallback,
  locating,
  userMarkerPosition,
  onPositionChange,
  onLocateFinish,
}: {
  fallback: GeoLocation
  locating: boolean
  userMarkerPosition: GeoLocation
  onPositionChange: (position: GeoLocation) => void
  onLocateFinish: () => void
}) {
  const map = useMap()
  const accuracyCircleRef = useRef<L.Circle | null>(null)

  useEffect(() => {
    const onLocationFound = (e: L.LocationEvent) => {
      const coords: GeoLocation = { lat: e.latlng.lat, lng: e.latlng.lng }

      onPositionChange(coords)
      onLocateFinish()

      map.flyTo(coords, Math.max(map.getZoom(), 16))

      accuracyCircleRef.current?.remove()
      accuracyCircleRef.current = L.circle(e.latlng, {
        radius: e.accuracy,
        color: 'red',
        fillOpacity: 0.1,
        weight: 0,
      }).addTo(map)
    }

    const onLocationError = (e: L.ErrorEvent) => {
      console.warn('Leaflet location error:', e.message)
      onLocateFinish()

      accuracyCircleRef.current?.remove()
      accuracyCircleRef.current = L.circle(userMarkerPosition, {
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
  }, [map, fallback, onLocateFinish])

  useEffect(() => {
    if (locating) {
      map.locate({
        watch: true,
        setView: false,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000,
      })
    }
  }, [locating, map])

  return (
    <PersonMarker
      initialPosition={userMarkerPosition}
      onPositionChange={onPositionChange}
    >
      <Popup>You are here</Popup>
    </PersonMarker>
  )
}
