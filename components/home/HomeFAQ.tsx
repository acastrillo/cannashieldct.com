import { FadeIn } from '@/components/motion/FadeIn'
import { homeFaqs } from '@/lib/seo'

export function HomeFAQ() {
  return (
    <FadeIn as="section" className="section-shell">
      <p className="section-label">FAQ</p>
      <h2 className="section-heading">Questions cannabis operators ask first.</h2>
      <div className="mt-10 grid gap-4">
        {homeFaqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-lg border border-brand-border bg-brand-surface p-5"
          >
            <summary className="cursor-pointer text-lg font-semibold text-brand-primary">
              {faq.question}
            </summary>
            <p className="mt-4 text-base leading-relaxed text-brand-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </FadeIn>
  )
}
