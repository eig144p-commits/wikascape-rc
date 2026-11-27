import type { Metadata } from 'next'
import { Forum } from '@/components/forum'

export const metadata: Metadata = { title: 'Forum — Wika Escape' }

export default function ForumPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">Usapan</p>
      <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight">Community forum</h1>
      <p className="mt-2 text-muted-foreground">
        Practice with other learners. Say hello, ask questions, and share what you discovered.
        Please be kind — messages are checked before posting.
      </p>
      <Forum />
    </main>
  )
}
