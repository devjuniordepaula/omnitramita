"use client"

import { useState } from "react"
import { Search, Filter, PenTool, CheckCircle, Archive, AlertCircle } from "lucide-react"

// Dados mockados para a tabela
const tableData = [
  { id: "1", num: "OFÍCIO Nº 123/2026", type: "Ofício", priority: "Urgente", status: "A Distribuir", date: "12/05/2026" },
  { id: "2", num: "REQ. FÉRIAS - JOÃO SILVA", type: "Requerimento", priority: "Normal", status: "A Distribuir", date: "11/05/2026" },
  { id: "3", num: "MEMO 045/ADM", type: "Memorando", priority: "Baixa", status: "A Distribuir", date: "06/05/2026" },
  { id: "4", num: "PROCESSO LICITATÓRIO 001/26", type: "Processo", priority: "Alta", status: "Em Análise", date: "09/05/2026" },
  { id: "5", num: "RELATÓRIO MENSAL - ABRIL", type: "Relatório", priority: "Normal", status: "Em Análise", date: "11/05/2026" },
  { id: "6", num: "CONTRATO PRESTAÇÃO DE SERVIÇOS", type: "Contrato", priority: "Urgente", status: "Pendente Assinatura", date: "08/05/2026" },
]

export default function ProcessosPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(tableData.map(item => item.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Fila de Trabalho</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie documentos em lote para maior produtividade.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Barra de Ferramentas */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">

          {/* Busca e Filtro */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar processo..."
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 bg-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Ações em Lote (Dinâmico) */}
          <div className="flex items-center">
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-sm font-medium text-slate-600 mr-2">
                  {selectedIds.length} selecionado(s)
                </span>
                <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  <PenTool className="w-4 h-4" />
                  Assinar Lote
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Aprovar Lote
                </button>
              </div>
            ) : (
              <button disabled className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">
                <Archive className="w-4 h-4" />
                Ações em Lote
              </button>
            )}
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === tableData.length && tableData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-semibold">Documento</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Fase Atual</th>
                <th className="p-4 font-semibold">Data Entrada</th>
                <th className="p-4 font-semibold">Prioridade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(row.id) ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-medium text-slate-900">{row.num}</td>
                  <td className="p-4 text-slate-600">{row.type}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{row.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold
                      ${row.priority === 'Urgente' ? 'bg-red-50 text-red-700' :
                        row.priority === 'Alta' ? 'bg-amber-50 text-amber-700' :
                          row.priority === 'Normal' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação Mockup */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-white">
          <span>Mostrando 1 a 6 de 12 resultados</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 bg-blue-50 text-blue-600 border-blue-200">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Próxima</button>
          </div>
        </div>

      </div>
    </div>
  )
}
