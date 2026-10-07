import { resetAllMockScenarios } from './persisted-store'

export { resetAllMockScenarios }

/**
 * Exposed on `window` in mock mode so Playwright specs and manual QA can
 * restore a known scenario without reseeding localStorage by hand
 * (README §6: "o reset deve restaurar integralmente um cenário conhecido").
 */
declare global {
  interface Window {
    __resetMockScenarios?: () => void
  }
}

export function exposeMockScenarioControls(): void {
  window.__resetMockScenarios = resetAllMockScenarios
}
