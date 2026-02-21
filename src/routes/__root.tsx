import {
  ClientOnly,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import Navigation from '../components/Navigation'
import DarkModeToggle from '../components/DarkModeToggle'
import {
  DarkModeProvider,
  useDarkModeContext,
} from '../contexts/DarkModeContext'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { getLocale, shouldRedirect } from '@/paraglide/runtime'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Dokabiliteetti-indeksi',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <RootContent>{children}</RootContent>
    </DarkModeProvider>
  )
}

function RootContent({ children }: { children: React.ReactNode }) {
  const { isDark, toggleDarkMode } = useDarkModeContext()

  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <Navigation />
        {children}
        <ClientOnly>
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </ClientOnly>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
