const SESSION_TOKEN_KEY = 'nft-marketplace:session-token'

type SessionExpiredListener = () => void

const sessionExpiredListeners = new Set<SessionExpiredListener>()

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setSessionToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token)
}

export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY)
}

/**
 * Lets core/http flag an expired session without importing the auth module
 * (which would create a dependency cycle: auth -> http -> auth).
 */
export function onSessionExpired(): void {
  for (const listener of sessionExpiredListeners) listener()
}

export function subscribeToSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener)
  return () => sessionExpiredListeners.delete(listener)
}
