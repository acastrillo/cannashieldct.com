import { FadeIn } from '@/components/motion/FadeIn'

const facts = [
  {
    label: 'Who we serve',
    value:
      'Dispensaries, cultivators, processors, manufacturers, MSOs, and ancillary cannabis operators.',
  },
  {
    label: 'What we protect',
    value:
      'Licenses, customer data, patient data, POS systems, email domains, vendor payments, recovery plans, and audit evidence.',
  },
  {
    label: 'How we help',
    value:
      'Virtual CISO, GRC programs, cyber insurance readiness, incident response retainers, BEC defense, and ransomware resilience audits.',
  },
]

export function AnswerEngineSummary() {
  return (
    <FadeIn
      as="section"
      className="border-b border-brand-border bg-brand-surface/25"
    >
      <div className="section-shell">
        <p className="section-label">CANNABIS CYBERSECURITY FOCUS</p>
        <h2 className="section-heading">
          Built for the systems that keep cannabis businesses licensed and open.
        </h2>
        <p className="support-copy mt-6 max-w-3xl">
          CannaShield is a Connecticut-based cybersecurity and GRC partner for
          cannabis operators. We help translate cyber risk into license
          protection, insurance readiness, downtime prevention, and practical
          control evidence that executives, brokers, regulators, and investors
          can understand.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-lg border border-brand-border bg-brand-background p-5"
            >
              <h3 className="text-base font-semibold text-brand-primary">
                {fact.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}
