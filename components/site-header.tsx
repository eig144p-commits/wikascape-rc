'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Map, MessagesSquare, School } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { EMPTY_LIST, KEYS, useStoredState, type EarnedMagnet } from '@/lib/storage'

const NAV = [
  { href: '/', label: 'Map', icon: Map, educatorOnly: false },
  { href: '/forum', label: 'Forum', icon: MessagesSquare, educatorOnly: false },
  { href: '/educators', label: 'Educators', icon: School, educatorOnly: true },
]

export function SiteHeader() {
  const [magnets] = useStoredState<EarnedMagnet[]>(KEYS.magnets, EMPTY_LIST)
  const { user, logOut } = useAuth()
  const isEducator = user?.role === 'educator'

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            W
          </span>
          <span className="hidden sm:inline">Wika Escape</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {NAV.filter((item) => !item.educatorOnly || isEducator).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sr-only sm:hidden">{label}</span>
            </Link>
          ))}
          <Link
            href="/magnets"
            aria-label={`My Ref Magnets: ${magnets.length} collected`}
            className="ml-1 flex items-center gap-1.5 rounded-full bg-accent py-1 pl-1.5 pr-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Image src="/images/ph-sun.png" alt="" width={24} height={24} className="size-6 object-contain" />
            {magnets.length}
          </Link>
          {user && (
            <div className="ml-1 flex items-center gap-1 border-l pl-2">
              <span className="hidden max-w-32 truncate text-sm font-semibold md:inline" title={user.email}>
                {user.nickname}
                <span className="ml-1 font-normal capitalize text-muted-foreground">({user.role})</span>
              </span>
              <Button variant="ghost" size="icon-sm" onClick={logOut} aria-label="Log out">
                <LogOut aria-hidden="true" />
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
