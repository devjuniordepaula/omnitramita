"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { MessageCircle, X, SendHorizontal, Bot, User } from "lucide-react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Olá! Sou a Omni, a assistente virtual do OmniTramita. Como posso te ajudar com a sua solicitação hoje?"
      }
    ]
  })

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 z-50 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="font-semibold hidden md:inline">Precisa de ajuda?</span>
        </button>
      )}

      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Omni Virtual</h3>
                <p className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 h-96 overflow-y-auto bg-slate-50 space-y-4 flex flex-col">
            {messages.map(m => (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-sm border border-slate-200 text-blue-600'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white shadow-sm border border-slate-100 rounded-tl-sm text-slate-700'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="self-start flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 size-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-200 text-slate-400">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl text-sm bg-white shadow-sm border border-slate-100 rounded-tl-sm text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input de Mensagem */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              value={input}
              placeholder="Digite sua dúvida..."
              onChange={handleInputChange}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SendHorizontal size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
