'use client'

import { useState, useTransition } from 'react'
import { createProtocolo } from '@/app/actions/solicitacoes'
import { Send } from 'lucide-react'
import type { Departamento, Setor } from '@/lib/types'

const TIPOS_SOLICITACAO = [
  'Alvará de Funcionamento',
  'Certidão Negativa de Débitos',
  'Habite-se',
  'Licença de Obras',
  'Requerimento Geral',
  'Solicitação de Documentos',
  'Recurso Administrativo',
  'Outro',
]

interface ProtocolRequestFormProps {
  externalUserId: string
  departamentos: Departamento[]
  setores: Setor[]
  onSuccess: (trackingCode: string) => void
}

export function ProtocolRequestForm({
  externalUserId,
  departamentos,
  setores,
  onSuccess,
}: ProtocolRequestFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedDeptId, setSelectedDeptId] = useState('')
  const [error, setError] = useState('')

  const filteredSetores = selectedDeptId
    ? setores.filter((s) => s.departamento_id === selectedDeptId)
    : []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('external_user_id', externalUserId)

    startTransition(async () => {
      const result = await createProtocolo(formData)
      if (result.success && result.tracking_code) {
        onSuccess(result.tracking_code)
      } else {
        setError(result.error ?? 'Erro ao criar protocolo.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tipo de solicitação */}
      <div>
        <label htmlFor="tipo-solicitacao" className="block text-sm font-medium text-slate-700 mb-1">
          Tipo de solicitação *
        </label>
        <select
          id="tipo-solicitacao"
          name="tipo_solicitacao"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecione o tipo...</option>
          {TIPOS_SOLICITACAO.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {/* Departamento de destino */}
      <div>
        <label htmlFor="departamento-destino" className="block text-sm font-medium text-slate-700 mb-1">
          Departamento de destino *
        </label>
        <select
          id="departamento-destino"
          name="departamento_destino_id"
          required
          value={selectedDeptId}
          onChange={(e) => setSelectedDeptId(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecione o departamento...</option>
          {departamentos.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.nome}</option>
          ))}
        </select>
      </div>

      {/* Setor de destino */}
      <div>
        <label htmlFor="setor-destino" className="block text-sm font-medium text-slate-700 mb-1">
          Setor de destino *
        </label>
        <select
          id="setor-destino"
          name="setor_destino_id"
          required
          disabled={!selectedDeptId}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {selectedDeptId ? 'Selecione o setor...' : 'Primeiro selecione um departamento'}
          </option>
          {filteredSetores.map((setor) => (
            <option key={setor.id} value={setor.id}>{setor.nome}</option>
          ))}
        </select>
      </div>

      {/* Motivo */}
      <div>
        <label htmlFor="motivo-solicitacao" className="block text-sm font-medium text-slate-700 mb-1">
          Motivo / Descrição *
        </label>
        <textarea
          id="motivo-solicitacao"
          name="motivo"
          required
          rows={5}
          minLength={10}
          placeholder="Descreva detalhadamente o motivo da sua solicitação..."
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">Mínimo de 10 caracteres.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        id="btn-enviar-protocolo"
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isPending ? 'Enviando...' : 'Enviar Solicitação'}
      </button>
    </form>
  )
}
