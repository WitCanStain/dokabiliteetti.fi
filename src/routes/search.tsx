import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

function SearchPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground mb-6">
          Search for bars and establishments in your area.
        </p>
        <div className="bg-muted rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Search functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
