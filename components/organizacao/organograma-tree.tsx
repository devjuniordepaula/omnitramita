'use client'

import { useState, useTransition } from 'react'
import {
  Building2,
  FolderOpen,
  Layers,
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Orgao, Departamento, Setor } from '@/lib/types'
import { DepartamentoModal } from './departamento-modal'
import { SetorModal } from './setor-modal'
import { OrgaoModal } from './orgao-modal'
import { deleteDepartamento, deleteSetor, deleteOrgao } from '@/app/actions/organizacao'

interface OrganogramaTreeProps {
  orgaos: Orgao[]
  departamentos: (Departamento & { orgaos?: { nome: string } })[]
  setores: (Setor & { departamentos?: { nome: string; orgao_id: string } })[]
}

export function OrganogramaTree({ orgaos, departamentos, setores }: OrganogramaTreeProps) {
  const [isPending, startTransition] = useTransition()
  const [openOrgaos, setOpenOrgaos] = useState<Record<string, boolean>>({})
  const [openDepts, setOpenDepts] = useState<Record<string, boolean>>({})
  
  const [orgaoModal, setOrgaoModal] = useState<{ open: boolean; edit?: Orgao }>({ open: false })
  const [deptModal, setDeptModal] = useState<{ open: boolean; orgaoId: string; edit?: Departamento }>({ open: false, orgaoId: '' })
  const [setorModal, setSetorModal] = useState<{ open: boolean; deptId: string; edit?: Setor }>({ open: false, deptId: '' })

  const toggleOrgao = (id: string) => setOpenOrgaos((p) => ({ ...p, [id]: !p[id] }))
  const toggleDept = (id: string) => setOpenDepts((p) => ({ ...p, [id]: !p[id] }))

  const getDepts = (orgaoId: string) => departamentos.filter((d) => d.orgao_id === orgaoId)
  const getSetores = (deptId: string) => setores.filter((s) => s.departamento_id === deptId)

  const handleDeleteOrgao = (id: string, nome: string) => {
    if (confirm(`Excluir órgão "${nome}"? Todos os departamentos e setores vinculados serão removidos.`)) {
      startTransition(async () => {
        const result = await deleteOrgao(id)
        if (!result.success) alert(result.error)
      })
    }
  }

  const handleDeleteDept = (id: string, nome: string) => {
    if (confirm(`Excluir departamento "${nome}"? Todos os setores vinculados serão removidos.`)) {
      startTransition(async () => {
        const result = await deleteDepartamento(id)
        if (!result.success) alert(result.error)
      })
    }
  }

  const handleDeleteSetor = (id: string, nome: string) => {
    if (confirm(`Excluir setor "${nome}"?`)) {
      startTransition(async () => {
        const result = await deleteSetor(id)
        if (!result.success) alert(result.error)
      })
    }
  }

  return (
    <div className={`space-y-4 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Botão adicionar órgão */}
      <div className="flex justify-end">
        <button
          id="btn-novo-orgao"
          onClick={() => setOrgaoModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Órgão
        </button>
      </div>

      {orgaos.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhum órgão cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo Órgão" para começar</p>
        </div>
      )}

      {orgaos.map((orgao) => {
        const depts = getDepts(orgao.id)
        const isOrgaoOpen = !!openOrgaos[orgao.id]

        return (
          <div key={orgao.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Órgão row */}
            <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
              <button
                onClick={() => toggleOrgao(orgao.id)}
                className="text-slate-500 hover:text-slate-800 transition-colors"
                id={`toggle-orgao-${orgao.id}`}
              >
                {isOrgaoOpen
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />}
              </button>
              <Building2 className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{orgao.nome}</p>
                {orgao.cidade && (
                  <p className="text-xs text-slate-500">{orgao.cidade} — {orgao.estado}</p>
                )}
              </div>
              <span className="text-xs text-slate-400 font-medium">{depts.length} depto(s)</span>
              
              <div className="flex items-center gap-1 ml-4">
                <button
                  id={`btn-novo-dept-${orgao.id}`}
                  onClick={() => setDeptModal({ open: true, orgaoId: orgao.id })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Depto
                </button>
                <button
                  id={`btn-edit-orgao-${orgao.id}`}
                  onClick={() => setOrgaoModal({ open: true, edit: orgao })}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  id={`btn-del-orgao-${orgao.id}`}
                  onClick={() => handleDeleteOrgao(orgao.id, orgao.nome)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Departamentos */}
            {isOrgaoOpen && (
              <div className="divide-y divide-slate-100">
                {depts.length === 0 && (
                  <p className="text-xs text-slate-400 px-10 py-4 italic">Nenhum departamento cadastrado</p>
                )}
                {depts.map((dept) => {
                  const setoresDept = getSetores(dept.id)
                  const isDeptOpen = !!openDepts[dept.id]

                  return (
                    <div key={dept.id}>
                      {/* Departamento row */}
                      <div className="flex items-center gap-3 px-8 py-3 hover:bg-slate-50 transition-colors">
                        <button
                          onClick={() => toggleDept(dept.id)}
                          className="text-slate-400 hover:text-slate-700"
                          id={`toggle-dept-${dept.id}`}
                        >
                          {isDeptOpen
                            ? <ChevronDown className="h-3.5 w-3.5" />
                            : <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                        <FolderOpen className="h-4 w-4 text-violet-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">{dept.nome}</p>
                          {dept.descricao && (
                            <p className="text-xs text-slate-400 truncate">{dept.descricao}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{setoresDept.length} setor(es)</span>
                        
                        <div className="flex items-center gap-1 ml-3">
                          <button
                            id={`btn-novo-setor-${dept.id}`}
                            onClick={() => setSetorModal({ open: true, deptId: dept.id })}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" /> Setor
                          </button>
                          <button
                            id={`btn-edit-dept-${dept.id}`}
                            onClick={() => setDeptModal({ open: true, orgaoId: orgao.id, edit: dept })}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            id={`btn-del-dept-${dept.id}`}
                            onClick={() => handleDeleteDept(dept.id, dept.nome)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Setores */}
                      {isDeptOpen && (
                        <div className="border-t border-slate-50">
                          {setoresDept.length === 0 && (
                            <p className="text-xs text-slate-400 px-16 py-3 italic">Nenhum setor cadastrado</p>
                          )}
                          {setoresDept.map((setor) => (
                            <div
                              key={setor.id}
                              className="flex items-center gap-3 px-14 py-2.5 hover:bg-emerald-50/40 transition-colors"
                            >
                              <Layers className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700">{setor.nome}</p>
                                {setor.descricao && (
                                  <p className="text-xs text-slate-400 truncate">{setor.descricao}</p>
                                )}
                              </div>
                              <button
                                id={`btn-edit-setor-${setor.id}`}
                                onClick={() => setSetorModal({ open: true, deptId: dept.id, edit: setor })}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                id={`btn-del-setor-${setor.id}`}
                                onClick={() => handleDeleteSetor(setor.id, setor.nome)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Modais */}
      <OrgaoModal 
        open={orgaoModal.open} 
        edit={orgaoModal.edit} 
        onClose={() => setOrgaoModal({ open: false })} 
      />
      <DepartamentoModal
        open={deptModal.open}
        orgaoId={deptModal.orgaoId}
        edit={deptModal.edit}
        onClose={() => setDeptModal({ open: false, orgaoId: '' })}
      />
      <SetorModal
        open={setorModal.open}
        departamentoId={setorModal.deptId}
        edit={setorModal.edit}
        onClose={() => setSetorModal({ open: false, deptId: '' })}
      />
    </div>
  )
}

