"use client"

import { DataTable } from "@/components/dashboard/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

// Definindo o tipo de dado que a tabela vai renderizar
export type Processo = {
  id: string
  title: string
  type: string
  priority: "Baixa" | "Normal" | "Alta" | "Urgente"
  status: "A Distribuir" | "Em Análise" | "Assinatura" | "Despachado"
  created_at: string
}

// Mock inicial de dados (Fase 3: O Mapeador - Tabela)
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

// Definindo as colunas da tabela
export const columns: ColumnDef<Processo>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título do Documento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-4 font-medium">
        <FileText className="h-4 w-4 text-slate-400" />
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      const colors: Record<string, string> = {
        Urgente: "text-red-700 bg-red-100",
        Alta: "text-amber-700 bg-amber-100",
        Normal: "text-blue-700 bg-blue-100",
        Baixa: "text-slate-700 bg-slate-100",
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}`}>
          {priority}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span className="px-2 py-1 rounded-full border border-slate-200 text-slate-700 text-xs font-medium">
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      return <div>{new Date(row.getValue("created_at")).toLocaleDateString("pt-BR")}</div>
    },
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
          Gerencie e acompanhe todos os processos usando a tabela avançada (Data Table).
        </p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
