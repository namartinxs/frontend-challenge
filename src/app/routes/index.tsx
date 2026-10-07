import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@shared/components/ui/button'
import { useLogoutMutation, useSessionQuery } from '@modules/auth'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const { data: user, isLoading } = useSessionQuery()
  const logout = useLogoutMutation()

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-start justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">NFT Marketplace</h1>
      <p className="text-muted-foreground">
        Fundação do projeto em construção: catálogo, carrinho, checkout e demais fluxos chegam nas
        próximas sessões, seguindo o padrão deste módulo de autenticação.
      </p>

      {isLoading && <p>Carregando sessão…</p>}

      {!isLoading && user && (
        <div className="flex items-center gap-3">
          <p>
            Sessão ativa: <strong>{user.name}</strong>
          </p>
          <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
            Sair
          </Button>
        </div>
      )}

      {!isLoading && !user && (
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Criar conta</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
