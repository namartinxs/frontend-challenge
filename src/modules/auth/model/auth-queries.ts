import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '@core/errors/api-error'
import { clearSessionToken, setSessionToken } from '@core/storage/session-storage'

import { authApi } from './auth-api'
import type { LoginInput, RegisterInput, Session, User } from './auth.types'

export const authKeys = {
  session: ['auth', 'session'] as const,
}

/**
 * Session is the one piece of server state every other module depends on
 * (favorites, cart, checkout, profile, wallets all require it) — modeled as
 * a query so it shares TanStack Query's cache/retry/refetch-on-focus behavior
 * instead of living in ad-hoc component state.
 */
export function useSessionQuery() {
  return useQuery<User | null, ApiError>({
    queryKey: authKeys.session,
    queryFn: authApi.fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
  })
}

function useApplySession() {
  const queryClient = useQueryClient()
  return (session: Session) => {
    setSessionToken(session.token)
    queryClient.setQueryData(authKeys.session, session.user)
  }
}

export function useLoginMutation() {
  const applySession = useApplySession()
  return useMutation<Session, ApiError, LoginInput>({
    mutationFn: (input) => authApi.login(input),
    onSuccess: applySession,
  })
}

export function useRegisterMutation() {
  const applySession = useApplySession()
  return useMutation<Session, ApiError, RegisterInput>({
    mutationFn: (input) => authApi.register(input),
    onSuccess: applySession,
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation<void, ApiError>({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSessionToken()
      // Clearing the whole cache (not just invalidating) guarantees no
      // previous user's private data (cart, favorites, orders) survives
      // into the next session (README §"Conta e sessão").
      queryClient.clear()
    },
  })
}
