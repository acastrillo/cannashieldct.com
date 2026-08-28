import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/seo/JsonLd'
import { calendlyUrl } from '@/lib/constants'
import { absoluteUrl, publicContactEmail, publicPhone } from '@/lib/seo'

const phoneDisplay = '(203) 443-1473'

export const metadata: Metadata = {
  title: 'Contact CannaShield | Cannabis Cybersecurity Support',
  description:
    'Get in touch with CannaShield for Connecticut cannabis cybersecurity, vCISO, GRC, cyber insurance readiness, and incident response support.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact CannaShield | Cannabis Cybersecurity Support',
    description:
      'Connecticut-based cybersecurity and GRC support for licensed cannabis operators. Book a call, email us, or run the free Email Security Scorecard.',
    url: '/contact',
  },
}

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${absoluteUrl('/contact')}#contactpage`,
    url: absoluteUrl('/contact'),
    name: 'Contact CannaShield',
    about: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-US',
  }

  return (
    <>
      <JsonLd id="contact-jsonld" data={contactJsonLd} />
      <section className="section-shell pt-32 sm:pt-40">
        <p className="section-label">CONTACT</p>
        <h1 className="section-heading">Talk to CannaShield.</h1>
        <p className="support-copy mt-6 max-w-2xl">
          Cannabis-specific cybersecurity, GRC, and vCISO support for Connecticut
          operators. The fastest way to
          start is the free Email Security Scorecard or a 30-minute call.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="rounded-lg border border-brand-border bg-brand-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Book a call
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              30 minutes, no pitch deck. We map your risk picture and tell you what
              your MSP probably is not covering.
            </p>
            <Button asChild className="mt-6 w-full">
              <a href={calendlyUrl}>Open Calendly →</a>
            </Button>
          </article>

          <article className="rounded-lg border border-brand-border bg-brand-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Email
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              For partner programs, press, or anything that does not fit a calendar
              link.
            </p>
            <a
              href={`mailto:${publicContactEmail}`}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-md border border-brand-accent px-4 py-3 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-brand-background"
            >
              {publicContactEmail}
            </a>
          </article>

          <article className="rounded-lg border border-brand-border bg-brand-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Phone
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              For active incidents or urgent renewal/underwriting timelines.
            </p>
            <a
              href={`tel:${publicPhone}`}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-md border border-brand-accent px-4 py-3 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-brand-background"
            >
              {phoneDisplay}
            </a>
          </article>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-brand-border bg-brand-background p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Where we work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              CannaShield is based in Connecticut and supports licensed Connecticut
              cannabis operators — dispensaries, cultivators,
              processors, manufacturers, MSOs, and ancillary cannabis businesses.
            </p>
          </div>
          <div className="rounded-lg border border-brand-border bg-brand-background p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Response times
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              Inbound inquiries are answered within one business day. Active
              incidents on a Downtime Prevention retainer get a 4-hour response SLA.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
