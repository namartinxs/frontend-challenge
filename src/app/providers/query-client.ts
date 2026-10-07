import { QueryClient } from '@tanstack/react-query'

import { ApiError } from '@core/errors/api-error'

/**
 * Cache/retry policy (documented in ARCHITECTURE.md):
 * - staleTime 30s: catalog/detail data is near-real-time via Socket.IO
 *   anyway, so a short stale window avoids refetch storms on navigation.
 * - retry skips validation/auth/not-found/conflict errors (retrying them
 *   can't succeed) but retries transient/network failures up to twice.
 * - mutations never retry automatically: order creation relies on an
 *   explicit idempotency key instead of blind resubmission.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          const nonRetryableKinds = [
            'validation',
            'unauthenticated',
            'unauthorized',
            'not_found',
            'conflict',
          ]
          if (nonRetryableKinds.includes(error.kind)) return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
