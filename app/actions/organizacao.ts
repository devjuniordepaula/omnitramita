'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { z } from 'zod'

// ─── Schemas de validação ───────────────────────────────────────────
const DepartamentoSchema = z.object({
  orgao_id: z.string().uuid('ID do órgão inválido'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
})

const SetorSchema = z.object({
  departamento_id: z.string().uuid('ID do departamento inválido'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
})

const OrgaoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})

// ─── Helper de autorização ─────────────────────────────────────────
async function requireGestor() {
  const profile = await getProfile()
  if (!profile?.is_gestor) {
    throw new Error('Acesso negado: apenas gestores podem executar esta ação.')
  }
  return profile
}

// ─── ÓRGÃO ────────────────────────────────────────────────────────
export async function createOrgao(formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    nome: formData.get('nome') as string,
    cnpj: formData.get('cnpj') as string || undefined,
    cidade: formData.get('cidade') as string || undefined,
    estado: formData.get('estado') as string || undefined,
  }

  const parsed = OrgaoSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('orgaos').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function updateOrgao(id: string, formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    nome: formData.get('nome') as string,
    cnpj: formData.get('cnpj') as string || undefined,
    cidade: formData.get('cidade') as string || undefined,
    estado: formData.get('estado') as string || undefined,
  }

  const parsed = OrgaoSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('orgaos').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function deleteOrgao(id: string) {
  await requireGestor()
  const supabase = await createClient()

  const { error } = await supabase.from('orgaos').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

// ─── DEPARTAMENTO ─────────────────────────────────────────────────
export async function createDepartamento(formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    orgao_id: formData.get('orgao_id') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || undefined,
  }

  const parsed = DepartamentoSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('departamentos').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function updateDepartamento(id: string, formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    orgao_id: formData.get('orgao_id') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || undefined,
  }

  const parsed = DepartamentoSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('departamentos').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function deleteDepartamento(id: string) {
  await requireGestor()
  const supabase = await createClient()

  const { error } = await supabase.from('departamentos').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

// ─── SETOR ────────────────────────────────────────────────────────
export async function createSetor(formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    departamento_id: formData.get('departamento_id') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || undefined,
  }

  const parsed = SetorSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('setores').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function updateSetor(id: string, formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const raw = {
    departamento_id: formData.get('departamento_id') as string,
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string || undefined,
  }

  const parsed = SetorSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase.from('setores').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}

export async function deleteSetor(id: string) {
  await requireGestor()
  const supabase = await createClient()

  const { error } = await supabase.from('setores').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/organizacao')
  return { success: true }
}
