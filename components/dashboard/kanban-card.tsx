"use client"

import { useState } from "react"
import { FileText, Clock, AlertCircle, MoreHorizontal, ArrowRight, UserPlus, Eye } from "lucide-react"
import { TraceabilityModal } from "./traceability-modal"

export interface DocumentType {
  id: string
  title: string
  type: string
  priority: "Baixa" | "Normal" | "Alta" | "Urgente"
  assignee?: string
  daysInStage: number
}

interface KanbanCardProps {
  document: DocumentType
}

export function KanbanCard({ document }: KanbanCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Define a cor da borda esquerda baseada na prioridade
  const priorityColors = {
    Baixa: "border-l-slate-400",
    Normal: "border-l-blue-400",
    Alta: "border-l-amber-500",
    Urgente: "border-l-red-500",
  }

  // Define a cor do selo (badge) de prioridade
  const badgeColors = {
    Baixa: "bg-slate-100 text-slate-600",
    Normal: "bg-blue-50 text-blue-700",
    Alta: "bg-amber-50 text-amber-700",
    Urgente: "bg-red-50 text-red-700",
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
            
            {/* Menu de Ações (Acessível via Dropdown nativo) */}
            <details className="relative z-10">
              <summary className="list-none cursor-pointer p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </summary>
              {/* O Dropdown */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-20">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  Ver Detalhes (Radar)
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  Atribuir a mim
                </button>
                <div className="h-px bg-slate-200 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium">
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
          
          <div className="flex items-center gap-1" title={`${document.daysInStage} dias nesta etapa`}>
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

      {/* Renderização condicional do Radar de Rastreabilidade */}
      <TraceabilityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        document={document} 
      />
    </>
  )
}
