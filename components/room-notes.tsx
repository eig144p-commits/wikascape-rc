'use client'

import { ExternalLink } from 'lucide-react'
import { NOTE_KIND_LABELS, safeLink, useRoomNotes } from '@/lib/room-notes'

export function RoomNotes({ slug }: { slug: string }) {
  const { notes } = useRoomNotes(slug)
  return (
    <section aria-labelledby="room-notes-title" className="rounded-2xl border bg-card p-5">
      <h2 id="room-notes-title" className="font-heading text-lg font-bold">
        From your educators
      </h2>
      {notes.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No lessons or notes have been added to this room yet.</p>
      ) : (
      <ul className="mt-3 flex flex-col gap-4">
        {notes.map((note) => {
          const href = safeLink(note.link)
          return (
            <li key={note.id} className="flex flex-col gap-1">
              <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                {NOTE_KIND_LABELS[note.kind]}
              </span>
              <h3 className="font-semibold">{note.title}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground text-pretty">{note.body}</p>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open resource
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <p className="text-xs text-muted-foreground">Added by {note.author}</p>
            </li>
          )
        })}
      </ul>
      )}
    </section>
  )
}
