import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { FinalCTA } from '@/components/home/FinalCTA'
import { FadeIn } from '@/components/motion/FadeIn'
import { JsonLd } from '@/components/seo/JsonLd'
import { servicePages, skus } from '@/lib/constants'
import { serviceBreadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'
import type { ServiceSlug } from '@/lib/types'

import { HowItWorks } from './HowItWorks'
import { ServiceFAQ } from './ServiceFAQ'
import { ServiceHero } from './ServiceHero'
import { SkuCard } from './SkuCard'

type ServicePageTemplateProps = {
  slug: ServiceSlug
}

export function ServicePageTemplate({ slug }: ServicePageTemplateProps) {
  const page = servicePages[slug]
  const pageSkus = skus.filter((sku) => page.skus.includes(sku.code))

  return (
    <>
      <JsonLd
        id={`${slug}-service-jsonld`}
        data={[...serviceJsonLd(slug), serviceBreadcrumbJsonLd(slug)]}
      />
      <ServiceHero label={page.label} headline={page.headline} pain={page.pain} />

      <FadeIn as="section" className="section-shell">
        <p className="section-label">PAIN DETAIL</p>
        <h2 className="section-heading">The gap shows up before the incident.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {page.painDetails.map((detail) => (
            <div
              key={detail}
              className="flex gap-4 rounded-lg border border-brand-border bg-brand-surface p-5"
            >
              <CheckCircle2
                className="mt-1 h-5 w-5 shrink-0 text-brand-accent"
                aria-hidden="true"
              />
              <p className="text-base leading-relaxed text-brand-secondary">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn
        as="section"
        className="border-y border-brand-border bg-brand-surface/35"
      >
        <div className="section-shell">
          <p className="section-label">WHAT WE DELIVER</p>
          <h2 className="section-heading">SKU-based work with clear output.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pageSkus.map((sku) => (
              <SkuCard key={sku.code} sku={sku} />
            ))}
          </div>
        </div>
      </FadeIn>

      <HowItWorks />

      <FadeIn
        as="section"
        className="border-y border-brand-border bg-brand-surface/35"
      >
        <div className="section-shell">
          <p className="section-label">WHO THIS IS FOR</p>
          <h2 className="section-heading">Built for cannabis operators.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.operatorTypes.map((type) =>
              type.href ? (
                <Link
                  key={type.label}
                  href={type.href}
                  className="focus-ring rounded-lg border border-brand-border bg-brand-background p-5 text-lg font-semibold text-brand-primary transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  {type.label}
                </Link>
              ) : (
                <div
                  key={type.label}
                  className="rounded-lg border border-brand-border bg-brand-background p-5 text-lg font-semibold text-brand-primary"
                >
                  {type.label}
                </div>
              ),
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" className="section-shell">
        <div className="rounded-lg border border-brand-border bg-brand-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
            See it in action
          </p>
          <Link
            href={page.relatedReading.href}
            className="focus-ring mt-3 inline-flex text-lg font-semibold text-brand-primary transition-colors hover:text-brand-accent"
          >
            {page.relatedReading.label} →
          </Link>
        </div>
      </FadeIn>

      <ServiceFAQ faqs={page.faqs} />
      <FinalCTA />
    </>
  )
}
