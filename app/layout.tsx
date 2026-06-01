import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'

import { Footer } from '@/components/footer/Footer'
import { Navbar } from '@/components/nav/Navbar'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
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
  applicationName: 'CannaShield',
  title: {
    default: 'CannaShield | Cannabis Cybersecurity, GRC & Email Security',
    template: '%s | CannaShield',
  },
  description:
    'Cybersecurity, GRC, vCISO, and email security scorecards for cannabis dispensaries, cultivators, and licensed operators in Connecticut and beyond.',
  keywords: [
    'cannabis cybersecurity',
    'Connecticut dispensary compliance',
    'cannabis GRC',
    'vCISO cannabis',
    'DMARC SPF DKIM scorecard',
    'cannabis cyber risk',
  ],
  authors: [{ name: 'CannaShield' }],
  creator: 'CannaShield',
  publisher: 'CannaShield',
  category: 'Cybersecurity',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CannaShield | Cannabis Cybersecurity, GRC & Email Security',
    description:
      'Connecticut-based cybersecurity and GRC support for cannabis operators, with a free email security scorecard for DMARC, SPF, and DKIM exposure.',
    url: 'https://cannashieldct.com',
    siteName: 'CannaShield',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CannaShield | Cannabis Cybersecurity, GRC & Email Security',
    description:
      'Cybersecurity, GRC, vCISO, and email security scorecards for cannabis operators.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
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
        <JsonLd id="organization-jsonld" data={[organizationJsonLd, websiteJsonLd]} />
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
