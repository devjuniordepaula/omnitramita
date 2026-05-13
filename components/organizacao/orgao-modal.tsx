'use client'

import { useRef, useTransition } from 'react'
import { createOrgao, updateOrgao } from '@/app/actions/organizacao'
import { X } from 'lucide-react'
import type { Orgao } from '@/lib/types'

interface OrgaoModalProps {
  open: boolean
  edit?: Orgao
  onClose: () => void
}

export function OrgaoModal({ open, edit, onClose }: OrgaoModalProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  if (!open) return null

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = edit 
        ? await updateOrgao(edit.id, formData)
        : await createOrgao(formData)

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
          <h3 className="text-lg font-bold text-slate-800">{edit ? 'Editar' : 'Novo'} Órgão</h3>
          <button id="close-orgao-modal" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          {edit && <input type="hidden" name="id" value={edit.id} />}
          <div>
            <label htmlFor="orgao-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input id="orgao-nome" name="nome" required defaultValue={edit?.nome} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Prefeitura Municipal de..." />
          </div>
          <div>
            <label htmlFor="orgao-cnpj" className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
            <input id="orgao-cnpj" name="cnpj" defaultValue={edit?.cnpj ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="00.000.000/0000-00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="orgao-cidade" className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
              <input id="orgao-cidade" name="cidade" defaultValue={edit?.cidade ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="orgao-estado" className="block text-sm font-medium text-slate-700 mb-1">Estado (sigla)</label>
              <input id="orgao-estado" name="estado" maxLength={2} defaultValue={edit?.estado ?? ''} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="SP" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button id="submit-orgao" type="submit" disabled={isPending} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60">
              {isPending ? 'Salvando...' : edit ? 'Salvar' : 'Criar Órgão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

