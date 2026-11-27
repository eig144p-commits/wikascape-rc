'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LANGUAGES, getLanguage } from '@/lib/languages'
import { KEYS, makeId, useStoredState } from '@/lib/storage'

type Reply = { id: string; author: string; body: string; createdAt: number }
type Post = {
  id: string
  author: string
  language: string
  title: string
  body: string
  createdAt: number
  replies: Reply[]
}

const SEED: Post[] = [
  {
    id: 'seed-1',
    author: 'Teacher Ana',
    language: 'tagalog',
    title: 'Magandang umaga, mga estudyante!',
    body: 'Welcome to the Wika Escape forum. Introduce yourself in the language you are learning — even one sentence is great practice!',
    createdAt: Date.UTC(2026, 10, 20),
    replies: [
      {
        id: 'seed-1-r1',
        author: 'Miguel',
        body: 'Magandang umaga po! Ako si Miguel. Nag-aaral ako ng Tagalog.',
        createdAt: Date.UTC(2026, 10, 21),
      },
    ],
  },
  {
    id: 'seed-2',
    author: 'Lea',
    language: 'bikol',
    title: 'Why is it "Dios mabalos" and not "salamat"?',
    body: 'I just escaped the Bikol room. I love that thank you means "May God repay you". Are there other languages with a special word like this?',
    createdAt: Date.UTC(2026, 10, 24),
    replies: [],
  },
]

const BLOCKED = ['stupid', 'idiot', 'hate', 'gago', 'tanga', 'bobo', 'putang']

function moderate(text: string) {
  const lower = text.toLowerCase()
  if (BLOCKED.some((word) => lower.includes(word))) {
    return { ok: false as const, reason: 'Please keep the forum kind. Try rewording your message.' }
  }
  if (/https?:\/\//.test(lower)) {
    return { ok: false as const, reason: 'Links are not allowed in the forum.' }
  }
  return { ok: true as const }
}

const formatDate = (time: number) =>
  new Date(time).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })

function PostCard({ post, onReply }: { post: Post; onReply: (id: string, author: string, body: string) => void }) {
  const language = getLanguage(post.language)
  const [error, setError] = useState<string | null>(null)

  return (
    <article className="rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {language && (
          <span
            className="rounded-full px-2 py-0.5 font-semibold"
            style={{ backgroundColor: language.color, color: language.textColor }}
          >
            {language.name}
          </span>
        )}
        <span className="font-medium text-foreground">{post.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time>
      </div>
      <h3 className="mt-2 font-heading text-lg font-bold">{post.title}</h3>
      <p className="mt-1 leading-relaxed">{post.body}</p>
      {post.replies.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3 border-l-2 pl-4">
          {post.replies.map((reply) => (
            <li key={reply.id} className="text-sm">
              <span className="font-semibold">{reply.author}</span>{' '}
              <span className="text-muted-foreground">· {formatDate(reply.createdAt)}</span>
              <p className="mt-0.5 leading-relaxed">{reply.body}</p>
            </li>
          ))}
        </ul>
      )}
      <details className="group mt-4">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary">
          <MessageCircle className="size-4" aria-hidden="true" />
          Tumubag / Sumagot ({post.replies.length})
        </summary>
        <form
          className="mt-3 flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const form = event.currentTarget
            const data = new FormData(form)
            const author = String(data.get('author') ?? '').trim().slice(0, 40)
            const body = String(data.get('body') ?? '').trim().slice(0, 600)
            if (!author || !body) return setError('Add your name and a reply.')
            const check = moderate(body)
            if (!check.ok) return setError(check.reason)
            onReply(post.id, author, body)
            setError(null)
            form.reset()
          }}
        >
          <Label htmlFor={`reply-author-${post.id}`} className="sr-only">
            Your name
          </Label>
          <Input id={`reply-author-${post.id}`} name="author" placeholder="Your name" maxLength={40} />
          <Label htmlFor={`reply-body-${post.id}`} className="sr-only">
            Reply
          </Label>
          <Textarea id={`reply-body-${post.id}`} name="body" rows={2} maxLength={600} placeholder="Salamat sa..." />
          <p aria-live="polite" className="min-h-5 text-sm text-destructive">
            {error}
          </p>
          <Button type="submit" size="sm" className="self-end">
            Reply
          </Button>
        </form>
      </details>
    </article>
  )
}

export function Forum() {
  const [posts, setPosts] = useStoredState<Post[]>(KEYS.forum, SEED)
  const [error, setError] = useState<string | null>(null)

  function reply(id: string, author: string, body: string) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? { ...post, replies: [...post.replies, { id: makeId(), author, body, createdAt: Date.now() }] }
          : post,
      ),
    )
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <form
        className="flex flex-col gap-4 rounded-2xl border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const data = new FormData(form)
          const author = String(data.get('author') ?? '').trim().slice(0, 40)
          const title = String(data.get('title') ?? '').trim().slice(0, 100)
          const body = String(data.get('body') ?? '').trim().slice(0, 1000)
          const language = String(data.get('language') ?? 'tagalog')
          if (!author || !title || !body) return setError('Please fill in your name, a title, and a message.')
          const check = moderate(`${title} ${body}`)
          if (!check.ok) return setError(check.reason)
          setPosts((previous) => [
            { id: makeId(), author, language, title, body, createdAt: Date.now(), replies: [] },
            ...previous,
          ])
          setError(null)
          form.reset()
        }}
      >
        <h2 className="font-heading text-lg font-bold">Start a conversation</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-author">Your name</Label>
            <Input id="post-author" name="author" maxLength={40} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-language">Language</Label>
            <select
              id="post-language"
              name="language"
              defaultValue="tagalog"
              className="h-9 rounded-lg border bg-transparent px-2.5 text-sm"
            >
              {LANGUAGES.map((language) => (
                <option key={language.slug} value={language.slug}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="post-title">Title</Label>
          <Input id="post-title" name="title" maxLength={100} required placeholder="Kumusta kayo!" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="post-body">Message</Label>
          <Textarea id="post-body" name="body" rows={3} maxLength={1000} required placeholder="Magandang umaga! Ako si..." />
        </div>
        <p aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
        <Button type="submit" className="self-end">
          <Send aria-hidden="true" />
          Post
        </Button>
      </form>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} onReply={reply} />
          </li>
        ))}
      </ul>
    </div>
  )
}
