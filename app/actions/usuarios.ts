'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { z } from 'zod'

const UsuarioSchema = z.object({
  email: z.string().email('E-mail inválido'),
  nome_completo: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cargo: z.string().optional(),
  matricula: z.string().optional(),
  orgao_id: z.string().uuid('Selecione um órgão válido'),
  is_gestor: z.boolean().default(false),
  can_view: z.boolean().default(true),
  can_dispatch: z.boolean().default(false),
  can_sign: z.boolean().default(false),
  setor_ids: z.array(z.string().uuid()).default([]),
})

async function requireGestor() {
  const profile = await getProfile()
  if (!profile?.is_gestor) {
    throw new Error('Acesso negado: apenas gestores podem gerenciar usuários.')
  }
  return profile
}

export async function createUsuarioInterno(formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const setor_ids = formData.getAll('setor_ids') as string[]

  const raw = {
    email: formData.get('email') as string,
    nome_completo: formData.get('nome_completo') as string,
    cargo: formData.get('cargo') as string || undefined,
    matricula: formData.get('matricula') as string || undefined,
    orgao_id: formData.get('orgao_id') as string,
    is_gestor: formData.get('is_gestor') === 'true',
    can_view: formData.get('can_view') === 'true',
    can_dispatch: formData.get('can_dispatch') === 'true',
    can_sign: formData.get('can_sign') === 'true',
    setor_ids,
  }

  const parsed = UsuarioSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const {
    email, nome_completo, cargo, matricula,
    orgao_id, is_gestor, can_view, can_dispatch,
    can_sign, setor_ids: setores
  } = parsed.data

  // Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: nome_completo,
      is_gestor,
    },
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? 'Erro ao criar usuário.' }
  }

  const userId = authData.user.id

  // Upsert do profile com todas as colunas corretas
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: nome_completo,
    nome_completo,
    email,
    cargo,
    matricula,
    orgao_id,
    is_gestor,
    can_view,
    can_dispatch,
    can_sign,
    ativo: true,
  })

  if (profileError) return { error: profileError.message }

  // Vincular setores
  if (setores.length > 0) {
    const profileSetores = setores.map((setor_id) => ({
      profile_id: userId,
      setor_id
    }))
    const { error: setorError } = await supabase
      .from('profile_setores')
      .insert(profileSetores)
    if (setorError) return { error: setorError.message }
  }

  revalidatePath('/usuarios')
  return { success: true, userId }
}

export async function updateUsuarioInterno(userId: string, formData: FormData) {
  await requireGestor()
  const supabase = await createClient()

  const setor_ids = formData.getAll('setor_ids') as string[]

  const nome_completo = formData.get('nome_completo') as string

  const updates = {
    full_name: nome_completo,
    nome_completo,
    cargo: formData.get('cargo') as string || undefined,
    matricula: formData.get('matricula') as string || undefined,
    orgao_id: formData.get('orgao_id') as string,
    is_gestor: formData.get('is_gestor') === 'true',
    can_view: formData.get('can_view') === 'true',
    can_dispatch: formData.get('can_dispatch') === 'true',
    can_sign: formData.get('can_sign') === 'true',
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (profileError) return { error: profileError.message }

  // Substituir setores
  await supabase.from('profile_setores').delete().eq('profile_id', userId)

  if (setor_ids.length > 0) {
    const profileSetores = setor_ids.map((setor_id) => ({
      profile_id: userId,
      setor_id
    }))
    const { error: setorError } = await supabase
      .from('profile_setores')
      .insert(profileSetores)
    if (setorError) return { error: setorError.message }
  }

  revalidatePath('/usuarios')
  revalidatePath(`/usuarios/${userId}`)
  return { success: true }
}

export async function toggleUsuarioAtivo(userId: string, ativo: boolean) {
  await requireGestor()
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ ativo })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/usuarios')
  return { success: true }
}