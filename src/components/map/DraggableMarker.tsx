import { Marker } from 'react-leaflet'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'

export default function DraggableMarker({
  initialPosition,
  children,
}: {
  initialPosition: GeoLocation
  children?: ReactNode
}) {
  const markerRef = useRef<any>(null)
  const eventHandlers = {
    dragend() {
      console.log('dragend position:', markerRef.current.getLatLng())
    },
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={initialPosition}
      ref={markerRef}
    >
      {children}
    </Marker>
  )
}
