import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import Locator from './Locator'

export default function Map({ apiKey }: { apiKey: string }) {
  const fallback: [number, number] = [60.17, 24.94]
  const [dark, setDark] = useState(false)

  const lightUrl = `https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${apiKey}`
  const darkUrl = `https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${apiKey}`
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://thunderforest.com">Thunderforest</a>'

  const tileUrl = dark ? darkUrl : lightUrl

  return (
    <div className="map-wrapper">
      <button
        className={'map-toggle' + (dark ? ' dark' : '')}
        onClick={() => setDark((d) => !d)}
        aria-pressed={dark}
        aria-label="Toggle map dark mode"
      >
        {dark ? 'Light' : 'Dark'}
      </button>

      <MapContainer
        center={fallback}
        zoom={16}
        className="map-container"
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <Locator fallback={fallback} />
      </MapContainer>
    </div>
  )
}
