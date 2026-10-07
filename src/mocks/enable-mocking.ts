import { isMockingEnabled } from '@core/config/env'

/**
 * Dynamically imported so the MSW worker (and its handlers/fixtures) are
 * excluded from the production bundle when mocking is disabled, while still
 * being included in the demo build where `VITE_API_MOCKING=true`
 * (README §6: "deve ser ativada por configuração e estar disponível no
 * build de demonstração").
 */
export async function enableMocking(): Promise<void> {
  if (!isMockingEnabled) return

  const [{ worker }, { exposeMockScenarioControls }] = await Promise.all([
    import('./browser'),
    import('./scenarios'),
  ])

  exposeMockScenarioControls()

  await worker.start({ onUnhandledRequest: 'bypass' })
}
