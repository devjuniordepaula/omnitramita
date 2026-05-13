'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ExternalUserForm } from '@/components/solicitar/external-user-form'
import { ProtocolRequestForm } from '@/components/solicitar/protocol-request-form'
import { CheckCircle, Copy, Check, UserCheck, FileText, Send, Zap } from 'lucide-react'
import type { Departamento, Setor } from '@/lib/types'

// Etapas do stepper
type Step = 'identificacao' | 'solicitacao' | 'confirmacao'

const STEPS = [
  { key: 'identificacao', label: 'Identificação', icon: UserCheck },
  { key: 'solicitacao',   label: 'Solicitação',   icon: FileText },
  { key: 'confirmacao',   label: 'Confirmação',   icon: Send },
] as const

export default function SolicitarPage() {
  const [step, setStep] = useState<Step>('identificacao')
  const [externalUserId, setExternalUserId] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [setores, setSetores] = useState<Setor[]>([])

  // Carregar estrutura organizacional no lado do cliente
  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('departamentos').select('*').order('nome'),
      supabase.from('setores').select('*').order('nome'),
    ]).then(([deptsRes, setoresRes]) => {
      setDepartamentos((deptsRes.data ?? []) as Departamento[])
      setSetores((setoresRes.data ?? []) as Setor[])
    })
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo + título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-900 rounded-xl">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">OmniTrâmita</span>
          </div>
          <p className="text-slate-500 text-sm">Portal de Atendimento ao Cidadão</p>
        </div>

        {/* Stepper */}
        {step !== 'confirmacao' && (
          <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.filter((s) => s.key !== 'confirmacao').map((s, idx) => {
              const stepIdx = STEPS.findIndex((x) => x.key === s.key)
              const isActive = stepIdx === currentStepIndex
              const isDone = stepIdx < currentStepIndex
              const Icon = s.icon
              return (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all
                    ${isActive ? 'bg-blue-600 text-white shadow-md' : ''}
                    ${isDone ? 'bg-emerald-100 text-emerald-700' : ''}
                    ${!isActive && !isDone ? 'text-slate-400' : ''}
                  `}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
                  </div>
                  {idx < 1 && (
                    <div className={`w-8 h-px mx-1 ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">

          {/* ─── ETAPA 1: Identificação ─────────────────────── */}
          {step === 'identificacao' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Sua identificação</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Informe seu CPF ou CNPJ para continuar. Seus dados são usados apenas para identificação da solicitação.
                </p>
              </div>
              <ExternalUserForm
                onSuccess={(userId) => {
                  setExternalUserId(userId)
                  setStep('solicitacao')
                }}
              />
            </>
          )}

          {/* ─── ETAPA 2: Solicitação ────────────────────────── */}
          {step === 'solicitacao' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Sua solicitação</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Selecione o tipo, o destino e descreva o motivo da sua solicitação.
                </p>
              </div>
              <ProtocolRequestForm
                externalUserId={externalUserId}
                departamentos={departamentos}
                setores={setores}
                onSuccess={(code) => {
                  setTrackingCode(code)
                  setStep('confirmacao')
                }}
              />
              <button
                type="button"
                onClick={() => setStep('identificacao')}
                className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Voltar à identificação
              </button>
            </>
          )}

          {/* ─── ETAPA 3: Confirmação ────────────────────────── */}
          {step === 'confirmacao' && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">Solicitação enviada!</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sua solicitação foi registrada com sucesso. Guarde o número de protocolo abaixo para acompanhamento.
                </p>
              </div>

              {/* Código de protocolo */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">
                  Número do Protocolo
                </p>
                <p className="text-2xl font-mono font-bold tracking-widest text-slate-800">
                  {trackingCode}
                </p>
                <button
                  id="btn-copiar-protocolo"
                  onClick={handleCopy}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 mx-auto transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar protocolo'}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                O seu protocolo foi encaminhado ao setor responsável. Em breve você receberá um retorno.
              </p>

              <button
                id="btn-nova-solicitacao"
                onClick={() => {
                  setStep('identificacao')
                  setExternalUserId('')
                  setTrackingCode('')
                }}
                className="w-full py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Fazer nova solicitação
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          OmniTrâmita — Sistema de Gestão de Documentos Municipais
        </p>
      </div>
    </div>
  )
}
