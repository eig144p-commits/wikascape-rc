'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import provinces from '@/lib/provinces.json'
import { LANGUAGES, displayName } from '@/lib/languages'

type Province = { name: string; d: string; cx: number; cy: number; language: string | null }
type Hover = { province: string; language: string | null; x: number; y: number }

const WIDTH = 520
const HEIGHT = 820
const bySlug = Object.fromEntries(LANGUAGES.map((language) => [language.slug, language]))

export function PhMap() {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<Hover | null>(null)
  const hoveredLanguage = hover?.language ? bySlug[hover.language] : null

  return (
    <div ref={wrapperRef} className="relative h-full w-full" onPointerLeave={() => setHover(null)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto h-full max-h-[calc(100dvh-7rem)] w-full"
        role="group"
        aria-label="Map of the Philippines colored by language"
      >
        {(provinces as Province[]).map((province) => {
          const language = province.language ? bySlug[province.language] : null
          const label = language
            ? `${province.name}: ${displayName(language)}. Press Enter to start learning.`
            : `${province.name}: coming soon`
          const active =
            hover && (language ? hover.language === language.slug : hover.province === province.name)
          const go = () => language && router.push(`/language/${language.slug}`)
          return (
            <path
              key={province.name}
              d={province.d}
              tabIndex={0}
              role={language ? 'link' : 'img'}
              aria-label={label}
              fill={language ? language.color : 'var(--map-unavailable)'}
              stroke="var(--background)"
              strokeWidth={0.8}
              className={`${language ? 'cursor-pointer' : 'cursor-not-allowed'} outline-none transition-opacity focus-visible:stroke-foreground`}
              style={{ opacity: hover && !active ? 0.55 : 1 }}
              onPointerMove={(event) => {
                const box = wrapperRef.current?.getBoundingClientRect()
                setHover({
                  province: province.name,
                  language: province.language,
                  x: box ? event.clientX - box.left : 0,
                  y: box ? event.clientY - box.top : 0,
                })
              }}
              onFocus={() => {
                const svgBox = svgRef.current?.getBoundingClientRect()
                const box = wrapperRef.current?.getBoundingClientRect()
                setHover({
                  province: province.name,
                  language: province.language,
                  x: svgBox && box ? svgBox.left - box.left + (province.cx / WIDTH) * svgBox.width : 0,
                  y: svgBox && box ? svgBox.top - box.top + (province.cy / HEIGHT) * svgBox.height : 0,
                })
              }}
              onBlur={() => setHover(null)}
              onClick={go}
              onKeyDown={(event) => {
                if (language && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  go()
                }
              }}
            />
          )
        })}
      </svg>
      {hover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl border bg-popover px-3 py-2 text-popover-foreground shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="text-xs text-muted-foreground">{hover.province}</p>
          {hoveredLanguage ? (
            <>
              <p className="flex items-center gap-1.5 font-heading font-bold">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: hoveredLanguage.color }}
                />
                {displayName(hoveredLanguage)}
              </p>
              <p className="text-xs text-muted-foreground">Click to enter the room</p>
            </>
          ) : (
            <p className="font-heading font-bold">Coming soon</p>
          )}
        </div>
      )}
    </div>
  )
}
