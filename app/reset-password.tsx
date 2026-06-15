import { headers } from 'next/headers'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage() {
  await headers()
  return <ResetPasswordForm />
}