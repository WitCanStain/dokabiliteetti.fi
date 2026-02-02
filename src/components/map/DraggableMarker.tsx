import { Marker } from 'react-leaflet'
import { useRef } from 'react'
import type { ReactNode } from 'react'

export default function DraggableMarker({
  initialPosition,
  children,
}: {
  initialPosition: [number, number]
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
