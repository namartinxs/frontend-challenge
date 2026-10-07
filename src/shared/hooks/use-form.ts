import { useState, type FormEvent } from 'react'
import type { z } from 'zod'

type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>

/**
 * Minimal controlled-form state backed by a zod schema. Shared across auth,
 * profile and wallets forms so each one only declares its schema + submit
 * handler instead of re-deriving validation/error-state plumbing.
 */
export function useForm<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  initialValues: z.input<TSchema>,
) {
  type Values = z.input<TSchema>

  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<Values>>({})

  function setValue<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(onValid: (values: z.output<TSchema>) => void) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const result = schema.safeParse(values)
      if (!result.success) {
        const nextErrors: FieldErrors<Values> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]
          if (typeof field === 'string') {
            nextErrors[field as keyof Values] = issue.message
          }
        }
        setErrors(nextErrors)
        return
      }
      setErrors({})
      onValid(result.data)
    }
  }

  return { values, errors, setValue, handleSubmit }
}
