import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { SocketProvider } from '@core/socket/socket-context'
import { useSessionExpiryEffect, useSessionQuery } from '@modules/auth'

import { queryClient } from './query-client'

function SocketGate({ children }: { children: ReactNode }) {
  const { data: user } = useSessionQuery()
  useSessionExpiryEffect()

  return <SocketProvider enabled={Boolean(user)}>{children}</SocketProvider>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketGate>{children}</SocketGate>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
