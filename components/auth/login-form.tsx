"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, ArrowLeft, Search, Lock, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

type View = "login" | "forgot"

export function LoginForm() {
  const [view, setView] = useState<View>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const callbackError = searchParams.get("error")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.refresh()
      router.push("/")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setForgotError(error.message)
      setForgotLoading(false)
    } else {
      setForgotSent(true)
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white">
      {/* Painel esquerdo — ilustração */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#F3F6FC] p-12">
        {/* formas decorativas de fundo */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <circle cx="500" cy="90" r="140" fill="#E4ECFA" />
          <circle cx="40" cy="800" r="180" fill="#EAF0FB" />
          <rect x="-40" y="480" width="180" height="180" rx="36" fill="#E9EFFA" transform="rotate(18 50 570)" />
        </svg>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-[#0047AB] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OT</span>
          </div>
          <span className="text-[#0B1220] font-semibold tracking-tight text-lg">OmniTrâmita</span>
        </div>

        {/* personagem flat design */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <svg viewBox="0 0 420 460" className="w-full max-w-sm" fill="none">
            <ellipse cx="210" cy="430" rx="130" ry="16" fill="#DCE6F7" />
            <rect x="255" y="120" width="120" height="230" rx="14" fill="#DCE6F7" />
            <rect x="255" y="120" width="120" height="230" rx="14" stroke="#C7D7F0" strokeWidth="2" />
            <circle cx="345" cy="235" r="6" fill="#0047AB" />

            <g transform="translate(268 60)">
              <rect x="0" y="26" width="56" height="46" rx="10" fill="#0047AB" />
              <path d="M10 26V16a18 18 0 0 1 36 0v10" stroke="#0047AB" strokeWidth="8" strokeLinecap="round" />
              <circle cx="28" cy="48" r="6" fill="white" />
              <rect x="25" y="50" width="6" height="12" rx="3" fill="white" />
            </g>

            <rect x="20" y="400" width="380" height="10" rx="5" fill="#E9EFFA" />

            <g transform="translate(58 150)">
              <rect x="70" y="185" width="26" height="80" rx="13" fill="#0B1220" opacity="0.9" />
              <rect x="34" y="185" width="26" height="86" rx="13" fill="#111827" />
              <rect x="26" y="262" width="42" height="16" rx="8" fill="#0047AB" />
              <rect x="66" y="256" width="42" height="16" rx="8" fill="#0047AB" />
              <path d="M20 90 Q20 60 60 60 Q100 60 100 90 L106 200 Q60 218 14 200 Z" fill="#FF7A59" />
              <path d="M46 62 L60 82 L74 62" fill="#F3F6FC" />
              <path d="M96 96 Q128 100 132 132" stroke="#FF7A59" strokeWidth="22" strokeLinecap="round" />
              <rect x="118" y="118" width="34" height="24" rx="4" fill="white" stroke="#0047AB" strokeWidth="3" transform="rotate(8 135 130)" />
              <path d="M24 96 Q0 120 10 150" stroke="#FF7A59" strokeWidth="22" strokeLinecap="round" />
              <rect x="48" y="42" width="24" height="24" fill="#F2C9A0" />
              <circle cx="60" cy="30" r="32" fill="#F2C9A0" />
              <path d="M28 26 Q30 -4 60 -4 Q92 -4 92 26 Q92 6 60 8 Q32 8 28 26 Z" fill="#1F2937" />
              <circle cx="49" cy="30" r="3" fill="#1F2937" />
              <circle cx="71" cy="30" r="3" fill="#1F2937" />
              <path d="M50 42 Q60 48 70 42" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            <circle cx="70" cy="90" r="7" fill="#0047AB" opacity="0.5" />
            <circle cx="360" cy="380" r="9" fill="#FF7A59" opacity="0.5" />
            <path d="M330 60 l10 0 M335 55 l0 10" stroke="#0047AB" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xs">
          <p className="text-[#0B1220] font-semibold text-lg leading-snug">
            Acesso simples, gestão organizada.
          </p>
          <p className="text-sm text-[#5B6472] mt-1.5">
            Entre com sua conta para acompanhar seus processos em um só lugar.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* logo mobile */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10 justify-center">
            <div className="size-9 rounded-lg bg-[#0047AB] flex items-center justify-center">
              <span className="text-white font-bold text-sm">OT</span>
            </div>
            <span className="text-[#0B1220] font-semibold tracking-tight text-lg">OmniTrâmita</span>
          </div>

          {view === "forgot" ? (
            <>
              <button
                onClick={() => {
                  setView("login")
                  setForgotSent(false)
                  setForgotError(null)
                }}
                className="flex items-center gap-1.5 text-sm text-[#5B6472] hover:text-[#0B1220] transition-colors mb-8"
              >
                <ArrowLeft className="size-4" />
                Voltar ao login
              </button>

              {forgotSent ? (
                <div className="py-4">
                  <div className="inline-flex p-3 bg-[#E9F7EF] rounded-2xl mb-4">
                    <CheckCircle2 className="size-6 text-[#1E9E5A]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#0B1220] mb-1.5 tracking-tight">Link enviado</h2>
                  <p className="text-sm text-[#5B6472]">
                    Verifique <span className="text-[#0B1220] font-medium">{forgotEmail}</span> para redefinir sua senha.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-[#0B1220] tracking-tight">Recuperar acesso</h2>
                  <p className="text-sm text-[#5B6472] mt-1.5 mb-7">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                  </p>

                  {forgotError && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 mb-5">
                      <AlertCircle className="size-4 mt-0.5 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9AA3B2]" />
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        className="h-11 pl-9 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
                      />
                    </div>
                    <Button
                      className="w-full h-11 bg-[#0047AB] hover:bg-[#003580] text-white border-0 font-medium"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar link de recuperação"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              {/* Bloco de boas-vindas centralizado */}
              <div className="text-center mb-7">
                <h1 className="text-xl font-semibold text-[#0B1220] tracking-tight">Bem-vindo de volta</h1>
                <p className="text-sm text-[#5B6472] mt-1.5">Entre com sua conta para acessar o painel.</p>
              </div>

              {callbackError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 mb-5">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  <span>Ocorreu um erro na autenticação. Tente novamente.</span>
                </div>
              )}
              {errorMsg && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600 mb-5">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9AA3B2]" />
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-9 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9AA3B2]" />
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-9 bg-white border-[#E3E7EF] text-[#0B1220] placeholder:text-[#9AA3B2] focus-visible:ring-[#0047AB]/30 focus-visible:border-[#0047AB]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-[#5B6472] hover:text-[#0047AB] transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <Button
                  className="w-full h-11 bg-[#0047AB] hover:bg-[#003580] text-white border-0 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E3E7EF] space-y-4">
                <Link
                  href="/rastrear"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-[#E3E7EF] text-sm font-medium text-[#0B1220] hover:border-[#0047AB]/40 hover:bg-[#F7F9FD] transition-colors"
                >
                  <Search className="size-4" />
                  Consultar protocolo
                </Link>
                <p className="text-sm text-[#5B6472] text-center">
                  Ainda não tem conta?{" "}
                  <Link href="/register" className="text-[#0B1220] font-medium hover:text-[#0047AB] transition-colors">
                    Solicitar acesso
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}