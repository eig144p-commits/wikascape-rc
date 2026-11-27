'use client'

import { useMemo } from 'react'
import { LANGUAGES, getLanguage, normalize, type Language } from './languages'
import { EMPTY_OBJECT, KEYS, useStoredState } from './storage'

export type Puzzle = {
  id: string
  type: 'choice' | 'text'
  prompt: string
  options: string[]
  answer: string
  hint?: string
}

function rotate<T>(items: T[], by: number) {
  const offset = by % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

function otherYesWords(language: Language) {
  const seen = new Set([normalize(language.yes)])
  const words: string[] = []
  for (const other of LANGUAGES) {
    if (!seen.has(normalize(other.yes))) {
      seen.add(normalize(other.yes))
      words.push(other.yes)
    }
    if (words.length === 3) break
  }
  return words
}

export function defaultPuzzles(language: Language): Puzzle[] {
  const index = LANGUAGES.indexOf(language)
  const firstPhrase = language.phrases[0]
  const decoys = ['Batanes', 'Sulu', 'Palawan', 'Benguet', 'Aklan', 'Tawi-Tawi'].slice(
    index % 3,
    (index % 3) + 3,
  )
  return [
    {
      id: `${language.slug}-1`,
      type: 'choice',
      prompt: `What does "${firstPhrase.native}" mean?`,
      options: rotate(['Good morning', 'Good night', 'Thank you', 'Goodbye'], index),
      answer: firstPhrase.english,
      hint: 'People say this when the sun is just coming up.',
    },
    {
      id: `${language.slug}-2`,
      type: 'choice',
      prompt: `How do you say "Yes" in ${language.name}?`,
      options: rotate([language.yes, ...otherYesWords(language)], index + 1),
      answer: language.yes,
      hint: `It starts with the letter "${language.yes[0]}".`,
    },
    {
      id: `${language.slug}-3`,
      type: 'text',
      prompt: `Type the ${language.name} word for "No".`,
      options: [],
      answer: language.no,
      hint: `It has ${language.no.length} letters and starts with "${language.no[0]}".`,
    },
    {
      id: `${language.slug}-4`,
      type: 'choice',
      prompt: `Which of these provinces is home to ${language.name} speakers?`,
      options: rotate([language.provinces[0], ...decoys], index + 2),
      answer: language.provinces[0],
      hint: `Look at the ${language.region} area on the map.`,
    },
  ]
}

export function isCorrect(puzzle: Puzzle, attempt: string) {
  return puzzle.answer
    .split('|')
    .map(normalize)
    .filter(Boolean)
    .includes(normalize(attempt))
}

export function usePuzzles(slug: string) {
  const [custom, setCustom] = useStoredState<Record<string, Puzzle[]>>(
    KEYS.puzzles,
    EMPTY_OBJECT,
  )
  const defaults = useMemo(() => {
    const language = getLanguage(slug)
    return language ? defaultPuzzles(language) : []
  }, [slug])

  return {
    puzzles: custom[slug] ?? defaults,
    isCustom: Boolean(custom[slug]),
    save: (puzzles: Puzzle[]) => setCustom((previous) => ({ ...previous, [slug]: puzzles })),
    reset: () =>
      setCustom((previous) => {
        const next = { ...previous }
        delete next[slug]
        return next
      }),
  }
}
