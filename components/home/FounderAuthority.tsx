import { FadeIn } from '@/components/motion/FadeIn'

const credentials = [
  'Working cyber incident response analyst, NYC',
  'NIST CSF 2.0 mapped programs',
  'Cannabis-specific GRC & vCISO delivery',
  'Connecticut-based, remote-friendly',
]

export function FounderAuthority() {
  return (
    <FadeIn
      as="section"
      id="why-cannashield"
      className="border-y border-brand-border bg-brand-surface/35"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] min-h-80 overflow-hidden rounded-lg border border-brand-border bg-gradient-to-br from-brand-surface via-brand-background to-brand-surface p-8">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
                Founder
              </p>
              <p className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-primary sm:text-4xl">
                Alex Castro
              </p>
              <p className="mt-2 text-sm text-brand-secondary">
                Cyber incident response analyst &middot; vCISO for cannabis operators
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-brand-secondary">
              {credentials.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand-accent">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="section-label">WHY CANNASHIELD</p>
          <h2 className="section-heading">
            Built by someone who&apos;s been inside the breach.
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
            <p>
              Alex Castro is a working cyber incident response analyst in New
              York City. He&apos;s spent years inside breaches like the ones
              that hit STIIIZY and Trulieve — watching how attackers move, what
              defenders miss, and why most cannabis operators don&apos;t realize
              they&apos;re targets until it&apos;s too late.
            </p>
            <p>
              CannaShield is built around one premise: cannabis operators
              deserve the same caliber of security leadership that Fortune 500s
              have, at a price point an SMB can afford.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand-primary">
            <span>· NIST CSF 2.0 Mapped</span>
            <span>· Connecticut-Based</span>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
