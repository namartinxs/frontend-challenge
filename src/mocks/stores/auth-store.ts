import { createPersistedStore } from '../persisted-store'
import { INITIAL_USERS, type MockUserRecord } from '../fixtures/users'

interface AuthDb {
  users: MockUserRecord[]
  /** token -> userId */
  sessions: Record<string, string>
}

export const authStore = createPersistedStore<AuthDb>('auth', {
  users: INITIAL_USERS,
  sessions: {},
})

export function createMockToken(): string {
  return crypto.randomUUID()
}
