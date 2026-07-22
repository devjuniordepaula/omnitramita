"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Loader2, AlertCircle, MailCheck } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { nome }, // a trigger grava em profiles.nome_completo e força tipo="externo"
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      setEmailSent(true)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setGoogleLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center pb-4 pt-2">
            <div className="p-3.5 bg-[#0047AB] rounded-2xl mb-4">
              <MailCheck className="text-white size-7" />
            </div>
            <h1 className="text-xl font-semibold text-[#0B1220] tracking-tight">Verifique o seu e-mail</h1>
            <p className="text-sm text-[#5B6472] mt-2 max-w-xs">
              Enviamos um link de confirmação para{" "}
              <span className="font-medium text-[#0B1220]">{email}</span>. Clique no link para ativar sua conta.
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F9FD] border border-[#E3E7EF] p-4 space-y-2 text-sm text-[#5B6472] mt-4">
            <p className="font-medium text-[#0B1220]">O que fazer agora:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Abra o seu e-mail <span className="font-medium text-[#0B1220]">{email}</span>
              </li>
              <li>
                Clique em <span className="font-medium text-[#0B1220]">"Confirmar e-mail"</span>
              </li>
              <li>Você será redirecionado automaticamente para o sistema</li>
            </ol>
          </div>

          <p className="text-xs text-[#9AA3B2] mt-4 text-center">
            Não recebeu?{" "}
            <button
              onClick={() => {
                setEmailSent(false)
                setEmail("")
                setPassword("")
              }}
              className="text-[#0047AB] underline hover:text-[#003580]"
            >
              tente novamente
            </button>
            .
          </p>

          <div className="mt-6 pt-6 border-t border-[#E3E7EF]">
            <Link
              href="/login"
              className="block w-full text-center text-sm text-[#5B6472] hover:text-[#0B1220] transition-colors"
            >
              Já confirmou? <span className="font-semibold text-[#0047AB]">Fazer login →</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center pb-6">
          <div className="p-3 bg-[#0047AB] rounded-xl mb-4">
            <UserPlus className="text-white size-6" />
          </div>
          <h1 className="text-xl font-semibold text-[#0B1220] tracking-tight">Criar conta</h1>
          <p className="text-sm text-[#5B6472] mt-1">Solicite seu acesso ao OmniTrâmita</p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 mb-4">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full h-11 bg-white hover:bg-[#F7F8FA] text-[#0B1220] font-medium border-[#E3E7EF]"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Registrar com o Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E3E7EF]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-white px-2 text-[#9AA3B2] font-medium">ou continue com e-mail</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="h-11 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
          />
          <Input
            type="email"
            placeholder="E-mail funcional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
          />
          <Input
            type="password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-11 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
          />
          <Button
            className="w-full h-11 bg-[#0047AB] hover:bg-[#003580] text-white border-0 font-medium"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Solicitar acesso"
            )}
          </Button>
        </form>

        <p className="text-sm text-[#5B6472] text-center mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[#0B1220] font-medium hover:text-[#0047AB] transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}