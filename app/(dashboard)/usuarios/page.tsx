import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { UserTable } from '@/components/usuarios/user-table'
import type { Profile } from '@/lib/types'

export default async function UsuariosPage() {
  const profile = await getProfile()
  if (!profile?.is_gestor) redirect('/')

  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      orgaos ( id, nome, cidade, estado ),
      profile_setores (
        setor_id,
        setores ( id, nome, departamento_id, departamentos ( id, nome ) )
      )
    `)
    .order('nome_completo')

  const users = (profiles ?? []) as Profile[]

  const totalAtivos = users.filter((u) => u.ativo).length
  const totalGestores = users.filter((u) => u.is_gestor).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">Usuários</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie os usuários internos do sistema e suas permissões de acesso.
          </p>
        </div>
        <Link
          href="/usuarios/novo"
          id="btn-novo-usuario"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Link>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{users.length}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Total de usuários</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalAtivos}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Ativos</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalGestores}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Gestores</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 p-1">
        <UserTable profiles={users} />
      </div>
    </div>
  )
}
