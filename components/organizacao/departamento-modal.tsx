'use client'

import { useRef, useTransition } from 'react'
import { createDepartamento, updateDepartamento } from '@/app/actions/organizacao'
import { X } from 'lucide-react'
import type { Departamento } from '@/lib/types'

interface DepartamentoModalProps {
  open: boolean
  orgaoId: string
  edit?: Departamento
  onClose: () => void
}

export function DepartamentoModal({ open, orgaoId, edit, onClose }: DepartamentoModalProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) return null

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = edit
        ? await updateDepartamento(edit.id, formData)
        : await createDepartamento(formData)

      if (result.success) {
        formRef.current?.reset()
        onClose()
      } else {
        alert(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">{edit ? 'Editar' : 'Novo'} Departamento</h3>
          <button id="close-dept-modal" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="orgao_id" value={orgaoId} />
          <div>
            <label htmlFor="dept-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input
              id="dept-nome"
              name="nome"
              required
              defaultValue={edit?.nome}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Ex: Secretaria de Obras"
            />
          </div>
          <div>
            <label htmlFor="dept-descricao" className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              id="dept-descricao"
              name="descricao"
              rows={3}
              defaultValue={edit?.descricao ?? ''}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Descreva as responsabilidades deste departamento..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button id="submit-dept" type="submit" disabled={isPending} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60">
              {isPending ? 'Salvando...' : edit ? 'Salvar' : 'Criar Departamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
