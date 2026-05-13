import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { UserForm } from '@/components/usuarios/user-form'
import { PermissionBadges } from '@/components/usuarios/permission-badges'
import type { Profile, Orgao, Departamento, Setor } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarUsuarioPage({ params }: Props) {
  const { id } = await params

  const currentProfile = await getProfile()
  if (!currentProfile?.is_gestor) redirect('/')

  const supabase = await createClient()

  const [profileRes, orgaosRes, departamentosRes, setoresRes] = await Promise.all([
    supabase
      .from('profiles')
      .select(`
        *,
        orgaos ( id, nome, cidade, estado ),
        profile_setores (
          setor_id,
          setores ( id, nome, departamento_id, departamentos ( id, nome ) )
        )
      `)
      .eq('id', id)
      .single(),
    supabase.from('orgaos').select('*').order('nome'),
    supabase.from('departamentos').select('*').order('nome'),
    supabase.from('setores').select('*').order('nome'),
  ])

  if (profileRes.error || !profileRes.data) notFound()

  const targetProfile = profileRes.data as Profile

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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800 truncate">
              {targetProfile.nome_completo}
            </h3>
            <PermissionBadges profile={targetProfile} />
            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                targetProfile.ativo
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {targetProfile.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {targetProfile.cargo && (
            <p className="text-sm text-slate-500 mt-0.5">{targetProfile.cargo}</p>
          )}
        </div>
      </div>

      <UserForm
        orgaos={(orgaosRes.data ?? []) as Orgao[]}
        departamentos={(departamentosRes.data ?? []) as Departamento[]}
        setores={(setoresRes.data ?? []) as Setor[]}
        profile={targetProfile}
        mode="edit"
      />
    </div>
  )
}
