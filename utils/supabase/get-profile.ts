import { createClient } from '@/utils/supabase/server'
import type { Profile } from '@/lib/types'

/**
 * Busca o perfil completo do usuário autenticado,
 * incluindo órgão e setores vinculados.
 * Retorna null se o usuário não estiver autenticado ou não tiver perfil.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      orgaos ( id, nome, cidade, estado ),
      profile_setores (
        setor_id,
        setores ( id, nome, departamento_id, departamentos ( id, nome, orgao_id ) )
      )
    `)
    .eq('id', user.id)
    .single()

  if (error || !data) return null

  return data as Profile
}
