import { FadeIn } from '@/components/motion/FadeIn'

const industries = [
  'Cannabis',
  'Hemp & CBD',
  'Cannabis-Adjacent SaaS',
  'Regulated Healthcare-Adjacent',
]

export function IndustriesStrip() {
  return (
    <FadeIn as="section" className="border-y border-brand-border bg-brand-surface/35">
      <div className="container py-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
          WHO WE SERVE
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <div
              key={industry}
              className={
                index === 0
                  ? 'text-lg font-semibold text-brand-accent'
                  : 'text-base font-medium text-brand-secondary'
              }
            >
              · {industry}
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}
