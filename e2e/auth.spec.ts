import { expect, test } from '@playwright/test'

// Each Playwright test runs in its own isolated browser context, so the
// mocked backend (persisted to localStorage, see src/mocks/persisted-store.ts)
// always starts from its seeded fixtures (src/mocks/fixtures/users.ts).

test.describe('Login', () => {
  test('entra com credenciais válidas e mantém a sessão', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('ana@example.com')
    await page.getByLabel('Senha').fill('nft-demo-123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Ana Colecionadora')).toBeVisible()

    await page.reload()
    await expect(page.getByText('Ana Colecionadora')).toBeVisible()
  })

  test('mostra erro para credenciais inválidas e não navega', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('ana@example.com')
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toHaveText('Credenciais inválidas.')
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Cadastro', () => {
  test('bloqueia e-mail já cadastrado com mensagem de conflito', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Nome').fill('Ana Duplicada')
    await page.getByLabel('E-mail').fill('ana@example.com')
    await page.getByLabel('Senha').fill('outra-senha-123')
    await page.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page.getByRole('alert')).toHaveText('Este e-mail já está cadastrado.')
    await expect(page).toHaveURL('/register')
  })

  test('cria conta nova e autentica automaticamente', async ({ page }) => {
    const email = `nova-${Date.now()}@example.com`
    await page.goto('/register')
    await page.getByLabel('Nome').fill('Colecionador Novo')
    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha').fill('senha-123456')
    await page.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Colecionador Novo')).toBeVisible()
  })
})

test.describe('Logout', () => {
  test('encerra a sessão e exibe as opções de entrar/cadastrar novamente', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill('bruno@example.com')
    await page.getByLabel('Senha').fill('nft-demo-123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Bruno Colecionador')).toBeVisible()

    await page.getByRole('button', { name: 'Sair' }).click()

    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible()
  })
})
