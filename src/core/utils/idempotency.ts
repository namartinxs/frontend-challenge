/**
 * Generates the idempotency key sent with order creation (README §"Contratos
 * REST"): retrying the same checkout attempt must recover the same order
 * instead of creating a duplicate.
 */
export function createIdempotencyKey(): string {
  return crypto.randomUUID()
}
