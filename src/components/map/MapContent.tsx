import { useEffect, useState } from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import Locator from './Locator'
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
  const [userMarkerPosition, setUserMarkerPosition] =
    useState<GeoLocation>(fallback)
  const { data: establishments = [] } =
    useClosestEstablishments(userMarkerPosition)

  const beerIcon = new L.Icon({
    iconUrl: 'beer.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  const markerGroup = L.layerGroup().addTo(map)
  establishments.map((est) => {
    const marker = L.marker([est.location.y, est.location.x], {
      icon: beerIcon,
    }).addTo(markerGroup)
    marker.bindPopup(`<b>${est.name}</b><br>${est.streetAddress}`)
  })

  const onPositionChange = (position: GeoLocation) => {
    setUserMarkerPosition(position)
    markerGroup.clearLayers()
  }
  useEffect(() => {
    map.setView(fallback, map.getZoom())
  }, [fallback])

  return (
    <>
      <TileLayer url={tileUrl} attribution={attribution} />
      <Locator
        fallback={fallback}
        locating={locating}
        userMarkerPosition={userMarkerPosition}
        onPositionChange={onPositionChange}
        onLocateFinish={onLocateFinish}
      />
    </>
  )
}
