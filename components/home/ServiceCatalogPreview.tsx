import { FadeIn } from '@/components/motion/FadeIn'
import { SkuCard } from '@/components/services/SkuCard'
import { calendlyUrl, skus } from '@/lib/constants'

export function ServiceCatalogPreview() {
  return (
    <FadeIn as="section" id="service-catalog" className="section-shell">
      <p className="section-label">WHAT WE DELIVER</p>
      <h2 className="section-heading">Nine services. Priced to move.</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skus.map((sku) => (
          <SkuCard key={sku.code} sku={sku} compact />
        ))}
      </div>
      <a
        href={calendlyUrl}
        className="focus-ring mt-8 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
      >
        Not sure which fits? Book a call →
      </a>
    </FadeIn>
  )
}
