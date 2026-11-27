import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PhMap } from '@/components/ph-map'
import { LANGUAGES, displayName } from '@/lib/languages'

export default function HomePage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-6">
      <section
        aria-label="Language map"
        className="rounded-3xl border bg-card p-4 lg:sticky lg:top-20 lg:h-[calc(100dvh-7rem)]"
      >
        <PhMap />
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Mabuhay, MAg-aaral!</p>
          <h1 className="mt-2 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight md:text-5xl">
            Explore the many voices of the Philippines.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Hover over the map to discover which language is spoken in each province. Pick a
            region, learn about the language, solve its puzzles, and find the secret way out to earn a Ref magnet.
          </p>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-bold">Choose a language</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LANGUAGES.map((language) => (
              <li key={language.slug}>
                <Link
                  href={`/language/${language.slug}`}
                  className="group flex items-center gap-3 rounded-xl border bg-card px-3 py-3 transition-colors hover:border-foreground/30"
                >
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 rounded-full"
                    style={{ backgroundColor: language.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{displayName(language)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{language.region}</span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground sm:col-span-2">
              <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-[var(--map-unavailable)]" />
              Gray areas speak other languages (Maranao, Tausug, Kinaray-a, and more) — coming soon.
            </li>
          </ul>
        </div>

        <Link
          href="/magnets"
          className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/30"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent/30 p-1.5">
            <Image src="/images/ph-sun.png" alt="" width={48} height={48} className="size-11 object-contain" />
          </span>
          <span className="flex-1">
            <span className="block font-heading text-lg font-bold">My Ref Magnets</span>
            <span className="block text-sm text-muted-foreground">See the magnets on your fridge.</span>
          </span>
          <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
