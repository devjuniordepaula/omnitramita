"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true)
      } else {
        setSessionError(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl shadow-blue-500/5 p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
              <Zap className="text-white size-6 fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nova senha</h1>
            <p className="text-sm text-slate-400 mt-1">Defina uma nova senha de acesso</p>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl mb-4">
                <CheckCircle2 className="size-7 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Senha atualizada!</h2>
              <p className="text-sm text-slate-400">Redirecionando para o login...</p>
            </div>
          ) : sessionError ? (
            <div className="text-center py-4">
              <div className="inline-flex p-3 bg-red-500/10 rounded-2xl mb-4">
                <AlertCircle className="size-7 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Link inválido ou expirado</h2>
              <p className="text-sm text-slate-400">Solicite um novo link de recuperação na tela de login.</p>
            </div>
          ) : !sessionReady ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-blue-400" />
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 mb-4">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 pl-9 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 pl-9 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500"
                  />
                </div>
                <Button
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-0"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Salvando...
                    </>
                  ) : "Salvar nova senha"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}