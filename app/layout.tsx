import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Geist } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { AuthGate } from '@/components/auth-gate'
import { FloatingHelpButton } from '@/components/help-buttons'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: 'Wika Escape — Learn Philippine Languages',
  description:
    'Explore the many voices of the Philippines. Pick a region on the map, solve its language puzzles, and escape to earn a Ref magnet.',
  icons: { icon: '/images/ph-sun.png', apple: '/images/ph-sun.png' },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${bricolage.variable} bg-background`}>
      <body className="min-h-dvh font-sans antialiased">
        <AuthGate>
          <SiteHeader />
          {children}
          <FloatingHelpButton />
        </AuthGate>
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
