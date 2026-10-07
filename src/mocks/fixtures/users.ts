export interface MockUserRecord {
  id: string
  name: string
  email: string
  /** Plaintext only because this is a fully simulated backend with fictitious credentials (README §12). */
  password: string
  avatarUrl: string | null
}

/**
 * At least two deterministic users (README §6), so fixtures can exercise
 * data isolation between accounts (favorites, cart, orders, wallets).
 */
export const INITIAL_USERS: MockUserRecord[] = [
  {
    id: 'user-ana',
    name: 'Ana Colecionadora',
    email: 'ana@example.com',
    password: 'nft-demo-123',
    avatarUrl: null,
  },
  {
    id: 'user-bruno',
    name: 'Bruno Colecionador',
    email: 'bruno@example.com',
    password: 'nft-demo-123',
    avatarUrl: null,
  },
]
