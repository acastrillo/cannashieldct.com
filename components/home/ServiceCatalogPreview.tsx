import Link from 'next/link'

import { FadeIn } from '@/components/motion/FadeIn'
import { SkuCard } from '@/components/services/SkuCard'
import { skus } from '@/lib/constants'

export function ServiceCatalogPreview() {
  return (
    <FadeIn as="section" id="service-catalog" className="section-shell">
      <p className="section-label">WHAT WE DELIVER</p>
      <h2 className="section-heading">Eight services. Priced to move.</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {skus.map((sku) => (
          <SkuCard key={sku.code} sku={sku} compact />
        ))}
      </div>
      <Link
        href="/#service-catalog"
        className="focus-ring mt-8 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
      >
        View full catalog →
      </Link>
    </FadeIn>
  )
}
