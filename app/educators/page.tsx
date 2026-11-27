import type { Metadata } from 'next'
import { EducatorOnly } from '@/components/auth-gate'
import { HelpInbox, PuzzleEditor } from '@/components/educator-tools'

export const metadata: Metadata = { title: 'Educators — Wika Escape' }

export default function EducatorsPage() {
  return (
    <EducatorOnly>
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">Para sa mga guro</p>
      <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight">Educator tools</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Answer student help requests and customize the puzzles and extra information in each language room.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <PuzzleEditor />
        <HelpInbox />
      </div>
    </main>
    </EducatorOnly>
  )
}
