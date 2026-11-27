'use client'

import { useSyncExternalStore } from 'react'
import { EMPTY_LIST, KEYS, makeId, useStoredState } from './storage'

export type Role = 'student' | 'educator'

export type Account = {
  id: string
  email: string
  passwordHash: string
  nickname?: string
  role?: Role
  createdAt: number
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim())
}

async function hashPassword(email: string, password: string) {
  const bytes = new TextEncoder().encode(`wika:${email}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

const noopSubscribe = () => () => {}

export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

export function useAuth() {
  const [accounts, setAccounts] = useStoredState<Account[]>(KEYS.accounts, EMPTY_LIST)
  const [sessionId, setSessionId] = useStoredState<string | null>(KEYS.session, null)
  const user = accounts.find((account) => account.id === sessionId) ?? null

  async function signUp(rawEmail: string, password: string) {
    const email = rawEmail.trim().toLowerCase()
    if (!isValidEmail(email)) throw new Error('Please enter a valid email address.')
    if (password.length < 8) throw new Error('Password must be at least 8 characters.')
    if (accounts.some((account) => account.email === email)) {
      throw new Error('An account with this email already exists. Try logging in.')
    }
    const account: Account = {
      id: makeId(),
      email,
      passwordHash: await hashPassword(email, password),
      createdAt: Date.now(),
    }
    setAccounts((previous) => [...previous, account])
    setSessionId(account.id)
  }

  async function logIn(rawEmail: string, password: string) {
    const email = rawEmail.trim().toLowerCase()
    const account = accounts.find((a) => a.email === email)
    const hash = await hashPassword(email, password)
    if (!account || account.passwordHash !== hash) {
      throw new Error('Incorrect email or password.')
    }
    setSessionId(account.id)
  }

  function completeProfile(nickname: string, role: Role) {
    if (!user) return
    setAccounts((previous) =>
      previous.map((account) =>
        account.id === user.id ? { ...account, nickname: nickname.trim(), role } : account,
      ),
    )
  }

  function logOut() {
    setSessionId(null)
  }

  const isProfileComplete = Boolean(user?.nickname && user?.role)

  return { user, isProfileComplete, signUp, logIn, logOut, completeProfile }
}
