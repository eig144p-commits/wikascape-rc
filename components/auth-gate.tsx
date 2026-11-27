'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BookOpen, GraduationCap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth, useHydrated, type Role } from '@/lib/auth'
import { cn } from '@/lib/utils'

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/ph-sun.png" alt="" width={64} height={64} className="size-16 object-contain" priority />
          <p className="mt-3 font-heading text-sm font-bold uppercase tracking-wider text-primary">Wika Escape</p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-balance">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  )
}

function AuthForm() {
  const { signUp, logIn } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')
    setError(null)
    setPending(true)
    try {
      if (mode === 'signup') {
        if (password !== String(data.get('confirm') ?? '')) throw new Error('Passwords do not match.')
        await signUp(email, password)
      } else {
        await logIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setPending(false)
    }
  }

  const isSignup = mode === 'signup'

  return (
    <AuthShell
      title={isSignup ? 'Create your account' : 'Welcome back'}
      subtitle={
        isSignup
          ? 'Sign up with your email to start exploring Philippine languages.'
          : 'Log in with your email to continue your language adventure.'
      }
    >
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-semibold">
        {(['login', 'signup'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => {
              setMode(value)
              setError(null)
            }}
            className={cn(
              'rounded-lg py-2 transition-colors',
              mode === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {value === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      <form key={mode} onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@school.edu.ph" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
        </div>
        {isSignup && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" />
          </div>
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending} className="mt-1">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {isSignup ? 'Create account' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}

const ROLE_OPTIONS: { value: Role; label: string; description: string; icon: typeof BookOpen }[] = [
  { value: 'student', label: 'Student', description: 'Solve puzzles and collect Ref magnets.', icon: BookOpen },
  { value: 'educator', label: 'Educator', description: 'Edit rooms, add lessons and answer help requests.', icon: GraduationCap },
]

function ProfileSetup() {
  const { user, completeProfile, logOut } = useAuth()
  const [role, setRole] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nickname = String(new FormData(event.currentTarget).get('nickname') ?? '').trim()
    if (nickname.length < 2 || nickname.length > 24) {
      setError('Your nickname should be between 2 and 24 characters.')
      return
    }
    if (!role) {
      setError('Please choose whether you are a student or an educator.')
      return
    }
    completeProfile(nickname, role)
  }

  return (
    <AuthShell title="Finish signing up" subtitle={`Signed in as ${user?.email}. Tell us a little about yourself.`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nickname">Nickname</Label>
          <Input id="nickname" name="nickname" required maxLength={24} placeholder="e.g. Juan, Teacher Ana" autoComplete="nickname" />
          <p className="text-xs text-muted-foreground">This is the name other people see on the site.</p>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Are you a student or an educator?</legend>
          {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                role === value ? 'border-primary bg-primary/5' : 'hover:bg-muted',
              )}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg',
                  role === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="font-semibold">{label}</span>
                <span className="text-sm text-muted-foreground">{description}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg">
          Start exploring
        </Button>
        <Button type="button" variant="ghost" onClick={logOut}>
          Use a different account
        </Button>
      </form>
    </AuthShell>
  )
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const { user, isProfileComplete } = useAuth()

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    )
  }
  if (!user) return <AuthForm />
  if (!isProfileComplete) return <ProfileSetup />
  return <>{children}</>
}

export function EducatorOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user?.role !== 'educator') {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <GraduationCap className="size-10 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Educators only</h1>
        <p className="mt-2 text-muted-foreground">This page is only available to educator accounts.</p>
      </main>
    )
  }
  return <>{children}</>
}
