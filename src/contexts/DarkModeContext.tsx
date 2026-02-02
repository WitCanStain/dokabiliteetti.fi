import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'

type DarkModeContextType = {
  isDark: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const darkMode = useDarkMode()

  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkModeContext() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkModeContext must be used within a DarkModeProvider')
  }
  return context
}
