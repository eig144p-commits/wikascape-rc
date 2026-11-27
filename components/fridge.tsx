'use client'

import { useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { LANGUAGES, getLanguage, type Language } from '@/lib/languages'
import { EMPTY_LIST, EMPTY_OBJECT, KEYS, useStoredState, type EarnedMagnet } from '@/lib/storage'
import { RefMagnet } from './ref-magnet'

type Position = { x: number; y: number }
const TILTS = [-6, 4, -2, 7, -4, 3, -7, 5, -3, 6]
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function DraggableMagnet({
  language,
  position,
  tilt,
  zIndex,
  boardRef,
  onMove,
  onLift,
}: {
  language: Language
  position: Position
  tilt: number
  zIndex: number
  boardRef: RefObject<HTMLDivElement | null>
  onMove: (position: Position) => void
  onLift: () => void
}) {
  const router = useRouter()
  const selfRef = useRef<HTMLButtonElement>(null)
  const drag = useRef<{ pointerId: number; startX: number; startY: number; origin: Position; moved: boolean } | null>(null)
  const [dragPosition, setDragPosition] = useState<Position | null>(null)
  const current = dragPosition ?? position
  const dragging = dragPosition !== null

  const bound = (next: Position) => {
    const board = boardRef.current
    const self = selfRef.current
    if (!board || !self) return next
    return {
      x: clamp(next.x, 0, 100 - (self.offsetWidth / board.clientWidth) * 100),
      y: clamp(next.y, 0, 100 - (self.offsetHeight / board.clientHeight) * 100),
    }
  }

  const finish = (pointerId: number, cancelled: boolean) => {
    const state = drag.current
    if (!state || state.pointerId !== pointerId) return
    drag.current = null
    if (state.moved && dragPosition && !cancelled) onMove(dragPosition)
    setDragPosition(null)
    if (!state.moved && !cancelled) router.push(`/language/${language.slug}`)
  }

  return (
    <button
      ref={selfRef}
      type="button"
      aria-label={`${language.name} magnet. Drag or use arrow keys to move it. Press Enter to revisit the room.`}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          origin: position,
          moved: false,
        }
        onLift()
      }}
      onPointerMove={(event) => {
        const state = drag.current
        const board = boardRef.current
        if (!state || state.pointerId !== event.pointerId || !board) return
        const dx = event.clientX - state.startX
        const dy = event.clientY - state.startY
        if (!state.moved && Math.hypot(dx, dy) < 4) return
        state.moved = true
        setDragPosition(
          bound({
            x: state.origin.x + (dx / board.clientWidth) * 100,
            y: state.origin.y + (dy / board.clientHeight) * 100,
          }),
        )
      }}
      onPointerUp={(event) => finish(event.pointerId, false)}
      onPointerCancel={(event) => finish(event.pointerId, true)}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 2
        const delta = (
          { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, [number, number]>
        )[event.key]
        if (delta) {
          event.preventDefault()
          onLift()
          onMove(bound({ x: position.x + delta[0], y: position.y + delta[1] }))
        } else if (event.key === 'Enter') {
          event.preventDefault()
          router.push(`/language/${language.slug}`)
        }
      }}
      className={`absolute w-24 touch-none select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-ring/60 ${dragging ? 'cursor-grabbing drop-shadow-[0_14px_14px_rgba(0,0,0,0.3)]' : 'cursor-grab transition-[rotate,scale]'}`}
      style={{
        left: `${current.x}%`,
        top: `${current.y}%`,
        rotate: `${dragging ? 0 : tilt}deg`,
        scale: dragging ? 1.1 : undefined,
        zIndex: dragging ? 999 : zIndex,
      }}
    >
      <RefMagnet language={language} />
    </button>
  )
}

