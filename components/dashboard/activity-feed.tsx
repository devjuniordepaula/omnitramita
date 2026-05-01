import { User, FileText, ArrowRight, CheckCircle2 } from "lucide-react"

// Mock data para simular eventos do sistema
const activities = [
  {
    id: 1,
    user: "Maria (RH)",
    action: "moveu",
    target: "OFÍCIO Nº 123/2026",
    to: "Em Análise",
    time: "Há 10 min",
    icon: ArrowRight,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    user: "João Silva",
    action: "despachou",
    target: "MEMO 045/ADM",
    to: "Setor Jurídico",
    time: "Há 2 horas",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  {
    id: 3,
    user: "Sistema",
    action: "recebeu",
    target: "PROCESSO 001/26",
    to: "A Distribuir",
    time: "Há 3 horas",
    icon: FileText,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    id: 4,
    user: "Diretoria",
    action: "assinou",
    target: "CONTRATO DE SERVIÇOS",
    time: "Ontem, 16:45",
    icon: User,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
]

export function ActivityFeed() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Atividades Recentes</h3>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200"></div>
          
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="relative pl-10">
                  {/* Ícone da timeline */}
                  <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full ${activity.bgColor} border-2 border-white flex items-center justify-center z-10`}>
                    <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  
                  {/* Conteúdo */}
                  <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium text-slate-900">{activity.target}</span>
                      {activity.to && (
                        <>
                          {" "}para <span className="font-semibold">{activity.to}</span>
                        </>
                      )}
                    </p>
                    <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          Ver todo o histórico
        </button>
      </div>
    </div>
  )
}
