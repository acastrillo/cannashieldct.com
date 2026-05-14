import { FadeIn } from '@/components/motion/FadeIn'
import { breaches } from '@/lib/constants'
import { BreachStat } from './BreachStat'

export function BreachWall() {
  return (
    <FadeIn
      as="section"
      className="border-y border-brand-border bg-brand-surface/35"
    >
      <div className="section-shell">
        <p className="section-label">THE THREAT IS REAL</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-heading">Named. Dated. Documented.</h2>
            <p className="support-copy mt-5 max-w-2xl">
              These aren&apos;t hypotheticals. These are your peers.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {breaches.map((breach) => (
            <article
              key={breach.company}
              className="rounded-lg border border-brand-border bg-brand-background p-6"
            >
              <div className="flex flex-col gap-2 border-b border-brand-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="font-serif text-3xl font-semibold text-brand-primary">
                  {breach.company}
                </h3>
                <p className="text-sm text-brand-secondary">{breach.date}</p>
              </div>
              <div className="mt-6">
                {breach.counter ? (
                  <BreachStat {...breach.counter} />
                ) : (
                  <p className="text-2xl font-semibold text-brand-accent">
                    {breach.impact}
                  </p>
                )}
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  Root cause
                </p>
                <p className="mt-2 text-base leading-relaxed text-brand-secondary">
                  {breach.rootCause}
                </p>
                <p className="mt-5 text-base leading-relaxed text-brand-primary/90">
                  {breach.note}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-14 max-w-3xl text-center font-serif text-4xl font-semibold leading-headline text-brand-primary sm:text-5xl">
          Your MSP isn&apos;t watching for this. We are.
        </p>
      </div>
    </FadeIn>
  )
}
