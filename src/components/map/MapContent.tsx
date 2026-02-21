import { useEffect, useRef } from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import Locator from './Locator'
import type L from 'leaflet'
import type { GeoLocation } from '@/hooks/useGeoIpLocation'
import { useClosestEstablishments } from '@/queries/establishments.functions'

export default function MapContent({
  fallback,
  tileUrl,
  attribution,
  locating,
  onLocateFinish,
}: {
  fallback: GeoLocation
  tileUrl: string
  attribution: string
  locating: boolean
  onLocateFinish: () => void
}) {
  const map = useMap()
  const mapRef = useRef<L.Map>(map)
  useClosestEstablishments(fallback)
  useEffect(() => {
    // Update map view when fallback changes
    mapRef.current.setView(fallback, mapRef.current.getZoom())
  }, [fallback])

  return (
    <>
      <TileLayer url={tileUrl} attribution={attribution} />
      <Locator
        fallback={fallback}
        locating={locating}
        onLocateFinish={onLocateFinish}
      />
    </>
  )
}
