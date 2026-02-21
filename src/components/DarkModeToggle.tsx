import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  isDark: boolean
  onToggle: () => void
}

export default function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="rounded-full shadow-lg"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  )
}
