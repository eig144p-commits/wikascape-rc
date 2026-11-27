'use client'

import { useState } from 'react'
import { Check, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth'
import { NOTE_KIND_LABELS, safeLink, useRoomNotes, type RoomNoteKind } from '@/lib/room-notes'
import { LANGUAGES, getLanguage } from '@/lib/languages'
import { usePuzzles, type Puzzle } from '@/lib/puzzles'
import { EMPTY_LIST, KEYS, makeId, useStoredState } from '@/lib/storage'
import type { HelpRequest } from './help-request-dialog'

export function HelpInbox() {
  const [requests, setRequests] = useStoredState<HelpRequest[]>(KEYS.help, EMPTY_LIST)
  return (
    <section aria-labelledby="inbox-title" className="h-fit rounded-2xl border bg-card p-5">
      <h2 id="inbox-title" className="font-heading text-lg font-bold">
        Help requests
      </h2>
      {requests.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No requests yet. Students can ask from any page.</p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y">
          {requests.map((request) => (
            <li key={request.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">
                  {request.name}{' '}
                  <span className="font-normal text-muted-foreground">
                    → {request.role}
                    {request.language && ` · ${getLanguage(request.language)?.name ?? request.language}`}
                  </span>
                </p>
                <p className="mt-0.5 leading-relaxed text-pretty">{request.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Mark request from ${request.name} as resolved`}
                onClick={() => setRequests((previous) => previous.filter((r) => r.id !== request.id))}
              >
                <Check aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PuzzleList({ slug }: { slug: string }) {
  const { puzzles, save, reset, isCustom } = usePuzzles(slug)
  const [draft, setDraft] = useState<Puzzle[] | null>(null)
  const items = draft ?? puzzles
  const update = (id: string, patch: Partial<Puzzle>) =>
    setDraft(items.map((puzzle) => (puzzle.id === id ? { ...puzzle, ...patch } : puzzle)))

  return (
    <>
      <ol className="flex flex-col gap-4">
        {items.map((puzzle, index) => (
          <li key={puzzle.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading font-bold">Puzzle {index + 1}</span>
              <div className="flex items-center gap-2">
                <select
                  aria-label={`Puzzle ${index + 1} type`}
                  value={puzzle.type}
                  onChange={(event) => update(puzzle.id, { type: event.target.value as Puzzle['type'] })}
                  className="h-8 rounded-lg border bg-transparent px-2 text-sm"
                >
                  <option value="choice">Multiple choice</option>
                  <option value="text">Type the answer</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete puzzle ${index + 1}`}
                  onClick={() => setDraft(items.filter((p) => p.id !== puzzle.id))}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`prompt-${puzzle.id}`}>Question</Label>
              <Input id={`prompt-${puzzle.id}`} value={puzzle.prompt} onChange={(e) => update(puzzle.id, { prompt: e.target.value })} />
            </div>
            {puzzle.type === 'choice' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`options-${puzzle.id}`}>Choices (comma separated)</Label>
                <Input
                  id={`options-${puzzle.id}`}
                  value={puzzle.options.join(', ')}
                  onChange={(e) => update(puzzle.id, { options: e.target.value.split(',').map((o) => o.trim()) })}
                />
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`answer-${puzzle.id}`}>Correct answer</Label>
                <Input id={`answer-${puzzle.id}`} value={puzzle.answer} onChange={(e) => update(puzzle.id, { answer: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`hint-${puzzle.id}`}>Hint</Label>
                <Input id={`hint-${puzzle.id}`} value={puzzle.hint ?? ''} onChange={(e) => update(puzzle.id, { hint: e.target.value })} />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setDraft([...items, { id: makeId(), type: 'choice', prompt: 'New question', options: ['A', 'B'], answer: 'A' }])
          }
        >
          <Plus aria-hidden="true" />
          Add puzzle
        </Button>
        <Button
          disabled={!draft}
          onClick={() => {
            if (!draft) return
            save(draft.map((p) => ({ ...p, options: p.options.filter(Boolean) })))
            setDraft(null)
            toast.success(`${getLanguage(slug)?.name} puzzles saved`)
          }}
        >
          <Save aria-hidden="true" />
          Save puzzles
        </Button>
        <Button
          variant="ghost"
          disabled={!isCustom && !draft}
          onClick={() => {
            reset()
            setDraft(null)
            toast(`${getLanguage(slug)?.name} puzzles reset to default`)
          }}
        >
          <RotateCcw aria-hidden="true" />
          Reset to default
        </Button>
      </div>
    </>
  )
}

function RoomInfoEditor({ slug }: { slug: string }) {
  const { notes, add, remove } = useRoomNotes(slug)
  const { user } = useAuth()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') ?? '').trim()
    const body = String(data.get('body') ?? '').trim()
    const link = String(data.get('link') ?? '').trim()
    if (!title || !body) {
      toast.error('Add a title and some content first.')
      return
    }
    if (link && !safeLink(link)) {
      toast.error('Links must start with http:// or https://')
      return
    }
    add({
      id: makeId(),
      kind: data.get('kind') as RoomNoteKind,
      title,
      body,
      link: link || undefined,
      author: user?.nickname ?? 'Educator',
      createdAt: Date.now(),
    })
    form.reset()
    toast.success(`Added to the ${getLanguage(slug)?.name} room`)
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Add lessons, vocabulary, cultural notes or links. Students see these beside the puzzles in the room.
        </p>
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note-kind">Type</Label>
            <select id="note-kind" name="kind" defaultValue="lesson" className="h-9 rounded-lg border bg-transparent px-2 text-sm">
              {Object.entries(NOTE_KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input id="note-title" name="title" maxLength={80} placeholder="e.g. Common greetings" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note-body">Content</Label>
          <Textarea id="note-body" name="body" rows={4} maxLength={2000} placeholder="Write the information students should read…" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note-link">Link (optional)</Label>
          <Input id="note-link" name="link" type="url" placeholder="https://" />
        </div>
        <Button type="submit" className="w-fit">
          <Plus aria-hidden="true" />
          Add information
        </Button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No extra information in this room yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{NOTE_KIND_LABELS[note.kind]}</p>
                <p className="font-semibold">{note.title}</p>
                <p className="mt-0.5 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">{note.body}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete "${note.title}"`}
                onClick={() => remove(note.id)}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PuzzleEditor() {
  const [slug, setSlug] = useState(LANGUAGES[0].slug)
  const [tab, setTab] = useState<'puzzles' | 'info'>('puzzles')
  return (
    <section aria-labelledby="editor-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="editor-title" className="font-heading text-2xl font-bold">
            Room editor
          </h2>
          <p className="text-sm text-muted-foreground">Change the puzzles and add extra information to each room.</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="editor-language">Room</Label>
          <select
            id="editor-language"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="h-9 rounded-lg border bg-card px-2.5 text-sm"
          >
            {LANGUAGES.map((language) => (
              <option key={language.slug} value={language.slug}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div role="tablist" aria-label="Room content" className="flex w-fit rounded-xl bg-muted p-1 text-sm font-semibold">
        {(
          [
            ['puzzles', 'Puzzles'],
            ['info', 'Room information'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={
              tab === value
                ? 'rounded-lg bg-card px-4 py-1.5 text-foreground shadow-sm'
                : 'rounded-lg px-4 py-1.5 text-muted-foreground hover:text-foreground'
            }
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'puzzles' ? <PuzzleList key={slug} slug={slug} /> : <RoomInfoEditor key={slug} slug={slug} />}
    </section>
  )
}
