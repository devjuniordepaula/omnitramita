import { UserCircle, LogOut, Zap } from "lucide-react"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions/auth'
import { getProfile } from '@/utils/supabase/get-profile'
import { SidebarNav } from '@/components/navigation/sidebar-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile()
  const userEmail = user.email ?? 'Utilizador'
const userName = profile?.nome_completo ?? profile?.full_name ?? user.user_metadata?.full_name ?? userEmail.split('@')[0]
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 rounded-lg">
            <Zap className="text-white size-4 fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">OmniTrâmita</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Gestão de Documentos</p>
          </div>
        </div>

        <SidebarNav profile={profile} />

        {/* Órgão badge */}
        {profile?.orgaos && (
          <div className="mt-auto px-4 pb-4">
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Órgão</p>
              <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{profile.orgaos.nome}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Controle do Setor</h2>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-800 leading-tight">{userName}</p>
                {profile?.is_gestor && (
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">Gestor</p>
                )}
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-lg"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
