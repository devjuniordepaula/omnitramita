'use client'

import { useState, useTransition } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/dashboard/data-table'
import { PermissionBadges } from './permission-badges'
import { toggleUsuarioAtivo } from '@/app/actions/usuarios'
import { Pencil, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'
import type { Profile } from '@/lib/types'

interface UserTableProps {
  profiles: Profile[]
}

export function UserTable({ profiles }: UserTableProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (userId: string, ativo: boolean) => {
    startTransition(async () => {
      const result = await toggleUsuarioAtivo(userId, ativo)
      if (!result.success) alert(result.error)
    })
  }

  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: 'nome_completo',
      header: 'Nome',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{row.getValue('nome_completo')}</p>
          {row.original.cargo && (
            <p className="text-xs text-slate-400">{row.original.cargo}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 font-mono">
          {row.getValue('matricula') || '—'}
        </span>
      ),
    },
    {
      id: 'orgao',
      header: 'Órgão',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {row.original.orgaos?.nome ?? '—'}
        </span>
      ),
    },
    {
      id: 'permissoes',
      header: 'Permissões',
      cell: ({ row }) => <PermissionBadges profile={row.original} size="sm" />,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide
            ${row.original.ativo
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600'
            }`}
        >
          {row.original.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      id: 'acoes',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Link
            href={`/usuarios/${row.original.id}`}
            id={`btn-edit-user-${row.original.id}`}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            id={`btn-toggle-user-${row.original.id}`}
            onClick={() => handleToggle(row.original.id, !row.original.ativo)}
            disabled={isPending}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50
              ${row.original.ativo
                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            title={row.original.ativo ? 'Desativar' : 'Ativar'}
          >
            {row.original.ativo
              ? <UserX className="h-4 w-4" />
              : <UserCheck className="h-4 w-4" />}
          </button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={profiles} />
}
