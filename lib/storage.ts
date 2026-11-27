'use client'

import { useCallback, useSyncExternalStore } from 'react'

export const KEYS = {
  magnets: 'wika:magnets',
  magnetPositions: 'wika:magnet-positions',
  puzzles: 'wika:puzzles',
  progress: (slug: string) => `wika:progress:${slug}`,
  help: 'wika:help-requests',
  forum: 'wika:forum',
  accounts: 'wika:accounts',
  session: 'wika:session',
  roomNotes: 'wika:room-notes',
}

const listeners = new Set<() => void>()
const cache = new Map<string, { raw: string | null; value: unknown }>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function read<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key)
  const cached = cache.get(key)
  if (cached && cached.raw === raw) return cached.value as T
  let value = fallback
  if (raw) {
    try {
      value = JSON.parse(raw) as T
    } catch {
      value = fallback
    }
  }
  cache.set(key, { raw, value })
  return value
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function useStoredState<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  )
  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const previous = read(key, fallback)
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(previous) : next
      window.localStorage.setItem(key, JSON.stringify(resolved))
      listeners.forEach((listener) => listener())
    },
    [key, fallback],
  )
  return [value, setValue] as const
}

export type EarnedMagnet = { slug: string; earnedAt: number }
export const EMPTY_LIST: never[] = []
export const EMPTY_OBJECT: Record<string, never> = {}
