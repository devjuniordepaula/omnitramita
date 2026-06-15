import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-blue-500" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}