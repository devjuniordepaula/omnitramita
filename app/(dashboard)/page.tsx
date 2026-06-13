import { createClient } from '@/utils/supabase/server'
import { StatCard } from "@/components/dashboard/stat-card"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Inbox, AlertTriangle, Send, Hourglass } from "lucide-react"

async function getDashboardData() {
  const supabase = await createClient()

  const [
    { count: totalDistribuir },
    { count: totalAnalise },
    { count: totalDespachados },
    { count: totalAssinatura },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'distribuir'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'analise'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'despachado'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'assinatura'),
    supabase.from('process_events').select('id, user_name, from_status, to_status, observation, created_at, document_id, documents(title)').order('created_at', { ascending: false }).limit(8),
  ])

  return {
    totalDistribuir: totalDistribuir ?? 0,
    totalAnalise: totalAnalise ?? 0,
    totalDespachados: totalDespachados ?? 0,
    totalAssinatura: totalAssinatura ?? 0,
    recentEvents: recentEvents ?? [],
  }
}

export default async function DashboardPage() {
  const { totalDistribuir, totalAnalise, totalDespachados, totalAssinatura, recentEvents } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Visão Geral do Setor</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe o fluxo de documentos e identifique gargalos em tempo real.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="A Distribuir" value={totalDistribuir} description="Documentos aguardando triagem" icon={Inbox} colorVariant="default" />
        <StatCard title="Em Análise" value={totalAnalise} description="Documentos em andamento" icon={Hourglass} colorVariant="warning" />
        <StatCard title="Aguardando Assinatura" value={totalAssinatura} description="Pendentes de aprovação" icon={AlertTriangle} colorVariant="danger" />
        <StatCard title="Despachados" value={totalDespachados} description="Processos concluídos" icon={Send} colorVariant="success" />
      </div>
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-4 mt-8">
        <div className="col-span-1 xl:col-span-3 overflow-hidden">
          <KanbanBoard />
        </div>
        <div className="col-span-1 xl:col-span-1 mt-6">
          <ActivityFeed events={recentEvents} />
        </div>
      </div>
    </div>
  )
}
