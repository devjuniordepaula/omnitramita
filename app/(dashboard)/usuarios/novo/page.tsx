import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { redirect } from 'next/navigation'
import { UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { UserForm } from '@/components/usuarios/user-form'
import type { Orgao, Departamento, Setor } from '@/lib/types'

export default async function NovoUsuarioPage() {
  const profile = await getProfile()
  if (!profile?.is_gestor) redirect('/')

  const supabase = await createClient()

  const [orgaosRes, departamentosRes, setoresRes] = await Promise.all([
    supabase.from('orgaos').select('*').order('nome'),
    supabase.from('departamentos').select('*').order('nome'),
    supabase.from('setores').select('*').order('nome'),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/usuarios"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Novo Usuário
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Preencha os dados abaixo para cadastrar um novo usuário interno no sistema.
          </p>
        </div>
      </div>

      <UserForm
        orgaos={(orgaosRes.data ?? []) as Orgao[]}
        departamentos={(departamentosRes.data ?? []) as Departamento[]}
        setores={(setoresRes.data ?? []) as Setor[]}
        mode="create"
      />
    </div>
  )
}
