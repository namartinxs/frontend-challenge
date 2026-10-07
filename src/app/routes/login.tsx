import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '@modules/auth'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect } = Route.useSearch()
  return <LoginPage redirectTo={redirect ?? '/'} />
}
