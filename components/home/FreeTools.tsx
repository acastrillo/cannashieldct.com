import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/button'

type ToolCard = {
  title: string
  description: string
  meta: string
  href: string
  cta: string
}

const tools: ToolCard[] = [
  {
    title: 'Email Security Scorecard',
    description:
      'Enter your domain. Get a report on your DMARC, SPF, and DKIM configuration — and whether attackers can impersonate your brand in 60 seconds.',
    meta: 'Free · 90 seconds · No account needed',
    href: '/cyber-check',
    cta: 'Check your domain →',
  },
  {
    title: 'Attack Surface Snapshot',
    description:
      'See what Shodan, certificate logs, and breach databases already know about your business — open ports, exposed subdomains, breach history, and spoofing risk.',
    meta: 'Free · 60 seconds · Passive recon only',
    href: '/cyber-check/attack-surface',
    cta: 'Run the snapshot →',
  },
  {
    title: 'Cannabis Compliance Quick-Check',
    description:
      'A Connecticut-focused security-readiness check for cannabis operators. See where your controls need work before renewal, insurance underwriting, or counsel review.',
    meta: 'Free · 60 seconds · No account needed',
    href: '/compliance-check',
    cta: 'Check your compliance →',
  },
]

export function FreeTools() {
  return (
    <FadeIn as="section" id="free-tools" className="section-shell">
      <p className="section-label">START HERE — FREE</p>
      <h2 className="section-heading">
        Find out what&apos;s exposed before attackers do.
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.title}
            className="flex h-full flex-col rounded-lg border border-brand-border bg-brand-surface p-6"
          >
            <div className="mb-5 inline-flex w-fit rounded-full border border-brand-accent/40 px-3 py-1 text-xs font-semibold text-brand-accent">
              LIVE
            </div>
            <h3 className="text-2xl font-semibold text-brand-primary">{tool.title}</h3>
            <p className="mt-4 flex-1 text-base leading-relaxed text-brand-secondary">
              {tool.description}
            </p>
            <p className="mt-5 text-sm text-brand-secondary">{tool.meta}</p>
            <Button asChild className="mt-6 w-full">
              <Link href={tool.href}>{tool.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </FadeIn>
  )
}
