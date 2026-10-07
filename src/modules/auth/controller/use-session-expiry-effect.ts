import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { subscribeToSessionExpired } from '@core/storage/session-storage'

import { authKeys } from '../model/auth-queries'

/**
 * Bridges core/http's session-expired signal (fired by the Axios interceptor
 * on a 401) into the Query cache, so every screen reacts the same way a
 * manual logout would (README §"Conta e sessão": "Trate expiração durante a
 * navegação e durante o checkout, preservando o contexto para retomada.").
 */
export function useSessionExpiryEffect(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    return subscribeToSessionExpired(() => {
      queryClient.setQueryData(authKeys.session, null)
    })
  }, [queryClient])
}
