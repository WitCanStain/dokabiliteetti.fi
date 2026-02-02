import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p className="text-muted-foreground mb-6">
          Learn more about Dokabiliteetti.
        </p>
        <div className="bg-muted rounded-lg p-8">
          <p className="text-sm text-muted-foreground">
            About page content coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
