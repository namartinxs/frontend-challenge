import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { RegisterPage } from '@modules/auth'

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: registerSearchSchema,
  component: RegisterRoute,
})

function RegisterRoute() {
  const { redirect } = Route.useSearch()
  return <RegisterPage redirectTo={redirect ?? '/'} />
}
