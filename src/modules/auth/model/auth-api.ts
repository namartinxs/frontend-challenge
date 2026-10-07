import { httpClient } from '@core/http/client'
import { ApiError } from '@core/errors/api-error'

import {
  sessionSchema,
  userSchema,
  type LoginInput,
  type RegisterInput,
  type Session,
  type User,
} from './auth.types'

export const authApi = {
  async login(input: LoginInput): Promise<Session> {
    const { data } = await httpClient.post('/auth/login', input)
    return sessionSchema.parse(data)
  },

  async register(input: RegisterInput): Promise<Session> {
    const { data } = await httpClient.post('/auth/register', input)
    return sessionSchema.parse(data)
  },

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const { data } = await httpClient.get('/auth/session')
      return userSchema.parse(data)
    } catch (error) {
      if (error instanceof ApiError && error.kind === 'unauthenticated') {
        return null
      }
      throw error
    }
  },

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
  },
}
