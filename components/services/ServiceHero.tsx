import { calendlyUrl } from '@/lib/constants'

import { Button } from '../ui/button'

type ServiceHeroProps = {
  label: string
  headline: string
  pain: string
}

export function ServiceHero({ label, headline, pain }: ServiceHeroProps) {
  return (
    <section className="border-b border-brand-border bg-brand-background pt-32 sm:pt-40">
      <div className="container pb-16 sm:pb-20">
        <p className="section-label">{label}</p>
        <h1 className="max-w-5xl font-serif text-[40px] font-semibold leading-headline text-brand-primary sm:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="support-copy mt-7 max-w-3xl">{pain}</p>
        <Button asChild size="lg" className="mt-9 w-full sm:w-auto">
          <a href={calendlyUrl}>Book a call</a>
        </Button>
      </div>
    </section>
  )
}