export function Fridge() {
  const [magnets] = useStoredState<EarnedMagnet[]>(KEYS.magnets, EMPTY_LIST)
  const [positions, setPositions] = useStoredState<Record<string, Position>>(
    KEYS.magnetPositions,
    EMPTY_OBJECT,
  )
  const [stack, setStack] = useState<string[]>([])
  const boardRef = useRef<HTMLDivElement>(null)

  const earned = magnets.map((magnet) => getLanguage(magnet.slug)).filter((l): l is Language => !!l)
  const earnedSlugs = new Set(earned.map((language) => language.slug))
  const missing = LANGUAGES.filter((language) => !earnedSlugs.has(language.slug))

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div
        className="relative overflow-hidden rounded-3xl px-4 pt-8"
        style={{
          backgroundColor: '#f4f5f7',
          backgroundImage:
            'linear-gradient(#e6e8ec 1px, transparent 1px), linear-gradient(90deg, #e6e8ec 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      >
        <figure aria-label={`Refrigerator with ${earned.length} Ref magnets`} className="relative mx-auto w-full max-w-md">
          <div className="rounded-t-[2rem] rounded-b-xl border-4 border-[#c9cfd6] bg-gradient-to-r from-[#e8ecf0] via-[#fbfcfd] to-[#dfe4e9] p-2 shadow-[0_20px_30px_-12px_rgba(0,0,0,0.35)]">
            <div className="relative h-28 rounded-t-[1.5rem] rounded-b-md border border-[#cfd5dc] bg-gradient-to-br from-white to-[#eef1f4]">
              <span aria-hidden="true" className="absolute bottom-3 left-4 h-2.5 w-24 rounded-full bg-gradient-to-b from-[#b7bec6] to-[#8d959e]" />
              <span className="absolute right-4 top-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#a3abb4]">
                Wika
              </span>
            </div>
            <div className="relative mt-2 h-[26rem] rounded-b-lg rounded-t-md border border-[#cfd5dc] bg-gradient-to-br from-white to-[#eef1f4] py-4 pl-10 pr-3">
              <span aria-hidden="true" className="absolute left-4 top-6 h-40 w-2.5 rounded-full bg-gradient-to-r from-[#b7bec6] to-[#8d959e]" />
              {earned.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="font-heading text-lg font-bold text-[#6b737c]">Your fridge is empty</p>
                  <p className="max-w-56 text-sm text-[#8a929b]">
                    Escape a language room to stick your first Ref magnet here.
                  </p>
                  <Link href="/" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Go to the map
                  </Link>
                </div>
              ) : (
                <div ref={boardRef} className="relative h-full w-full">
                  {earned.map((language, index) => (
                    <DraggableMagnet
                      key={language.slug}
                      language={language}
                      position={positions[language.slug] ?? { x: 6 + (index % 3) * 31, y: 2 + 27 * Math.floor(index / 3) }}
                      tilt={TILTS[index % TILTS.length]}
                      zIndex={2 + stack.indexOf(language.slug)}
                      boardRef={boardRef}
                      onLift={() => setStack((previous) => [...previous.filter((s) => s !== language.slug), language.slug])}
                      onMove={(position) => setPositions((previous) => ({ ...previous, [language.slug]: position }))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div aria-hidden="true" className="mx-6 flex justify-between">
            <span className="h-3 w-8 rounded-b-md bg-[#9aa2ab]" />
            <span className="h-3 w-8 rounded-b-md bg-[#9aa2ab]" />
          </div>
          <figcaption className="sr-only">
            {earned.length > 0 ? `Magnets collected: ${earned.map((l) => l.name).join(', ')}` : 'No magnets collected yet'}
          </figcaption>
        </figure>
        <div aria-hidden="true" className="-mx-4 h-10 bg-[#b08a63]" />
        {earned.length > 0 && (
          <div className="absolute right-4 top-4">
            <button
              type="button"
              onClick={() => setPositions(EMPTY_OBJECT)}
              disabled={Object.keys(positions).length === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-card disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Tidy up
            </button>
          </div>
        )}
      </div>

      <aside aria-labelledby="missing-title" className="rounded-2xl border bg-card p-5">
        <h2 id="missing-title" className="font-heading text-lg font-bold">
          Still to collect
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {missing.length === 0 ? 'You collected every magnet. Galing!' : `${missing.length} rooms left to escape.`}
        </p>
        {missing.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {missing.map((language) => (
              <li key={language.slug}>
                <Link href={`/language/${language.slug}`} aria-label={`Play the ${language.name} room`}>
                  <RefMagnet language={language} earned={false} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  )
}
