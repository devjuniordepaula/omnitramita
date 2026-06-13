import { ArrowRight, CheckCircle2, FileText, User } from "lucide-react"

type ProcessEvent = {
  id: string
  user_name: string | null
  from_status: string | null
  to_status: string
  observation: string | null
  created_at: string
  documents: { title: string } | { title: string }[] | null
}

function getDocumentTitle(documents: ProcessEvent['documents']): string {
  if (!documents) return 'Documento'
  if (Array.isArray(documents)) return documents[0]?.title ?? 'Documento'
  return documents.title ?? 'Documento'
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)

  if (diff < 1) return 'Agora mesmo'
  if (diff < 60) return `Há ${diff} min`
  if (diff < 1440) return `Há ${Math.floor(diff / 60)}h`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    distribuir: 'A Distribuir',
    analise: 'Em Análise',
    assinatura: 'Assinatura',
    despachado: 'Despachado',
  }
  return labels[status] ?? status
}

function getEventStyle(toStatus: string) {
  const styles: Record<string, { icon: typeof ArrowRight, iconColor: string, bgColor: string }> = {
    analise:    { icon: ArrowRight,   iconColor: 'text-blue-500',    bgColor: 'bg-blue-100' },
    assinatura: { icon: FileText,     iconColor: 'text-amber-500',   bgColor: 'bg-amber-100' },
    despachado: { icon: CheckCircle2, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-100' },
    distribuir: { icon: User,         iconColor: 'text-indigo-500',  bgColor: 'bg-indigo-100' },
  }
  return styles[toStatus] ?? { icon: ArrowRight, iconColor: 'text-slate-500', bgColor: 'bg-slate-100' }
}

export function ActivityFeed({ events }: { events: ProcessEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Atividades Recentes</h3>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center text-sm text-slate-400">
          Nenhuma atividade registrada ainda.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Atividades Recentes</h3>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200"></div>
          <div className="space-y-6">
            {events.map((event) => {
              const { icon: Icon, iconColor, bgColor } = getEventStyle(event.to_status)
              return (
                <div key={event.id} className="relative pl-10">
                  <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full ${bgColor} border-2 border-white flex items-center justify-center z-10`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{event.user_name ?? 'Sistema'}</span>
                      {' '}moveu{' '}
                      <span className="font-medium text-slate-900">
                        {getDocumentTitle(event.documents)}
                      </span>
                      {event.from_status && (
                        <> de <span className="font-medium">{getStatusLabel(event.from_status)}</span></>
                      )}
                      {' '}para{' '}
                      <span className="font-semibold">{getStatusLabel(event.to_status)}</span>
                    </p>
                    {event.observation && (
                      <p className="text-xs text-slate-500 mt-0.5 italic">{event.observation}</p>
                    )}
                    <span className="text-xs text-slate-400 mt-1 block">
                      {formatTime(event.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}