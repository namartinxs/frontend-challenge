import { Link } from '@tanstack/react-router'

import { Button } from '@shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'

import { useLoginController } from '../controller/use-login-controller'

interface LoginPageProps {
  redirectTo: string
}

export function LoginPage({ redirectTo }: LoginPageProps) {
  const { email, password, errors, setEmail, setPassword, onSubmit, isPending, submitError } =
    useLoginController(redirectTo)

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
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
                autoComplete="current-password"
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
                {submitError.message}
              </p>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="underline">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
