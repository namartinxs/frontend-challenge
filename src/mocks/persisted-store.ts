const resettableStores: (() => void)[] = []

/**
 * Generic localStorage-backed JSON store for mock "database" state. Every
 * resource module (auth, catalog, cart, orders, …) creates one of these
 * instead of plain module-level variables, so its data survives a refresh
 * (README §6: "Persistência local é permitida para sustentar refresh") and
 * can be wiped back to a known fixture via `resetAllMockScenarios()`.
 */
export function createPersistedStore<T>(key: string, initialValue: T) {
  const storageKey = `nft-marketplace:mock:${key}`

  function read(): T {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return structuredClone(initialValue)
      return JSON.parse(raw) as T
    } catch {
      return structuredClone(initialValue)
    }
  }

  function write(value: T): void {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }

  function reset(): void {
    write(structuredClone(initialValue))
  }

  resettableStores.push(reset)

  return {
    get: read,
    set: write,
    update: (updater: (current: T) => T) => write(updater(read())),
    reset,
  }
}

/** Restores every registered mock store to its initial fixture in one call. */
export function resetAllMockScenarios(): void {
  for (const reset of resettableStores) reset()
}
