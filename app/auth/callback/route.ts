import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Rota chamada pelo Supabase após autenticação (e-mail ou OAuth).
 * Troca o `code` por uma sessão válida e redireciona o utilizador.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error_desc = searchParams.get('error_description')

  if (error_desc) {
    console.error('Supabase Callback Error:', error_desc)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('Supabase exchangeCodeForSession error:', error.message)
    }
  } else {
    console.warn('Callback accessed without code:', request.url)
  }

  // Se houve erro ou o código está em falta, redirecionar para login com erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
