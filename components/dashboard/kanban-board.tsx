import { KanbanCard, DocumentType } from "./kanban-card"

// Mock data para simular o banco de dados
const mockDocuments: Record<string, DocumentType[]> = {
  distribuir: [
    { id: "1", title: "OFÍCIO Nº 123/2026", type: "Ofício", priority: "Urgente", daysInStage: 2 },
    { id: "2", title: "REQ. FÉRIAS - JOÃO SILVA", type: "Requerimento", priority: "Normal", daysInStage: 1 },
    { id: "3", title: "MEMO 045/ADM", type: "Memorando", priority: "Baixa", daysInStage: 6 },
  ],
  analise: [
    { id: "4", title: "PROCESSO LICITATÓRIO 001/26", type: "Processo", priority: "Alta", assignee: "Ana Costa", daysInStage: 3 },
    { id: "5", title: "RELATÓRIO MENSAL - ABRIL", type: "Relatório", priority: "Normal", assignee: "Carlos M.", daysInStage: 1 },
  ],
  assinatura: [
    { id: "6", title: "CONTRATO PRESTAÇÃO DE SERVIÇOS", type: "Contrato", priority: "Urgente", assignee: "Diretoria", daysInStage: 4 },
  ],
  pronto: [
    { id: "7", title: "RESPOSTA OFÍCIO 110/2026", type: "Ofício", priority: "Normal", assignee: "Ana Costa", daysInStage: 0 },
    { id: "8", title: "AUTORIZAÇÃO DE COMPRA", type: "Autorização", priority: "Alta", assignee: "Diretoria", daysInStage: 0 },
  ],
}

export function KanbanBoard() {
  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Fluxo de Trabalho (Kanban)</h3>
      </div>
      
      {/* Contêiner com rolagem horizontal para telas menores */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        
        {/* Coluna 1: A Distribuir */}
        <div className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-slate-700">A Distribuir</h4>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {mockDocuments.distribuir.length}
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col gap-3 min-h-[400px]">
            {mockDocuments.distribuir.map((doc) => (
              <KanbanCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

        {/* Coluna 2: Em Análise */}
        <div className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-blue-700">Em Análise</h4>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {mockDocuments.analise.length}
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col gap-3 min-h-[400px]">
            {mockDocuments.analise.map((doc) => (
              <KanbanCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

        {/* Coluna 3: Pendente Assinatura */}
        <div className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-amber-700">Pendente Assinatura</h4>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {mockDocuments.assinatura.length}
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col gap-3 min-h-[400px]">
            {mockDocuments.assinatura.map((doc) => (
              <KanbanCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

        {/* Coluna 4: Pronto / Despachado */}
        <div className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-emerald-700">Pronto / Despachado</h4>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {mockDocuments.pronto.length}
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col gap-3 min-h-[400px]">
            {mockDocuments.pronto.map((doc) => (
              <KanbanCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
