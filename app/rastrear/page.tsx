import { createClient } from '@/utils/supabase/server'
import { Zap, Search, CheckCircle2, Clock, Inbox, AlertCircle } from 'lucide-react'

type ExternalRequest = {
  id: string
  tracking_code: string
  title: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

const STEPS = [
  { key: 0, label: 'Recebido', icon: Inbox },
  { key: 1, label: 'Em andamento', icon: Clock },
  { key: 2, label: 'Concluído', icon: CheckCircle2 },
]

function getStepIndex(status: string) {
  if (status === 'pendente') return 0
  if (status === 'em_andamento') return 1
  return 2 // assinado, concluido, despachado
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    assinado: 'Assinado',
    concluido: 'Concluído',
    despachado: 'Despachado',
  }
  return labels[status] ?? status
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

async function getRequest(codigo: string): Promise<ExternalRequest | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('external_requests')
    .select('id, tracking_code, title, description, status, created_at, updated_at')
    .eq('tracking_code', codigo.trim().toUpperCase())
    .single()

  if (error || !data) return null
  return data
}

export default async function RastrearPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>
}) {
  const { codigo } = await searchParams
  const request = codigo ? await getRequest(codigo) : null
  const notFound = !!codigo && !request
  const currentStep = request ? getStepIndex(request.status) : -1

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex p-2 bg-slate-900 rounded-lg mb-3">
            <Zap className="text-white size-5 fill-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">OmniTrâmita</h1>
          <p className="text-sm text-slate-500 mt-1">Rastreamento de Protocolo</p>
        </div>

        {/* Formulário de busca */}
        <form method="GET" className="mb-6">
          <div className="relative">
            <input
              type="text"
              name="codigo"
              defaultValue={codigo ?? ''}
              placeholder="Digite o código (ex: OMNI-2026-ABC123)"
              className="w-full border border-slate-200 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Consultar protocolo"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Resultado: não encontrado */}
        {notFound && (
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-800">Protocolo não encontrado</p>
            <p className="text-xs text-slate-500 mt-1">
              Verifique se o código foi digitado corretamente.
            </p>
          </div>
        )}

        {/* Resultado: encontrado */}
        {request && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Protocolo</p>
              <p className="text-sm font-mono font-semibold text-slate-800 mt-0.5">
                {request.tracking_code}
              </p>
              <h3 className="text-base font-semibold text-slate-800 mt-2">{request.title}</h3>
              {request.description && (
                <p className="text-xs text-slate-500 mt-1">{request.description}</p>
              )}
            </div>

            {/* Stepper de status */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index < currentStep
                  const isCurrent = index === currentStep
                  const isActive = isCompleted || isCurrent

                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                      {index > 0 && (
                        <div
                          className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                            index <= currentStep ? 'bg-emerald-400' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white z-10
                          ${isCompleted ? 'bg-emerald-100 text-emerald-600' :
                            isCurrent ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200 ring-offset-2' :
                            'bg-slate-100 text-slate-400'}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[11px] font-medium mt-2 text-center ${
                          isActive ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {request.status === 'em_andamento' && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-700 font-medium bg-blue-50 p-2.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  Seu processo está sendo analisado pela equipe responsável.
                </div>
              )}
              {currentStep === 2 && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Processo concluído. Status atual: {getStatusLabel(request.status)}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between text-xs text-slate-400">
              <span>Aberto em {formatDate(request.created_at)}</span>
              <span>Atualizado em {formatDate(request.updated_at)}</span>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!codigo && (
          <div className="text-center text-sm text-slate-400 mt-8">
            Digite o código do protocolo que você recebeu ao abrir sua solicitação.
          </div>
        )}
      </div>
    </div>
  )
}