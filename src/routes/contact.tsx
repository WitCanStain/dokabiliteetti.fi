import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-muted-foreground mb-6">
          Get in touch with us.
        </p>
        <div className="bg-muted rounded-lg p-8">
          <p className="text-sm text-muted-foreground">
            Contact information coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
