import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { enableMocking } from '@mocks/enable-mocking'

import { AppProviders } from './providers/app-providers'
import { router } from './router'

import '../styles/globals.css'

async function bootstrap() {
  await enableMocking()

  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')

  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
}

void bootstrap()
