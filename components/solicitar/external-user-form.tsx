'use client'

import { useState, useTransition } from 'react'
import { createExternalUser } from '@/app/actions/solicitacoes'
import { User, Building2, ChevronRight } from 'lucide-react'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

interface ExternalUserFormProps {
  onSuccess: (externalUserId: string) => void
}

export function ExternalUserForm({ onSuccess }: ExternalUserFormProps) {
  const [isPending, startTransition] = useTransition()
  const [tipoDoc, setTipoDoc] = useState<'CPF' | 'CNPJ'>('CPF')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('tipo_documento', tipoDoc)

    startTransition(async () => {
      const result = await createExternalUser(formData)
      if (result.success && result.external_user_id) {
        onSuccess(result.external_user_id)
      } else {
        setError(result.error ?? 'Erro ao salvar dados. Tente novamente.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Tipo de documento *</p>
        <div className="flex gap-3">
          {(['CPF', 'CNPJ'] as const).map((t) => (
            <button
              key={t}
              type="button"
              id={`tipo-doc-${t.toLowerCase()}`}
              onClick={() => setTipoDoc(t)}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                tipoDoc === t
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ext-cpf-cnpj" className="block text-sm font-medium text-slate-700 mb-1">
          {tipoDoc === 'CPF' ? 'CPF *' : 'CNPJ *'}
        </label>
        <input
          id="ext-cpf-cnpj"
          name="cpf_cnpj"
          required
          placeholder={tipoDoc === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="ext-nome" className="block text-sm font-medium text-slate-700 mb-1">
          Nome completo *
        </label>
        <input
          id="ext-nome"
          name="nome"
          required
          placeholder={tipoDoc === 'CPF' ? 'Seu nome completo' : 'Razão social da empresa'}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ext-cidade" className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
          <input
            id="ext-cidade"
            name="cidade"
            placeholder="Ex: São Paulo"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="ext-estado" className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
          <select
            id="ext-estado"
            name="estado"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ext-telefone" className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
          <input
            id="ext-telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="ext-email" className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
          <input
            id="ext-email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        id="btn-continuar-identificacao"
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        {isPending ? 'Verificando...' : 'Continuar'}
        {!isPending && <ChevronRight className="h-4 w-4" />}
      </button>
    </form>
  )
}
