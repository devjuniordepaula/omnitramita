"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { DocumentType } from "./kanban-card"
import { createClient } from "@/utils/supabase/client"

interface TraceabilityModalProps {
  isOpen: boolean
  onClose: () => void
  document: DocumentType
}

type ProcessEvent = {
  id: string
  user_name: string | null
  from_status: string | null
  to_status: string
  observation: string | null
  created_at: string
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    distribuir: 'A Distribuir',
    analise: 'Em Análise',
    assinatura: 'Pendente Assinatura',
    despachado: 'Pronto / Despachado',
  }
  return labels[status] ?? status
}

export function TraceabilityModal({ isOpen, onClose, document }: TraceabilityModalProps) {
  const [events, setEvents] = useState<ProcessEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('process_events')
      .select('id, user_name, from_status, to_status, observation, created_at')
      .eq('document_id', document.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [isOpen, document.id])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Radar de Rastreabilidade</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-[280px]">{document.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center text-sm text-slate-400 py-8">Carregando histórico...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-8">Nenhuma movimentação registrada.</div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-200"></div>
              <div className="space-y-6">
                {events.map((event, index) => {
                  const isLast = index === events.length - 1
                  return (
                    <div key={event.id} className="relative pl-12">
                      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-white
                        ${isLast ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200 ring-offset-2' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isLast ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isLast ? 'text-blue-700' : 'text-slate-800'}`}>
                          {getStatusLabel(event.to_status)}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          por <span className="font-medium">{event.user_name ?? 'Sistema'}</span>
                        </p>
                        {event.observation && (
                          <p className="text-xs text-slate-500 mt-1 italic">{event.observation}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(event.created_at).toLocaleString('pt-BR')}
                        </p>
                        {isLast && document.daysInStage > 5 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2 rounded-md">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Atenção: Muito tempo parado nesta etapa
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            Fechar Radar
          </button>
        </div>
      </div>
    </div>
  )
}