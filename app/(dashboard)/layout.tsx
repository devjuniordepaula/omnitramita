import { LayoutDashboard, FileText, Settings, UserCircle, LogOut, Zap } from "lucide-react"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions/auth'

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

  const userEmail = user.email ?? 'Utilizador'
  const userName = user.user_metadata?.full_name ?? userEmail.split('@')[0]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Mockup) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6 flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 rounded-lg">
            <Zap className="text-white size-4 fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">OmniTrâmita</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Gestão de Documentos</p>
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          <a href="/" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </a>
          <a href="/processos" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <FileText className="h-5 w-5 mr-3" />
            Meus Processos
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header (Mockup) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Controle do Setor</h2>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center text-sm font-medium text-slate-600">
              <UserCircle className="h-6 w-6 text-slate-400 mr-2" />
              <span className="hidden sm:inline">{userName}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
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
