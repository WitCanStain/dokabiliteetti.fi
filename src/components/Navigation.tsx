import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Back to Map button - top left (only visible when not on map view) */}
      {pathname !== '/' && (
        <Link to="/" className="fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" aria-label="Back to map view">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      )}

      {/* Navigation menu - top right */}
      <nav className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isOpen && (
          <div className="absolute top-12 right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg py-2">
            {pathname !== '/' && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                >
                  Map
                </Link>
                <hr className="my-1 border-border" />
              </>
            )}
            <Link
              to="/search"
              onClick={closeMenu}
              className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
            >
              Search
            </Link>
            <hr className="my-1 border-border" />
            <Link
              to="/about"
              onClick={closeMenu}
              className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
            >
              About
            </Link>
            <hr className="my-1 border-border" />
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
