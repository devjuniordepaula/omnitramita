'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getProfile } from '@/utils/supabase/get-profile'
import { z } from 'zod'

const MoverFaseSchema = z.object({
  documentId: z.string().uuid(),
  novoStatus: z.enum(['distribuir', 'analise', 'assinatura', 'despachado']),
  observacao: z.string().optional(),
})

export async function moverFase(formData: FormData) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Usuário não autenticado.' }

  const raw = {
    documentId: formData.get('documentId') as string,
    novoStatus: formData.get('novoStatus') as string,
    observacao: formData.get('observacao') as string || undefined,
  }

  const parsed = MoverFaseSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { documentId, novoStatus, observacao } = parsed.data

  // Buscar status atual
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('status, title')
    .eq('id', documentId)
    .single()

  if (fetchError || !doc) return { error: 'Documento não encontrado.' }

  // Atualizar status
  const { error: updateError } = await supabase
    .from('documents')
    .update({ status: novoStatus })
    .eq('id', documentId)

  if (updateError) return { error: updateError.message }

  // Gravar evento no histórico
  const { error: eventError } = await supabase
    .from('process_events')
    .insert({
      document_id: documentId,
      user_name: profile.nome_completo ?? profile.full_name ?? profile.email ?? 'Usuário',
      from_status: doc.status,
      to_status: novoStatus,
      observation: observacao ?? `Movido de ${doc.status} para ${novoStatus}`,
    })

  if (eventError) return { error: eventError.message }

  revalidatePath('/')
  revalidatePath('/processos')
  return { success: true }
}

export async function atribuirAMim(documentId: string) {
  const supabase = await createClient()
  const profile = await getProfile()

  if (!profile) return { error: 'Usuário não autenticado.' }

  const { error } = await supabase
    .from('documents')
    .update({
      assignee_id: profile.id,
      assignee_name: profile.full_name ?? profile.email,
    })
    .eq('id', documentId)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/processos')
  return { success: true }
}