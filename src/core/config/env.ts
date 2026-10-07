import { z } from 'zod'

const envSchema = z.object({
  // Relative on purpose: the app and the mocked API are always same-origin
  // (MSW intercepts fetch/XHR in the page itself), so this must work
  // unchanged across dev (5173), preview (4173) and the deployed origin.
  VITE_API_BASE_URL: z.string().min(1),
  VITE_SOCKET_URL: z.string().optional().default(''),
  VITE_API_MOCKING: z.enum(['true', 'false']).default('true'),
})

/**
 * Parsed once at module load so a missing/invalid env var fails fast on boot
 * instead of surfacing as a confusing runtime error deep in the app.
 */
export const env = envSchema.parse(import.meta.env)

export const isMockingEnabled = env.VITE_API_MOCKING === 'true'
