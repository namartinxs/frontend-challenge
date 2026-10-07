import { http, HttpResponse } from 'msw'

import { authStore, createMockToken } from '../stores/auth-store'

function userResponse(user: { id: string; name: string; email: string; avatarUrl: string | null }) {
  return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
}

function tokenFromAuthHeader(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    const db = authStore.get()
    const user = db.users.find((candidate) => candidate.email === body.email)

    if (!user || user.password !== body.password) {
      return HttpResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 })
    }

    const token = createMockToken()
    authStore.update((current) => ({
      ...current,
      sessions: { ...current.sessions, [token]: user.id },
    }))

    return HttpResponse.json({ token, user: userResponse(user) })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string; password?: string }
    const db = authStore.get()

    if (db.users.some((candidate) => candidate.email === body.email)) {
      return HttpResponse.json({ message: 'Este e-mail já está cadastrado.' }, { status: 409 })
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: body.name ?? '',
      email: body.email ?? '',
      password: body.password ?? '',
      avatarUrl: null,
    }
    const token = createMockToken()

    authStore.update((current) => ({
      users: [...current.users, newUser],
      sessions: { ...current.sessions, [token]: newUser.id },
    }))

    return HttpResponse.json({ token, user: userResponse(newUser) }, { status: 201 })
  }),

  http.get('/api/auth/session', ({ request }) => {
    const token = tokenFromAuthHeader(request)
    const db = authStore.get()
    const userId = token ? db.sessions[token] : null
    const user = userId ? db.users.find((candidate) => candidate.id === userId) : null

    if (!user) {
      return HttpResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 })
    }

    return HttpResponse.json(userResponse(user))
  }),

  http.post('/api/auth/logout', ({ request }) => {
    const token = tokenFromAuthHeader(request)
    if (token) {
      authStore.update((current) => ({
        ...current,
        sessions: Object.fromEntries(
          Object.entries(current.sessions).filter(([sessionToken]) => sessionToken !== token),
        ),
      }))
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
