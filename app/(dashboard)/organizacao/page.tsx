import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { redirect } from 'next/navigation'
import { Building2, FolderOpen, Layers, Plus } from 'lucide-react'
import { OrganogramaTree } from '@/components/organizacao/organograma-tree'
import type { Orgao, Departamento, Setor } from '@/lib/types'

export default async function OrganizacaoPage() {
  console.log('OrganizacaoPage: Iniciando busca de perfil')
  const profile = await getProfile()
  console.log('OrganizacaoPage: Perfil encontrado:', profile?.nome_completo, 'is_gestor:', profile?.is_gestor)
  
  if (!profile?.is_gestor) {
    console.log('OrganizacaoPage: Usuário não é gestor, redirecionando...')
    redirect('/')
  }

  console.log('OrganizacaoPage: Criando cliente Supabase')
  const supabase = await createClient()

  console.log('OrganizacaoPage: Buscando órgãos, departamentos e setores (sem joins)...')
  const [orgaosRes, departamentosRes, setoresRes] = await Promise.all([
    supabase.from('orgaos').select('*').order('nome'),
    supabase.from('departamentos').select('*').order('nome'),
    supabase.from('setores').select('*').order('nome'),
  ])

  console.log('OrganizacaoPage: Dados recebidos')
  if (orgaosRes.error) console.error('Erro órgãos:', orgaosRes.error)
  if (departamentosRes.error) console.error('Erro departamentos:', departamentosRes.error)
  if (setoresRes.error) console.error('Erro setores:', setoresRes.error)

  const orgaos = (orgaosRes.data ?? []) as Orgao[]
  const departamentos = (departamentosRes.data ?? []) as (Departamento & { orgaos?: { nome: string } })[]
  const setores = (setoresRes.data ?? []) as (Setor & { departamentos?: { nome: string; orgao_id: string } })[]

  console.log('OrganizacaoPage: Renderizando com:', { 
    orgaos: orgaos.length, 
    departamentos: departamentos.length, 
    setores: setores.length 
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">Organização</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie a estrutura hierárquica: Órgão → Departamento → Setor
          </p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Building2} label="Órgãos" count={orgaos.length} color="blue" />
        <StatCard icon={FolderOpen} label="Departamentos" count={departamentos.length} color="violet" />
        <StatCard icon={Layers} label="Setores" count={setores.length} color="emerald" />
      </div>

      {/* Árvore do organograma */}
      <OrganogramaTree
        orgaos={orgaos}
        departamentos={departamentos}
        setores={setores}
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: React.ElementType
  label: string
  count: number
  color: 'blue' | 'violet' | 'emerald'
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  }
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${colors[color]}`}>
      <div className={`p-2 rounded-lg bg-white/70`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
    </div>
  )
}
