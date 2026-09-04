import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { calendlyUrl } from '@/lib/constants'
import { absoluteUrl } from '@/lib/seo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Cannabis Cybersecurity Partner Program',
  description:
    'Referral and delivery channels for MSPs, insurance brokers, and law firms serving cannabis operators.',
  alternates: { canonical: '/partners' },
  openGraph: {
    title: 'Cannabis Cybersecurity Partner Program | CannaShield',
    description:
      'Referral and delivery channels for MSPs, insurance brokers, and law firms serving cannabis operators.',
    url: '/partners',
    images: ['/og-image.png'],
  },
}

const partners = [
  {
    title: 'For MSPs',
    copy: "You handle IT. We handle GRC. No competition, no overlap — just stickier clients and 10% of first-year recurring revenue on referred retainers, plus $500 per fixed-fee project.",
  },
  {
    title: 'For Insurance Brokers',
    copy: "Your insureds present stronger, clearer evidence for underwriting — we don't promise coverage or premium outcomes. CannaShield is listed as your preferred remediation vendor.",
  },
  {
    title: 'For Law Firms',
    copy: 'Pre-incident hygiene and technical incident-response preparation that outside counsel can structure under privilege.',
  },
]

export default function PartnersPage() {
  const partnersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl('/partners')}#webpage`,
    url: absoluteUrl('/partners'),
    name: 'CannaShield Partner Program',
    description:
      'Referral and delivery channels for MSPs, insurance brokers, and law firms serving cannabis operators.',
    about: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-US',
  }

  return (
    <>
      <JsonLd id="partners-jsonld" data={partnersJsonLd} />
      <section className="section-shell pt-32 sm:pt-40">
        <p className="section-label">WORK WITH US</p>
        <h1 className="section-heading">
          For the professionals who serve cannabis operators.
        </h1>
        <p className="support-copy mt-6 max-w-2xl">
          CannaShield partners with MSPs, insurance brokers, and law firms that
          need cannabis-specific cyber and GRC depth without competing for their
          client relationship.
        </p>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {partners.map((partner) => (
            <article
              key={partner.title}
              className="rounded-lg border border-brand-border bg-brand-surface p-6"
            >
              <h2 className="text-2xl font-semibold text-brand-primary">
                {partner.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-secondary">
                {partner.copy}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={calendlyUrl}>Book a partner call</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <a href="/cannashield-partner-brief.pdf" target="_blank" rel="noopener noreferrer">
              Download the Partner Brief (PDF)
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
