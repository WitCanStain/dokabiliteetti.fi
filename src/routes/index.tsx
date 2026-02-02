import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import Map from '@/components/map/Map'
import { getGeoIpApiKey, getMapApiKey } from '@/utils/api.server'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return {
      map_api_key: await getMapApiKey(),
      geoip_api_key: await getGeoIpApiKey(),
    }
  },
})

function App() {
  const { map_api_key, geoip_api_key } = Route.useLoaderData()
  return (
    <>
      <ClientOnly>
        <Map mapApiKey={map_api_key} geoipApiKey={geoip_api_key} />
      </ClientOnly>
    </>
  )
}
