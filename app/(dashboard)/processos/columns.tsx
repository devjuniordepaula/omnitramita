"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Processo = {
    id: string
    title: string
    type: string
    priority: "Baixa" | "Normal" | "Alta" | "Urgente"
    status: "A Distribuir" | "Em Análise" | "Assinatura" | "Despachado"
    created_at: string
}

export const columns: ColumnDef<Processo>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Título do Documento
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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
        cell: ({ row }) => (
            <div>{new Date(row.getValue("created_at")).toLocaleDateString("pt-BR")}</div>
        ),
    },
]