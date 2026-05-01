import { StatCard } from "@/components/dashboard/stat-card"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Inbox, AlertTriangle, Send, Hourglass } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Visão Geral do Setor</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe o fluxo de documentos e identifique gargalos em tempo real.
        </p>
      </div>

      {/* Grid de KPIs - "O Controlador" */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Caixa de Entrada (A Triar)"
          value={12}
          description="Documentos aguardando análise"
          icon={Inbox}
          colorVariant="default"
          trend="up"
          trendValue="+3 desde ontem"
        />
        <StatCard
          title="Alertas e Prazos"
          value={3}
          description="Processos com SLA estourando"
          icon={AlertTriangle}
          colorVariant="danger"
          trend="up"
          trendValue="Vencem hoje"
        />
        <StatCard
          title="Despachados Hoje"
          value={24}
          description="Volume de saída do setor"
          icon={Send}
          colorVariant="success"
          trend="up"
          trendValue="+12% que a média"
        />
        <StatCard
          title="Maior Gargalo"
          value="Assinatura"
          description="8 doc. aguardando Diretor"
          icon={Hourglass}
          colorVariant="warning"
        />
      </div>

      {/* Kanban e Atividades - "O Gerenciador" e "Mapeador" */}
      <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-4 mt-8">
        <div className="col-span-1 xl:col-span-3 overflow-hidden">
          <KanbanBoard />
        </div>
        <div className="col-span-1 xl:col-span-1 mt-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
