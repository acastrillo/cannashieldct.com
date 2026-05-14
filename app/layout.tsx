import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'

import { Footer } from '@/components/footer/Footer'
import { Navbar } from '@/components/nav/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cannashieldct.com'),
  title: 'CannaShield — Cannabis Cybersecurity & GRC',
  description:
    'Virtual CISO and GRC services for cannabis operators. License protection, insurance qualification, and downtime prevention. Connecticut-based, nationally serving.',
  openGraph: {
    title: 'CannaShield',
    description: 'Cannabis cybersecurity built for operators.',
    url: 'https://cannashieldct.com',
    siteName: 'CannaShield',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body>
        <Script
          defer
          data-domain="cannashieldct.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <a
          href="#main-content"
          className="focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-brand-accent px-4 py-3 text-sm font-semibold text-brand-background transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
