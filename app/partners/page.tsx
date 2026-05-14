import type { Metadata } from 'next'

import { calendlyUrl } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Partner Program — CannaShield',
  description:
    'Referral and delivery channels for MSPs, insurance brokers, and law firms serving cannabis operators.',
}

const partners = [
  {
    title: 'For MSPs',
    copy: 'You handle IT. We handle GRC. No competition, no overlap — just stickier clients and 10% recurring revenue share on referrals.',
  },
  {
    title: 'For Insurance Brokers',
    copy: 'Your insureds pass underwriting. Fewer claims. CannaShield listed as your preferred remediation vendor.',
  },
  {
    title: 'For Law Firms',
    copy: 'Pre-incident hygiene and a technical partner who can work under privilege when something goes wrong.',
  },
]

export default function PartnersPage() {
  return (
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
      <Button asChild size="lg" className="mt-10 w-full sm:w-auto">
        <a href={calendlyUrl}>Book a partner call</a>
      </Button>
    </section>
  )
}
