import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/** Used by Playwright (via a setup fixture) and any future unit tests. */
export const server = setupServer(...handlers)
