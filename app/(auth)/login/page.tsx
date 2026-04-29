"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Zap, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Autenticação usando o novo cliente SSR
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      alert("Erro ao entrar: " + error.message)
      setLoading(false)
    } else {
      // router.refresh garante que o Middleware perceba o novo cookie de sessão
      router.refresh()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="flex flex-col items-center space-y-2 pb-8">
          <div className="p-3 bg-slate-900 rounded-xl shadow-sm">
            <Zap className="text-white size-6 fill-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">OmniTramita</CardTitle>
          <CardDescription className="text-slate-500">Entre com as suas credenciais para aceder</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="E-mail" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Palavra-passe" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  A verificar...
                </>
              ) : "Aceder ao Sistema"}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              Ainda não tem conta? <Link href="/register" className="text-slate-900 font-bold hover:underline">Solicitar acesso</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}