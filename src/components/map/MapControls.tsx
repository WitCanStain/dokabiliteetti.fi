import { Crosshair, Loader } from 'lucide-react'

import { ZoomControl } from 'react-leaflet'
import { Button } from '../ui/button'

type MapControlsProps = {
  onLocate: () => void
  locating: boolean
}

export default function MapControls({ onLocate, locating }: MapControlsProps) {
  return (
    <div className="map-controls-container">
      <Button
        variant="outline"
        size="lg"
        onClick={onLocate}
        disabled={locating}
        aria-busy={locating}
        aria-label="Center map on my location"
      >
        {locating ? <Loader className="animate-spin" /> : <Crosshair />}
      </Button>
      <ZoomControl position="topleft" />
    </div>
  )
}
