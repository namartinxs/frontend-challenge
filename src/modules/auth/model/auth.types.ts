import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.url().nullable(),
})
export type User = z.infer<typeof userSchema>

export const sessionSchema = z.object({
  token: z.string(),
  user: userSchema,
})
export type Session = z.infer<typeof sessionSchema>

export const loginInputSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
})
export type LoginInput = z.infer<typeof loginInputSchema>

export const registerInputSchema = z.object({
  name: z.string().min(2, 'Informe seu nome completo.'),
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
})
export type RegisterInput = z.infer<typeof registerInputSchema>
