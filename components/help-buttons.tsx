'use client'

import { useState } from 'react'
import { GraduationCap, LifeBuoy, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HelpRequestDialog, type HelpRole } from './help-request-dialog'

export function FloatingHelpButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <LifeBuoy className="size-4" aria-hidden="true" />
        Need help?
      </button>
      {open && <HelpRequestDialog open onOpenChange={setOpen} />}
    </>
  )
}

export function LessonHelp({ languageSlug }: { languageSlug: string }) {
  const [role, setRole] = useState<HelpRole | null>(null)
  return (
    <section aria-labelledby="lesson-help-title" className="rounded-2xl border bg-card p-5">
      <h2 id="lesson-help-title" className="font-heading text-lg font-bold">
        Stuck?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Ask a real person to guide you.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setRole('tutor')}>
          <User aria-hidden="true" />
          Ask a tutor
        </Button>
        <Button variant="outline" onClick={() => setRole('teacher')}>
          <GraduationCap aria-hidden="true" />
          Ask a teacher
        </Button>
      </div>
      {role && (
        <HelpRequestDialog
          key={role}
          open
          onOpenChange={(open) => !open && setRole(null)}
          initialRole={role}
          initialLanguage={languageSlug}
        />
      )}
    </section>
  )
}
