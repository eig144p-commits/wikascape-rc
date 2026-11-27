'use client'

import { EMPTY_LIST, EMPTY_OBJECT, KEYS, useStoredState } from './storage'

export type RoomNoteKind = 'lesson' | 'vocabulary' | 'culture' | 'resource'

export type RoomNote = {
  id: string
  kind: RoomNoteKind
  title: string
  body: string
  link?: string
  author: string
  createdAt: number
}

export const NOTE_KIND_LABELS: Record<RoomNoteKind, string> = {
  lesson: 'Lesson',
  vocabulary: 'Vocabulary',
  culture: 'Culture',
  resource: 'Resource',
}

export function safeLink(link?: string) {
  if (!link) return undefined
  try {
    const url = new URL(link)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export function useRoomNotes(slug: string) {
  const [all, setAll] = useStoredState<Record<string, RoomNote[]>>(KEYS.roomNotes, EMPTY_OBJECT)
  const notes = all[slug] ?? (EMPTY_LIST as RoomNote[])
  return {
    notes,
    add: (note: RoomNote) => setAll((previous) => ({ ...previous, [slug]: [...(previous[slug] ?? []), note] })),
    remove: (id: string) =>
      setAll((previous) => ({ ...previous, [slug]: (previous[slug] ?? []).filter((n) => n.id !== id) })),
  }
}
