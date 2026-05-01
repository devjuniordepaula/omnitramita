import { X, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { DocumentType } from "./kanban-card"

interface TraceabilityModalProps {
  isOpen: boolean
  onClose: () => void
  document: DocumentType
}

export function TraceabilityModal({ isOpen, onClose, document }: TraceabilityModalProps) {
  if (!isOpen) return null

  // Simulação das etapas do fluxo
  const steps = [
    { id: 1, title: "Gabinete (Origem)", status: "completed", date: "10/05/2026 - 09:00" },
    { id: 2, title: "Financeiro (Análise Orçamentária)", status: "completed", date: "12/05/2026 - 14:30" },
    { id: 3, title: "Seu Setor (Atualmente)", status: "current", date: `Desde há ${document.daysInStage} dias` },
    { id: 4, title: "Setor Jurídico (Destino Esperado)", status: "pending", date: "Pendente" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Radar de Rastreabilidade</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">{document.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal - Timeline */}
        <div className="p-6">
          <div className="relative">
            {/* Linha guia vertical */}
            <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-200"></div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="relative pl-12">

                  {/* Ícone de status na linha */}
                  <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-white
                    ${step.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      step.status === 'current' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200 ring-offset-2' :
                        'bg-slate-100 text-slate-400'}`}
                  >
                    {step.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    {step.status === 'current' && <Clock className="w-4 h-4" />}
                    {step.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </div>

                  {/* Informação do passo */}
                  <div>
                    <h4 className={`text-sm font-semibold ${step.status === 'current' ? 'text-blue-700' : 'text-slate-800'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{step.date}</p>

                    {step.status === 'current' && document.daysInStage > 5 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2 rounded-md">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Atenção: Muito tempo parado nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Fechar Radar
          </button>
        </div>

      </div>
    </div>
  )
}
