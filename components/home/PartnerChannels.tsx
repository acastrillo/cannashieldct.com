import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'

const channels = [
  {
    title: 'FOR MSPs',
    copy: "You handle IT. We handle GRC. No competition, no overlap — just stickier clients and 10% of first-year recurring revenue on referred retainers, plus $500 per fixed-fee project.",
  },
  {
    title: 'FOR INSURANCE BROKERS',
    copy: "Your insureds present stronger, clearer evidence for underwriting — we don't promise coverage or premium outcomes. CannaShield is listed as your preferred remediation vendor.",
  },
  {
    title: 'FOR LAW FIRMS',
    copy: 'Pre-incident hygiene and technical incident-response preparation that outside counsel can structure under privilege.',
  },
]

export function PartnerChannels() {
  return (
    <FadeIn as="section" className="section-shell">
      <p className="section-label">WORK WITH US</p>
      <h2 className="section-heading">
        For the professionals who serve cannabis operators.
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {channels.map((channel) => (
          <article
            key={channel.title}
            className="rounded-lg border border-brand-border bg-brand-surface p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
              {channel.title}
            </h3>
            <p className="mt-5 text-base leading-relaxed text-brand-secondary">
              {channel.copy}
            </p>
            <Link
              href="/partners"
              className="focus-ring mt-7 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
            >
              Become a partner →
            </Link>
          </article>
        ))}
      </div>
    </FadeIn>
  )
}
