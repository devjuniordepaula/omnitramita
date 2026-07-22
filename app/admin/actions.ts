"use server"

import { createClient as createServerClient } from "@/utils/supabase/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function criarUsuarioInterno(formData: {
  nome: string
  email: string
  senhaTemporaria: string
  cargo?: string
  matricula?: string
  orgaoId?: string
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("is_gestor")
    .eq("id", user.id)
    .single()

  if (!perfil?.is_gestor) return { error: "Sem permissão" }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.senhaTemporaria,
    email_confirm: true,
    user_metadata: { nome: formData.nome },
  })

  if (error) return { error: error.message }

  await supabaseAdmin
    .from("profiles")
    .update({
      tipo: "interno",
      cargo: formData.cargo,
      matricula: formData.matricula,
      orgao_id: formData.orgaoId,
    })
    .eq("id", data.user.id)

  return { success: true }
}