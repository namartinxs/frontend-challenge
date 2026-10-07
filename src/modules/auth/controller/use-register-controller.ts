import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useForm } from '@shared/hooks/use-form'

import { useRegisterMutation } from '../model/auth-queries'
import { registerInputSchema } from '../model/auth.types'

export function useRegisterController(redirectTo: string) {
  const navigate = useNavigate()
  const mutation = useRegisterMutation()
  const form = useForm(registerInputSchema, { name: '', email: '', password: '' })

  useEffect(() => {
    if (mutation.isSuccess) {
      void navigate({ to: redirectTo })
    }
  }, [mutation.isSuccess, navigate, redirectTo])

  return {
    name: form.values.name,
    email: form.values.email,
    password: form.values.password,
    errors: form.errors,
    setName: (value: string) => form.setValue('name', value),
    setEmail: (value: string) => form.setValue('email', value),
    setPassword: (value: string) => form.setValue('password', value),
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    submitError: mutation.error,
  }
}
