import { Link } from '@tanstack/react-router'

import { Button } from '@shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'

import { useRegisterController } from '../controller/use-register-controller'

interface RegisterPageProps {
  redirectTo: string
}

export function RegisterPage({ redirectTo }: RegisterPageProps) {
  const {
    name,
    email,
    password,
    errors,
    setName,
    setEmail,
    setPassword,
    onSubmit,
    isPending,
    submitError,
  } = useRegisterController(redirectTo)

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-destructive text-sm" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-destructive text-sm" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-destructive text-sm" role="alert">
                {submitError.kind === 'conflict'
                  ? 'Este e-mail já está cadastrado.'
                  : submitError.message}
              </p>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando conta…' : 'Criar conta'}
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
