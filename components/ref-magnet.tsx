import Image from 'next/image'
import type { Language } from '@/lib/languages'
import { cn } from '@/lib/utils'

export function RefMagnet({
  language,
  earned = true,
  className,
}: {
  language: Language
  earned?: boolean
  className?: string
}) {
  if (!earned) {
    return (
      <div
        className={cn(
          'flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted p-2 text-center',
          className,
        )}
      >
        <span className="font-heading text-sm font-bold text-muted-foreground">?</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {language.name}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center shadow-[0_6px_10px_-4px_rgba(0,0,0,0.35)] ring-1 ring-black/5',
        className,
      )}
      style={{
        backgroundColor: language.color,
        color: language.textColor,
        backgroundImage:
          'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%)',
      }}
    >
      <span className="flex size-10 items-center justify-center bg-transparent drop-shadow-sm">
        <Image
          src="/images/ph-sun.png"
          alt=""
          width={32}
          height={32}
          className="size-8 object-contain"
        />
      </span>
      <span className="font-heading text-sm font-bold leading-tight">{language.name}</span>
      <span className="text-[9px] font-semibold uppercase tracking-widest opacity-80">
        Ref magnet
      </span>
    </div>
  )
}
