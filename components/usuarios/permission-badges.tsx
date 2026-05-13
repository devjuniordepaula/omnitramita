import { Eye, Send, Pen } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface PermissionBadgesProps {
  profile: Pick<Profile, 'can_view' | 'can_dispatch' | 'can_sign' | 'is_gestor'>
  size?: 'sm' | 'md'
}

export function PermissionBadges({ profile, size = 'md' }: PermissionBadgesProps) {
  const cls = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px] gap-1'
    : 'px-2 py-1 text-xs gap-1.5'

  const iconSize = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'

  const badges = [
    {
      show: profile.is_gestor,
      label: 'Gestor',
      className: 'bg-slate-900 text-white',
      icon: null,
    },
    {
      show: !profile.is_gestor && profile.can_view,
      label: 'Visualizar',
      className: 'bg-blue-100 text-blue-700',
      icon: <Eye className={iconSize} />,
    },
    {
      show: !profile.is_gestor && profile.can_dispatch,
      label: 'Despachar',
      className: 'bg-amber-100 text-amber-700',
      icon: <Send className={iconSize} />,
    },
    {
      show: !profile.is_gestor && profile.can_sign,
      label: 'Assinar',
      className: 'bg-violet-100 text-violet-700',
      icon: <Pen className={iconSize} />,
    },
  ]

  return (
    <div className="flex flex-wrap gap-1">
      {badges
        .filter((b) => b.show)
        .map((badge) => (
          <span
            key={badge.label}
            className={`inline-flex items-center rounded-full font-semibold ${cls} ${badge.className}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        ))}
    </div>
  )
}
