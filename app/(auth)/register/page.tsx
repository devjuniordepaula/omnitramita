"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { UserPlus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      alert("Pedido enviado! Verifique o seu e-mail para confirmar a conta.")
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="flex flex-col items-center space-y-2 pb-8">
          <div className="p-3 bg-slate-900 rounded-xl shadow-sm">
            <UserPlus className="text-white size-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Criar Conta</CardTitle>
          <CardDescription className="text-slate-500">Solicite o seu acesso ao OmniTramita</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
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
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 h-11" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Solicitar Acesso"}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              Já tem uma conta? <Link href="/login" className="text-slate-900 font-bold hover:underline">Fazer login</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}