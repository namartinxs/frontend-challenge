import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useForm } from '@shared/hooks/use-form'

import { useLoginMutation } from '../model/auth-queries'
import { loginInputSchema } from '../model/auth.types'

export function useLoginController(redirectTo: string) {
  const navigate = useNavigate()
  const mutation = useLoginMutation()
  const form = useForm(loginInputSchema, { email: '', password: '' })

  useEffect(() => {
    if (mutation.isSuccess) {
      void navigate({ to: redirectTo })
    }
  }, [mutation.isSuccess, navigate, redirectTo])

  return {
    email: form.values.email,
    password: form.values.password,
    errors: form.errors,
    setEmail: (value: string) => form.setValue('email', value),
    setPassword: (value: string) => form.setValue('password', value),
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    submitError: mutation.error,
  }
}
