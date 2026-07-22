"use client"

import { useState } from "react"
import { criarUsuarioInterno } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senhaTemporaria, setSenhaTemporaria] = useState("")
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCriar = async () => {
    setLoading(true)
    setMensagem(null)
    const result = await criarUsuarioInterno({ nome, email, senhaTemporaria })
    setMensagem(result.error ? `Erro: ${result.error}` : "Usuário interno criado com sucesso.")
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4 px-6">
      <h1 className="text-xl font-semibold">Criar usuário interno</h1>
      {mensagem && <p className="text-sm">{mensagem}</p>}
      <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <Input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Senha temporária" value={senhaTemporaria} onChange={(e) => setSenhaTemporaria(e.target.value)} />
      <Button onClick={handleCriar} disabled={loading} className="bg-[#0047AB] text-white">
        {loading ? "Criando..." : "Criar usuário"}
      </Button>
    </div>
  )
}