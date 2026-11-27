'use client'

import { useState } from 'react'
import { DoorClosed, DoorOpen, KeyRound, Lightbulb, Lock, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getLanguage, normalize } from '@/lib/languages'
import { isCorrect, usePuzzles, type Puzzle } from '@/lib/puzzles'
import { EMPTY_LIST, KEYS, useStoredState, type EarnedMagnet } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Progress = { solved: string[]; escaped: boolean }
const EMPTY_PROGRESS: Progress = { solved: [], escaped: false }

function PuzzleCard({
  number,
  puzzle,
  solved,
  fragment,
  onSolved,
}: {
  number: number
  puzzle: Puzzle
  solved: boolean
  fragment?: string
  onSolved: () => void
}) {
  const [misses, setMisses] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [typed, setTyped] = useState('')

  function attempt(value: string) {
    if (isCorrect(puzzle, value)) {
      setWrong(null)
      onSolved()
    } else {
      setWrong(value)
      setMisses((count) => count + 1)
    }
  }

  return (
    <article
      className={cn(
        'rounded-2xl border bg-card p-5 transition-colors',
        solved && 'border-foreground/20 bg-muted/60',
      )}
      aria-labelledby={`puzzle-${puzzle.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={`puzzle-${puzzle.id}`} className="font-semibold leading-snug">
          <span className="mr-2 text-muted-foreground">#{number}</span>
          {puzzle.prompt}
        </h3>
        {solved && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
            <KeyRound className="size-4" aria-hidden="true" />
            Clue: {fragment || '·'}
          </span>
        )}
      </div>
      {!solved && (
        <div className="mt-4">
          {puzzle.type === 'choice' ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {puzzle.options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  onClick={() => attempt(option)}
                  className={cn(
                    'h-auto justify-start bg-muted/40 py-2.5 text-left whitespace-normal',
                    wrong === option && 'animate-shake border-destructive text-destructive',
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                attempt(typed)
              }}
              className="flex gap-2"
            >
              <label htmlFor={`answer-${puzzle.id}`} className="sr-only">
                Your answer
              </label>
              <Input
                id={`answer-${puzzle.id}`}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                placeholder="Type your answer"
                autoComplete="off"
                className={cn(wrong !== null && 'animate-shake border-destructive')}
              />
              <Button type="submit" disabled={!typed.trim()}>
                Check
              </Button>
            </form>
          )}
          <div aria-live="polite" className="mt-3 text-sm">
            {wrong !== null && <p className="text-destructive">Not quite — try again!</p>}
            {misses >= 1 && puzzle.hint && (
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Lightbulb className="size-4 shrink-0" aria-hidden="true" />
                Hint: {puzzle.hint}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

function SecretDoor({
  languageName,
  passwords,
  escaped,
  onEscape,
}: {
  languageName: string
  passwords: string[]
  escaped: boolean
  onEscape: () => void
}) {
  const [value, setValue] = useState('')
  const [failed, setFailed] = useState(false)

  if (escaped) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
        <DoorOpen className="size-8 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-bold">Door unlocked — you escaped!</p>
          <p className="text-sm opacity-90">Your {languageName} Ref magnet is on your fridge.</p>
        </div>
      </div>
    )
  }

  return (
    <section
      aria-labelledby="door-title"
      className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-foreground p-6 text-background duration-500"
    >
      <div className="flex items-center gap-3">
        <DoorClosed className="size-8 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <h3 id="door-title" className="font-heading text-xl font-bold">
            A secret door appeared!
          </h3>
          <p className="text-sm opacity-80">
            It only opens for those who say &quot;thank you&quot; in {languageName}. Unscramble
            your clue pieces.
          </p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const ok = passwords.map(normalize).includes(normalize(value))
          setFailed(!ok)
          if (ok) onEscape()
        }}
        className="mt-4 flex gap-2"
      >
        <label htmlFor="door-password" className="sr-only">
          Door password
        </label>
        <Input
          id="door-password"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setFailed(false)
          }}
          placeholder="Enter the password"
          autoComplete="off"
          className={cn(
            'border-background/30 bg-background/10 text-background placeholder:text-background/50',
            failed && 'animate-shake border-destructive',
          )}
        />
        <Button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!value.trim()}
        >
          Unlock
        </Button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-accent">
        {failed && 'The door stays shut. Check your clue pieces again.'}
      </p>
    </section>
  )
}

function splitPassword(password: string, pieces: number) {
  const letters = password.replace(/\s+/g, '').toUpperCase()
  const size = Math.ceil(letters.length / Math.max(pieces, 1))
  return Array.from({ length: pieces }, (_, index) => letters.slice(index * size, (index + 1) * size))
}

export function EscapeRoom({ slug }: { slug: string }) {
  const language = getLanguage(slug)!
  const { puzzles } = usePuzzles(slug)
  const [progress, setProgress] = useStoredState<Progress>(KEYS.progress(slug), EMPTY_PROGRESS)
  const [, setMagnets] = useStoredState<EarnedMagnet[]>(KEYS.magnets, EMPTY_LIST)

  const solved = new Set(progress.solved.filter((id) => puzzles.some((p) => p.id === id)))
  const allSolved = puzzles.length > 0 && solved.size === puzzles.length
  const fragments = splitPassword(language.passwords[0], puzzles.length)
  const scrambled = puzzles
    .map((_, index) => index)
    .sort((a, b) => ((7 * a + 3) % 5) - ((7 * b + 3) % 5))

  function markSolved(id: string) {
    setProgress((previous) =>
      previous.solved.includes(id) ? previous : { ...previous, solved: [...previous.solved, id] },
    )
  }

  function escape() {
    setProgress((previous) => ({ ...previous, escaped: true }))
    setMagnets((previous) =>
      previous.some((magnet) => magnet.slug === slug)
        ? previous
        : [...previous, { slug, earnedAt: Date.now() }],
    )
  }

  return (
    <section aria-labelledby="puzzles-title" className="flex flex-col justify-center gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="puzzles-title" className="font-heading text-2xl font-bold">
            Puzzle room
          </h2>
          <p className="text-sm text-muted-foreground">
            Solve every puzzle. Each one reveals a clue piece. Something may be hidden here…
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" aria-live="polite">
            {solved.size} / {puzzles.length} solved
          </span>
          {(solved.size > 0 || progress.escaped) && (
            <Button variant="ghost" size="sm" onClick={() => setProgress(EMPTY_PROGRESS)}>
              <RotateCcw aria-hidden="true" />
              Restart
            </Button>
          )}
        </div>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Puzzle progress"
        aria-valuemin={0}
        aria-valuemax={puzzles.length}
        aria-valuenow={solved.size}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(solved.size / Math.max(puzzles.length, 1)) * 100}%`,
            backgroundColor: language.color,
          }}
        />
      </div>

      <ol className="flex flex-col gap-4">
        {puzzles.map((puzzle, index) => (
          <li key={puzzle.id}>
            <PuzzleCard
              number={index + 1}
              puzzle={puzzle}
              solved={solved.has(puzzle.id)}
              fragment={fragments[index]}
              onSolved={() => markSolved(puzzle.id)}
            />
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="clues-title"
        className="rounded-2xl border border-dashed bg-card p-5"
      >
        <h3 id="clues-title" className="flex items-center gap-2 font-semibold">
          <KeyRound className="size-4" aria-hidden="true" />
          Clue pieces (scrambled)
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {scrambled.map((index) => {
            const puzzle = puzzles[index]
            const revealed = solved.has(puzzle.id)
            return (
              <li
                key={puzzle.id}
                className={cn(
                  'flex h-12 min-w-12 items-center justify-center rounded-lg border-2 px-3 font-heading text-lg font-bold',
                  revealed
                    ? 'border-transparent text-white'
                    : 'border-dashed text-muted-foreground',
                )}
                style={revealed ? { backgroundColor: language.color, color: language.textColor } : undefined}
              >
                {revealed ? fragments[index] || '·' : '?'}
              </li>
            )
          })}
        </ul>
      </section>

      {allSolved ? (
        <SecretDoor
          languageName={language.name}
          passwords={language.passwords}
          escaped={progress.escaped}
          onEscape={escape}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
          <Lock className="size-5 shrink-0" aria-hidden="true" />
          The way out is still hidden. Solve all puzzles to find it.
        </div>
      )}
    </section>
  )
}
