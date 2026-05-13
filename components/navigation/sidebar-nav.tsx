'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Building2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  gestorOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Meus Processos', href: '/processos', icon: FileText },
  { label: 'Usuários', href: '/usuarios', icon: Users, gestorOnly: true },
  { label: 'Organização', href: '/organizacao', icon: Building2, gestorOnly: true },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
]

interface SidebarNavProps {
  profile: Profile | null
}

export function SidebarNav({ profile }: SidebarNavProps) {
  const pathname = usePathname()
  const isGestor = profile?.is_gestor === true

  const visibleItems = navItems.filter(
    (item) => !item.gestorOnly || isGestor
  )

  return (
    <nav className="mt-6 px-4 space-y-1">
      {visibleItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn(
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Icon className="h-5 w-5 mr-3 shrink-0" />
            {item.label}
            {item.gestorOnly && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                Gestor
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
