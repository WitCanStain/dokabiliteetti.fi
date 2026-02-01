import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import Map from '@/components/map/Map'
import { getMapApiKey } from '@/utils/api.server'

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getMapApiKey(),
})

function App() {
  const apiKey = Route.useLoaderData()
  return (
    <>
      <ClientOnly>
        <Map apiKey={apiKey} />
      </ClientOnly>
    </>
  )
}
