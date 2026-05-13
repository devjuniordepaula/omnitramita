import { createClient } from '@/utils/supabase/server'
import type { Profile } from '@/lib/types'
import { appendFileSync } from 'fs'
import { join } from 'path'

const logFile = join(process.cwd(), 'debug_log.txt')
function log(msg: string) {
  appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`)
}

export async function getProfile(): Promise<Profile | null> {
  log('getProfile: Iniciando')
  const supabase = await createClient()

  log('getProfile: Buscando usuário auth')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    log('getProfile: Usuário não encontrado')
    return null
  }

  log(`getProfile: Buscando perfil para ${user.id}`)
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

  if (error || !data) {
    log(`getProfile: Erro ou dados vazios: ${JSON.stringify(error)}`)
    return null
  }

  log('getProfile: Perfil retornado com sucesso')
  return data as Profile
}
