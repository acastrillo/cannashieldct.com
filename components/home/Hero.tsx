import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { calendlyUrl } from '@/lib/constants'

const ticker =
  'STIIIZY — 420,000 records  ·  MariMed — $650K wired  ·  Trulieve — dark web  ·  MJ Freeway — 14-state outage  ·  Aurora Cannabis — breach disclosed  ·  Ontario Cannabis Store — customer data leaked  ·'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-brand-border bg-brand-background pt-28 sm:pt-32">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-[58%_center] opacity-[0.12] sm:opacity-25"
        style={{ backgroundImage: "url('/hero-risk-map.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-brand-background/84" aria-hidden="true" />
      <div className="container pb-8 lg:pb-10">
        <div className="max-w-[1220px]">
          <h1 className="max-w-[1220px] text-balance font-serif text-[38px] font-semibold leading-headline text-brand-primary min-[420px]:text-[42px] sm:text-6xl lg:text-[68px]">
            Cannabis cybersecurity isn&apos;t an IT problem. It&apos;s a
            license problem.
          </h1>
          <p className="support-copy mt-7 max-w-2xl">
            STIIIZY: 420,000 customer records leaked. MariMed: $650,000 wired
            to attackers. Trulieve&apos;s customer data is on a dark web leak
            site right now. CannaShield is the vCISO and GRC partner cannabis
            operators call when their MSP isn&apos;t enough.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-auto min-h-12 w-full whitespace-normal py-3 text-center leading-snug sm:w-auto"
            >
              <Link href="/cyber-check">
                See what attackers already know about your business →
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href={calendlyUrl}>Book a call</a>
            </Button>
          </div>
        </div>
      </div>
      <div className="border-y border-brand-border bg-brand-surface/90 py-4">
        <div className="flex overflow-hidden whitespace-nowrap text-sm font-semibold text-brand-accent">
          <div className="marquee-track flex min-w-full shrink-0 gap-10 pr-10">
            <span>{ticker}</span>
            <span aria-hidden="true">{ticker}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
