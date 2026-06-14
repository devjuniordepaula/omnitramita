import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<Loader2 className="size-8 animate-spin text-blue-600" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}