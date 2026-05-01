import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions/auth'
import { Zap, LogOut, User, Mail, Shield } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protecção dupla: middleware + verificação server-side
  if (!user) {
    redirect('/login')
  }

  const userEmail = user.email ?? 'Utilizador'
  const userName = user.user_metadata?.full_name ?? userEmail.split('@')[0]
  const createdAt = new Date(user.created_at).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Zap className="text-white size-5 fill-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">OmniTramita</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2 rounded-lg"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Boas-vindas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Bem-vindo, {userName}!
          </h1>
          <p className="text-slate-500">Acedeu ao sistema OmniTramita com sucesso.</p>
        </div>

        {/* Cartões de informação */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <User className="size-5 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Utilizador</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Mail className="size-5 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">E-mail</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{userEmail}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Shield className="size-5 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Membro desde</p>
              <p className="text-sm font-semibold text-slate-800">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* Área de conteúdo principal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Painel de Controlo</h2>
          <div className="flex items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">O conteúdo do sistema aparecerá aqui.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
