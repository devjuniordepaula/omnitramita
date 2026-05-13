'use client'

import { useState, useEffect } from 'react'
import { Layers } from 'lucide-react'
import type { Departamento, Setor } from '@/lib/types'

interface UserSetorSelectProps {
  departamentos: Departamento[]
  setores: Setor[]
  selectedSetorIds?: string[]
  name?: string
}

export function UserSetorSelect({
  departamentos,
  setores,
  selectedSetorIds = [],
  name = 'setor_ids',
}: UserSetorSelectProps) {
  const [openDepts, setOpenDepts] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedSetorIds))

  // Abrir departamentos que já têm setores selecionados
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    setores.forEach((s) => {
      if (selectedSetorIds.includes(s.id)) {
        initial[s.departamento_id] = true
      }
    })
    setOpenDepts(initial)
  }, [])

  const toggleDept = (deptId: string) =>
    setOpenDepts((p) => ({ ...p, [deptId]: !p[deptId] }))

  const toggleSetor = (setorId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(setorId) ? next.delete(setorId) : next.add(setorId)
      return next
    })
  }

  const getSetoresByDept = (deptId: string) =>
    setores.filter((s) => s.departamento_id === deptId)

  const selectedCount = selected.size

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">Setores com acesso</span>
        {selectedCount > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {selectedCount} selecionado(s)
          </span>
        )}
      </div>

      {/* Hidden inputs para envio do formulário */}
      {Array.from(selected).map((setorId) => (
        <input key={setorId} type="hidden" name={name} value={setorId} />
      ))}

      <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
        {departamentos.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">
            Nenhum departamento cadastrado. Crie a estrutura organizacional primeiro.
          </p>
        ) : (
          departamentos.map((dept) => {
            const deptSetores = getSetoresByDept(dept.id)
            const isOpen = !!openDepts[dept.id]
            const selectedInDept = deptSetores.filter((s) => selected.has(s.id)).length

            return (
              <div key={dept.id} className="border-b border-slate-100 last:border-0">
                <button
                  type="button"
                  id={`dept-toggle-${dept.id}`}
                  onClick={() => toggleDept(dept.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-400 text-xs">{isOpen ? '▾' : '▸'}</span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{dept.nome}</span>
                  {selectedInDept > 0 && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {selectedInDept}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{deptSetores.length} setore(s)</span>
                </button>

                {isOpen && (
                  <div className="bg-slate-50/60 border-t border-slate-100">
                    {deptSetores.length === 0 ? (
                      <p className="text-xs text-slate-400 px-10 py-2 italic">
                        Nenhum setor neste departamento
                      </p>
                    ) : (
                      deptSetores.map((setor) => (
                        <label
                          key={setor.id}
                          htmlFor={`setor-check-${setor.id}`}
                          className="flex items-center gap-3 px-8 py-2 cursor-pointer hover:bg-blue-50/60 transition-colors"
                        >
                          <input
                            id={`setor-check-${setor.id}`}
                            type="checkbox"
                            checked={selected.has(setor.id)}
                            onChange={() => toggleSetor(setor.id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Layers className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="text-sm text-slate-700">{setor.nome}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
