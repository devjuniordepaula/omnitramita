import { createClient } from '@/utils/supabase/server'
import { KanbanCard, DocumentType } from "./kanban-card"

async function getKanbanDocuments(): Promise<Record<string, DocumentType[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('id, title, type, priority, status, assignee_name, created_at')
    .order('created_at', { ascending: false })

  if (error || !data) return { distribuir: [], analise: [], assinatura: [], despachado: [] }

  const grouped: Record<string, DocumentType[]> = {
    distribuir: [],
    analise: [],
    assinatura: [],
    despachado: [],
  }

  data.forEach((doc) => {
    const status = doc.status as string
    const daysInStage = Math.floor(
      (Date.now() - new Date(doc.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    const item: DocumentType = {
      id: doc.id,
      title: doc.title,
      type: doc.type,
      priority: doc.priority,
      assignee: doc.assignee_name ?? undefined,
      daysInStage,
    }
    if (grouped[status]) {
      grouped[status].push(item)
    }
  })

  return grouped
}

export async function KanbanBoard() {
  const documents = await getKanbanDocuments()

  const columns = [
    { key: 'distribuir', label: 'A Distribuir',        labelColor: 'text-slate-700',  badgeColor: 'bg-slate-200 text-slate-600' },
    { key: 'analise',    label: 'Em Análise',           labelColor: 'text-blue-700',   badgeColor: 'bg-blue-100 text-blue-700' },
    { key: 'assinatura', label: 'Pendente Assinatura',  labelColor: 'text-amber-700',  badgeColor: 'bg-amber-100 text-amber-700' },
    { key: 'despachado', label: 'Pronto / Despachado',  labelColor: 'text-emerald-700',badgeColor: 'bg-emerald-100 text-emerald-700' },
  ]

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Fluxo de Trabalho (Kanban)</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {columns.map((col) => (
          <div key={col.key} className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className={`font-semibold ${col.labelColor}`}>{col.label}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {documents[col.key]?.length ?? 0}
              </span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-3 min-h-[400px]">
              {documents[col.key]?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-slate-400 italic">
                  Nenhum documento
                </div>
              ) : (
                documents[col.key].map((doc) => (
                  <KanbanCard key={doc.id} document={doc} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}