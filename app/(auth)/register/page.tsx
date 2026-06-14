import { headers } from 'next/headers'
import { RegisterForm } from "@/components/auth/register-form"

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  await headers()
  return <RegisterForm />
}