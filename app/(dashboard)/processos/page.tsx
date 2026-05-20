"use client"

import { DataTable } from "@/components/dashboard/data-table"
import { columns, Processo } from "./columns"

const data: Processo[] = [
  {
    id: "1",
    title: "OFÍCIO Nº 123/2026",
    type: "Ofício",
    priority: "Urgente",
    status: "A Distribuir",
    created_at: "2026-05-02T10:00:00Z",
  },
  {
    id: "2",
    title: "PROCESSO LICITATÓRIO 001/26",
    type: "Processo",
    priority: "Alta",
    status: "Em Análise",
    created_at: "2026-05-01T14:30:00Z",
  },
  {
    id: "3",
    title: "CONTRATO DE SERVIÇOS",
    type: "Contrato",
    priority: "Normal",
    status: "Assinatura",
    created_at: "2026-04-28T09:15:00Z",
  },
  {
    id: "4",
    title: "RESPOSTA OFÍCIO 110/2026",
    type: "Ofício",
    priority: "Baixa",
    status: "Despachado",
    created_at: "2026-04-25T16:45:00Z",
  },
]

export default function ProcessosPage() {
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