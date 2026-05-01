"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { UserPlus, Loader2, AlertCircle, MailCheck } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
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
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardHeader className="flex flex-col items-center space-y-2 pb-4 pt-8">
            <div className="p-4 bg-slate-900 rounded-2xl shadow-sm">
              <MailCheck className="text-white size-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 text-center">
              Verifique o seu e-mail
            </CardTitle>
            <CardDescription className="text-slate-500 text-center max-w-xs">
              Enviámos um link de confirmação para{" "}
              <span className="font-semibold text-slate-700">{email}</span>.
              Clique no link para activar a sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm text-slate-600">
              <p className="font-medium text-slate-800">O que fazer agora:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Abra o seu e-mail <span className="font-medium">{email}</span></li>
                <li>Clique em <span className="font-semibold">"Confirmar e-mail"</span></li>
                <li>Será redirecionado automaticamente para o sistema</li>
              </ol>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Não recebeu? Verifique a pasta de spam ou{" "}
              <button
                onClick={() => { setEmailSent(false); setEmail(""); setPassword("") }}
                className="text-slate-600 underline hover:text-slate-900"
              >
                tente novamente
              </button>
              .
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/login"
              className="w-full text-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Já confirmou? <span className="font-bold text-slate-900">Fazer login →</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="flex flex-col items-center space-y-2 pb-6">
          <div className="p-3 bg-slate-900 rounded-xl shadow-sm">
            <UserPlus className="text-white size-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Criar Conta</CardTitle>
          <CardDescription className="text-slate-500">Solicite o seu acesso ao OmniTramita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full h-11 bg-white hover:bg-slate-50 text-slate-700 font-medium border-slate-200" 
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
            Registar com o Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500 font-medium">Ou continue com e-mail</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="E-mail funcional"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Crie uma palavra-passe forte"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 h-11" disabled={loading || googleLoading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  A enviar...
                </>
              ) : "Solicitar Acesso"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col mt-2">
          <p className="text-sm text-slate-500 text-center">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-slate-900 font-bold hover:underline">
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}