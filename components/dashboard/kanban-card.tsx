"use client"

import { useState, useTransition } from "react"
import { FileText, Clock, AlertCircle, MoreHorizontal, ArrowRight, UserPlus, Eye, Loader2 } from "lucide-react"
import { TraceabilityModal } from "./traceability-modal"
import { moverFase, atribuirAMim } from "@/app/actions/documentos"

export interface DocumentType {
  id: string
  title: string
  type: string
  priority: "Baixa" | "Normal" | "Alta" | "Urgente"
  assignee?: string
  daysInStage: number
}

const STATUS_OPTIONS = [
  { value: 'distribuir', label: 'A Distribuir' },
  { value: 'analise',    label: 'Em Análise' },
  { value: 'assinatura', label: 'Pendente Assinatura' },
  { value: 'despachado', label: 'Pronto / Despachado' },
]

export function KanbanCard({ document }: { document: DocumentType }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMoverOpen, setIsMoverOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [observacao, setObservacao] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const priorityColors = {
    Baixa: "border-l-slate-400",
    Normal: "border-l-blue-400",
    Alta: "border-l-amber-500",
    Urgente: "border-l-red-500",
  }

  const badgeColors = {
    Baixa: "bg-slate-100 text-slate-600",
    Normal: "bg-blue-50 text-blue-700",
    Alta: "bg-amber-50 text-amber-700",
    Urgente: "bg-red-50 text-red-700",
  }

  function handleMoverFase() {
    if (!selectedStatus) return
    setError(null)
    const formData = new FormData()
    formData.set('documentId', document.id)
    formData.set('novoStatus', selectedStatus)
    formData.set('observacao', observacao)
    startTransition(async () => {
      const result = await moverFase(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsMoverOpen(false)
        setSelectedStatus('')
        setObservacao('')
      }
    })
  }

  function handleAtribuir() {
    startTransition(async () => {
      await atribuirAMim(document.id)
    })
  }

  return (
    <>
      <div className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200 border-l-4 ${priorityColors[document.priority]} hover:shadow-md transition-shadow relative group`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{document.type}</span>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[document.priority]}`}>
              {document.priority}
            </span>
            <details className="relative z-10">
              <summary className="list-none cursor-pointer p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </summary>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-20">
                <button
                  onClick={(e) => { e.preventDefault(); setIsModalOpen(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  Ver Radar
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleAtribuir() }}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-slate-400" />}
                  Atribuir a mim
                </button>
                <div className="h-px bg-slate-200 my-1"></div>
                <button
                  onClick={(e) => { e.preventDefault(); setIsMoverOpen(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  Mover Fase...
                </button>
              </div>
            </details>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-6">{document.title}</h4>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            {document.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                  {document.assignee.charAt(0)}
                </div>
                <span className="truncate max-w-[80px]">{document.assignee}</span>
              </div>
            ) : (
              <span className="italic text-slate-400">Não atribuído</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {document.daysInStage > 5 ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span className={document.daysInStage > 5 ? "text-red-600 font-medium" : ""}>
              {document.daysInStage}d
            </span>
          </div>
        </div>
      </div>

      {/* Modal Radar de Rastreabilidade */}
      <TraceabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={document}
      />

      {/* Modal Mover Fase */}
      {isMoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">Mover Fase</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">{document.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Nova etapa</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Observação (opcional)</label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  placeholder="Ex: Encaminhado para análise jurídica..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end">
              <button
                onClick={() => setIsMoverOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleMoverFase}
                disabled={!selectedStatus || isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}