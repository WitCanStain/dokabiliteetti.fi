import { Marker } from 'react-leaflet'
import L, { marker } from 'leaflet'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'

// Create a red marker icon
const redIcon = new L.Icon({
  iconUrl: 'user.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [60, 60],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function PersonMarker({
  initialPosition,
  onPositionChange,
  children,
}: {
  initialPosition: GeoLocation
  onPositionChange: (position: GeoLocation) => void
  children?: ReactNode
}) {
  const markerRef = useRef<any>(null)
  const eventHandlers = {
    dragend() {
      const latLng = markerRef.current.getLatLng()
      onPositionChange(latLng)
    },
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={initialPosition}
      ref={markerRef}
      icon={redIcon}
    >
      {children}
    </Marker>
  )
}
