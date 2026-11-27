import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Users } from 'lucide-react'
import { EscapeRoom } from '@/components/escape-room'
import { LessonHelp } from '@/components/help-buttons'
import { RoomNotes } from '@/components/room-notes'
import { LANGUAGES, getLanguage } from '@/lib/languages'

export function generateStaticParams() {
  return LANGUAGES.map((language) => ({ slug: language.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const language = getLanguage((await params).slug)
  return { title: language ? `Learn ${language.name} — Wika Escape` : 'Wika Escape' }
}

export default async function LanguagePage({ params }: { params: Promise<{ slug: string }> }) {
  const language = getLanguage((await params).slug)
  if (!language) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to map
      </Link>

      <header
        className="mt-4 rounded-3xl p-8"
        style={{ backgroundColor: language.color, color: language.textColor }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider opacity-90">Language room</p>
        <h1 className="mt-1 font-heading text-5xl font-extrabold tracking-tight">{language.name}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed opacity-95">{language.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {language.region}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden="true" />
            {language.speakers}
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6">
          <section aria-labelledby="study-title" className="rounded-2xl border bg-card p-5">
            <h2 id="study-title" className="font-heading text-lg font-bold">
              Study these first
            </h2>
            <dl className="mt-3 divide-y">
              {language.phrases.map((phrase) => (
                <div key={phrase.native} className="py-3">
                  <dt className="font-semibold">{phrase.native}</dt>
                  <dd className="text-sm text-muted-foreground">{phrase.english}</dd>
                </div>
              ))}
              <div className="py-3">
                <dt className="font-semibold">
                  {language.yes} / {language.no}
                </dt>
                <dd className="text-sm text-muted-foreground">Yes / No</dd>
              </div>
            </dl>
          </section>

          <RoomNotes slug={language.slug} />

          <section aria-labelledby="where-title" className="rounded-2xl border bg-card p-5">
            <h2 id="where-title" className="font-heading text-lg font-bold">
              {"Where it's spoken"}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {language.provinces.map((province) => (
                <li key={province} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {province}
                </li>
              ))}
            </ul>
          </section>

          <LessonHelp languageSlug={language.slug} />
        </aside>

        <EscapeRoom slug={language.slug} />
      </div>
    </main>
  )
}
