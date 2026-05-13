import type { Profile } from '@/lib/types'

export function isGestor(profile: Profile | null): boolean {
  return profile?.is_gestor === true && profile?.ativo === true
}

export function canView(profile: Profile | null): boolean {
  return profile?.ativo === true && (profile?.can_view === true || profile?.is_gestor === true)
}

export function canDispatch(profile: Profile | null): boolean {
  return profile?.ativo === true && (profile?.can_dispatch === true || profile?.is_gestor === true)
}

export function canSign(profile: Profile | null): boolean {
  return profile?.ativo === true && (profile?.can_sign === true || profile?.is_gestor === true)
}
