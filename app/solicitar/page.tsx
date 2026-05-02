"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileUp, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  applicant_name: z.string().min(3, {
    message: "O nome deve ter no mínimo 3 caracteres.",
  }),
  applicant_email: z.string().email({
    message: "Insira um e-mail válido.",
  }),
  title: z.string().min(5, {
    message: "O assunto da solicitação é muito curto.",
  }),
  description: z.string().optional(),
})

export default function SolicitarPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [trackingCode, setTrackingCode] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant_name: "",
      applicant_email: "",
      title: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aqui no futuro integraremos com o Supabase (Fase 4/5)
    console.log(values)
    
    // Simular a geração de um código
    const code = "OMNI-" + Math.floor(100000 + Math.random() * 900000)
    setTrackingCode(code)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Solicitação Enviada!</h2>
        <p className="text-slate-600">
          Sua solicitação foi registrada com sucesso. Guarde o seu protocolo para acompanhamento:
        </p>
        <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 mt-4">
          <p className="text-2xl font-mono font-bold tracking-wider text-slate-800">{trackingCode}</p>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Nós enviaremos atualizações para o e-mail cadastrado.
        </p>
        <Button 
          variant="outline" 
          className="mt-6 w-full"
          onClick={() => {
            setIsSubmitted(false)
            form.reset()
          }}
        >
          Fazer nova solicitação
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Nova Solicitação</h2>
        <p className="text-slate-500 text-sm mt-1">Preencha os dados abaixo para submeter um documento ou pedido ao nosso setor.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="applicant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicant_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto (Título)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Solicitação de Alvará, Requerimento de Férias..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (Opcional)</FormLabel>
                <FormControl>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Detalhes adicionais sobre sua solicitação..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload Mockup */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <FileUp className="mx-auto size-8 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-700">Clique para enviar anexos</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG até 10MB</p>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Enviar Solicitação
          </Button>
        </form>
      </Form>
    </div>
  )
}
