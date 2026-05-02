import { FileText } from "lucide-react"
import { ChatWidget } from "@/components/chatbot/chat-widget"

export default function SolicitarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="p-2 bg-blue-600 rounded-lg shadow-md">
            <FileText className="text-white size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">OmniTrâmita</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Portal do Cidadão</p>
          </div>
        </div>
        {children}
      </div>
      <ChatWidget />
    </div>
  )
}
