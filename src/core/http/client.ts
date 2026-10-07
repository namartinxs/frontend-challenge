import axios, { AxiosError } from 'axios'
import { z } from 'zod'

import { env } from '@core/config/env'
import { ApiError, type ApiErrorKind } from '@core/errors/api-error'
import { getSessionToken, onSessionExpired } from '@core/storage/session-storage'

const apiErrorBodySchema = z.object({
  message: z.string(),
  fieldErrors: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
})

function kindFromStatus(status: number | null): ApiErrorKind {
  switch (status) {
    case 400:
    case 422:
      return 'validation'
    case 401:
      return 'unauthenticated'
    case 403:
      return 'unauthorized'
    case 404:
      return 'not_found'
    case 409:
      return 'conflict'
    default:
      return status === null ? 'network' : 'unknown'
  }
}

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
})

httpClient.interceptors.request.use((config) => {
  const token = getSessionToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(
        new ApiError({ kind: 'unknown', message: 'Erro inesperado.', status: null }),
      )
    }

    const status = error.response?.status ?? null
    const kind = kindFromStatus(status)
    const parsedBody = apiErrorBodySchema.safeParse(error.response?.data)
    const message = parsedBody.success ? parsedBody.data.message : error.message

    if (kind === 'unauthenticated') {
      onSessionExpired()
    }

    return Promise.reject(
      new ApiError({
        kind,
        status,
        message,
        fieldErrors: parsedBody.success ? parsedBody.data.fieldErrors : undefined,
      }),
    )
  },
)
