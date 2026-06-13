import { createClient } from '@/utils/supabase/server'
import { DataTable } from "@/components/dashboard/data-table"
import { columns, Processo } from "./columns"

async function getProcessos(): Promise<Processo[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('documents')
    .select('id, title, type, priority, status, created_at')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    priority: doc.priority as Processo['priority'],
    status: doc.status as Processo['status'],
    created_at: doc.created_at,
  }))
}

export default async function ProcessosPage() {
  const data = await getProcessos()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-800">
          Meus Processos
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie e acompanhe todos os processos usando a tabela avançada.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}