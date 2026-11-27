import type { Metadata } from 'next'
import { Fridge } from '@/components/fridge'

export const metadata: Metadata = { title: 'My Ref Magnets — Wika Escape' }

export default function MagnetsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">Ang aking koleksyon</p>
      <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight">My Ref Magnets</h1>
      <p className="mt-2 text-muted-foreground">
        Every room you escape adds a magnet to your fridge. Tap a magnet to revisit its room.
      </p>
      <div className="mt-8">
        <Fridge />
      </div>
    </main>
  )
}
