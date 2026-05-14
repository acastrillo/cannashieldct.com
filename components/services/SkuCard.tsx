import type { Sku } from '@/lib/types'
import { cn } from '@/lib/utils'

type SkuCardProps = {
  sku: Sku
  compact?: boolean
}

export function SkuCard({ sku, compact = false }: SkuCardProps) {
  return (
    <article
      className={cn(
        'rounded-lg border border-brand-border bg-brand-surface p-5 transition-colors hover:border-brand-accent',
        compact ? 'min-h-56' : 'min-h-64',
      )}
    >
      <p className="font-mono text-sm font-semibold text-brand-accent">
        {sku.code}
      </p>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-brand-primary">
        {sku.name}
      </h3>
      <p className="mt-5 text-3xl font-semibold text-brand-primary">
        {sku.price}
      </p>
      <p className="mt-2 text-sm text-brand-secondary">{sku.delivery}</p>
      <p className="mt-5 text-sm italic leading-relaxed text-brand-secondary">
        {sku.trigger}
      </p>
    </article>
  )
}
