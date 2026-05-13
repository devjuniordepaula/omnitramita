'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// ─── Validação CPF/CNPJ básica ────────────────────────────────────
function isValidCPF(cpf: string) {
  const digits = cpf.replace(/\D/g, '')
  return digits.length === 11
}

function isValidCNPJ(cnpj: string) {
  const digits = cnpj.replace(/\D/g, '')
  return digits.length === 14
}

const ExternalUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf_cnpj: z.string().min(11, 'CPF ou CNPJ inválido'),
  tipo_documento: z.enum(['CPF', 'CNPJ']),
  cidade: z.string().optional(),
  estado: z.string().max(2, 'Use a sigla do estado (ex: SP)').optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
}).refine((data) => {
  if (data.tipo_documento === 'CPF') return isValidCPF(data.cpf_cnpj)
  return isValidCNPJ(data.cpf_cnpj)
}, { message: 'Documento inválido para o tipo selecionado', path: ['cpf_cnpj'] })

const ProtocoloSchema = z.object({
  external_user_id: z.string().uuid(),
  tipo_solicitacao: z.string().min(1, 'Selecione o tipo de solicitação'),
  departamento_destino_id: z.string().uuid('Selecione um departamento'),
  setor_destino_id: z.string().uuid('Selecione um setor'),
  motivo: z.string().min(10, 'Descreva o motivo com pelo menos 10 caracteres'),
})

// ─── Criar/recuperar usuário externo ─────────────────────────────
export async function createExternalUser(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    nome: formData.get('nome') as string,
    cpf_cnpj: (formData.get('cpf_cnpj') as string).replace(/\D/g, ''),
    tipo_documento: formData.get('tipo_documento') as 'CPF' | 'CNPJ',
    cidade: formData.get('cidade') as string || undefined,
    estado: formData.get('estado') as string || undefined,
    telefone: formData.get('telefone') as string || undefined,
    email: formData.get('email') as string || undefined,
  }

  const parsed = ExternalUserSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Upsert: se já existe com o mesmo CPF/CNPJ, atualiza; senão cria
  const { data, error } = await supabase
    .from('external_users')
    .upsert(parsed.data, { onConflict: 'cpf_cnpj', ignoreDuplicates: false })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Erro ao salvar dados.' }

  return { success: true, external_user_id: data.id }
}

// ─── Criar protocolo ──────────────────────────────────────────────
export async function createProtocolo(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    external_user_id: formData.get('external_user_id') as string,
    tipo_solicitacao: formData.get('tipo_solicitacao') as string,
    departamento_destino_id: formData.get('departamento_destino_id') as string,
    setor_destino_id: formData.get('setor_destino_id') as string,
    motivo: formData.get('motivo') as string,
  }

  const parsed = ProtocoloSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Gerar código de protocolo único: OMNI-ANO-RANDOM
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  const tracking_code = `OMNI-${year}-${random}`

  const { data, error } = await supabase
    .from('external_requests')
    .insert({
      tracking_code,
      title: `${parsed.data.tipo_solicitacao} — ${tracking_code}`,
      description: parsed.data.motivo,
      applicant_name: '',       // será preenchido via join com external_users
      applicant_email: '',
      motivo: parsed.data.motivo,
      tipo_solicitacao: parsed.data.tipo_solicitacao,
      external_user_id: parsed.data.external_user_id,
      setor_destino_id: parsed.data.setor_destino_id,
      departamento_destino_id: parsed.data.departamento_destino_id,
      status: 'pendente',
    })
    .select('id, tracking_code')
    .single()

  if (error || !data) return { error: error?.message ?? 'Erro ao criar protocolo.' }

  revalidatePath('/processos')
  return { success: true, tracking_code: data.tracking_code, id: data.id }
}

// ─── Despachar protocolo (redirecionar para outro setor) ──────────
export async function dispatchProtocolo(requestId: string, formData: FormData) {
  const supabase = await createClient()

  const setor_destino_id = formData.get('setor_destino_id') as string
  const departamento_destino_id = formData.get('departamento_destino_id') as string

  if (!setor_destino_id) return { error: 'Selecione um setor de destino.' }

  const { error } = await supabase
    .from('external_requests')
    .update({
      setor_destino_id,
      departamento_destino_id,
      status: 'em_andamento',
    })
    .eq('id', requestId)

  if (error) return { error: error.message }

  revalidatePath('/processos')
  return { success: true }
}

// ─── Assinar protocolo ────────────────────────────────────────────
export async function signProtocolo(requestId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('external_requests')
    .update({ status: 'assinado' })
    .eq('id', requestId)

  if (error) return { error: error.message }

  revalidatePath('/processos')
  return { success: true }
}
