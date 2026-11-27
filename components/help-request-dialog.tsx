'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LANGUAGES } from '@/lib/languages'
import { EMPTY_LIST, KEYS, makeId, useStoredState } from '@/lib/storage'

export type HelpRole = 'tutor' | 'teacher'
export type HelpRequest = {
  id: string
  name: string
  role: HelpRole
  language: string
  message: string
  createdAt: number
}

const selectClass = 'h-9 w-full rounded-lg border bg-transparent px-2.5 text-sm'

export function HelpRequestDialog({
  open,
  onOpenChange,
  initialRole = 'tutor',
  initialLanguage = '',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialRole?: HelpRole
  initialLanguage?: string
}) {
  const [, setRequests] = useStoredState<HelpRequest[]>(KEYS.help, EMPTY_LIST)
  const [error, setError] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const name = String(data.get('name') ?? '').trim().slice(0, 40)
            const message = String(data.get('message') ?? '').trim().slice(0, 600)
            if (!name || !message) {
              setError('Add your name and what you need help with.')
              return
            }
            setRequests((previous) => [
              {
                id: makeId(),
                name,
                message,
                role: data.get('role') as HelpRole,
                language: String(data.get('language') ?? ''),
                createdAt: Date.now(),
              },
              ...previous,
            ])
            toast.success('Request sent! A tutor or teacher will reach out soon.')
            onOpenChange(false)
          }}
        >
          <DialogHeader>
            <DialogTitle>Ask for help</DialogTitle>
            <DialogDescription>
              Send a message to a tutor or teacher. They can see it in the educators page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="help-role">Ask a</Label>
              <select id="help-role" name="role" defaultValue={initialRole} className={selectClass}>
                <option value="tutor">Tutor</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="help-language">Language</Label>
              <select
                id="help-language"
                name="language"
                defaultValue={initialLanguage}
                className={selectClass}
              >
                <option value="">Any language</option>
                {LANGUAGES.map((language) => (
                  <option key={language.slug} value={language.slug}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="help-name">Your name</Label>
            <Input id="help-name" name="name" maxLength={40} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="help-message">What do you need help with?</Label>
            <Textarea id="help-message" name="message" rows={3} maxLength={600} required />
          </div>
          <p aria-live="polite" className="min-h-5 text-sm text-destructive">
            {error}
          </p>
          <DialogFooter>
            <Button type="submit">Send request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
