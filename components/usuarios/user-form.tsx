'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createUsuarioInterno, updateUsuarioInterno } from '@/app/actions/usuarios'
import { UserSetorSelect } from './user-setor-select'
import { Save, ArrowLeft } from 'lucide-react'
import type { Profile, Orgao, Departamento, Setor } from '@/lib/types'
import Link from 'next/link'

interface UserFormProps {
  orgaos: Orgao[]
  departamentos: Departamento[]
  setores: Setor[]
  profile?: Profile          // Preenchido quando estiver editando
  mode: 'create' | 'edit'
}

export function UserForm({ orgaos, departamentos, setores, profile, mode }: UserFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const selectedSetorIds =
    profile?.profile_setores?.map((ps) => ps.setor_id) ?? []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result =
        mode === 'edit' && profile
          ? await updateUsuarioInterno(profile.id, formData)
          : await createUsuarioInterno(formData)

      if (result.success) {
        router.push('/usuarios')
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dados básicos */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Dados do Usuário
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="user-nome" className="block text-sm font-medium text-slate-700 mb-1">
              Nome completo *
            </label>
            <input
              id="user-nome"
              name="nome_completo"
              required
              defaultValue={profile?.nome_completo ?? ''}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome completo do usuário"
            />
          </div>

          {mode === 'create' && (
            <div className="sm:col-span-2">
              <label htmlFor="user-email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail *
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario@orgao.gov.br"
              />
              <p className="text-xs text-slate-400 mt-1">
                O usuário receberá um e-mail para definir sua senha.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="user-cargo" className="block text-sm font-medium text-slate-700 mb-1">
              Cargo
            </label>
            <input
              id="user-cargo"
              name="cargo"
              defaultValue={profile?.cargo ?? ''}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Analista Administrativo"
            />
          </div>

          <div>
            <label htmlFor="user-matricula" className="block text-sm font-medium text-slate-700 mb-1">
              Matrícula
            </label>
            <input
              id="user-matricula"
              name="matricula"
              defaultValue={profile?.matricula ?? ''}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 123456"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="user-orgao" className="block text-sm font-medium text-slate-700 mb-1">
              Órgão *
            </label>
            <select
              id="user-orgao"
              name="orgao_id"
              required
              defaultValue={profile?.orgao_id ?? ''}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione o órgão...</option>
              {orgaos.map((o) => (
                <option key={o.id} value={o.id}>{o.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Permissões */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Permissões
        </h4>

        <div className="space-y-3">
          <CheckboxPermission
            id="perm-gestor"
            name="is_gestor"
            label="Gestor"
            description="Acesso total: cadastra usuários, gerencia organograma e vê todas as demandas."
            defaultChecked={profile?.is_gestor}
            highlight
          />
          <CheckboxPermission
            id="perm-view"
            name="can_view"
            label="Visualizar protocolos"
            description="Pode acessar o dashboard e visualizar o histórico de protocolos."
            defaultChecked={profile?.can_view ?? true}
          />
          <CheckboxPermission
            id="perm-dispatch"
            name="can_dispatch"
            label="Despachar protocolos"
            description="Pode redirecionar protocolos para outros setores ou departamentos."
            defaultChecked={profile?.can_dispatch}
          />
          <CheckboxPermission
            id="perm-sign"
            name="can_sign"
            label="Assinar protocolos"
            description="Pode assinar digitalmente protocolos pendentes de assinatura."
            defaultChecked={profile?.can_sign}
          />
        </div>
      </section>

      {/* Setores */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
          Setores com acesso
        </h4>
        <UserSetorSelect
          departamentos={departamentos}
          setores={setores}
          selectedSetorIds={selectedSetorIds}
        />
      </section>

      {/* Ações */}
      <div className="flex items-center gap-3 justify-end">
        <Link
          href="/usuarios"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <button
          id="btn-salvar-usuario"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isPending ? 'Salvando...' : mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

// ─── Sub-componente interno ───────────────────────────────────────────────────
function CheckboxPermission({
  id,
  name,
  label,
  description,
  defaultChecked,
  highlight,
}: {
  id: string
  name: string
  label: string
  description: string
  defaultChecked?: boolean
  highlight?: boolean
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors
        ${highlight
          ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
          : 'border-transparent hover:bg-slate-50'
        }`}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <div>
        <p className={`text-sm font-medium ${highlight ? 'text-slate-900' : 'text-slate-700'}`}>
          {label}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </label>
  )
}
