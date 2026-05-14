import { ClipboardCheck, FileText, SearchCheck } from 'lucide-react'

import { FadeIn } from '@/components/motion/FadeIn'

const steps = [
  {
    title: 'Assess',
    copy: 'We review your current controls, vendors, evidence, policies, and buyer trigger.',
    icon: SearchCheck,
  },
  {
    title: 'Deliver',
    copy: 'We close the gaps that matter most and build the documentation your stakeholder needs.',
    icon: ClipboardCheck,
  },
  {
    title: 'Document',
    copy: 'You leave with written proof, prioritized next steps, and a defensible record of due care.',
    icon: FileText,
  },
]

export function HowItWorks() {
  return (
    <FadeIn as="section" className="section-shell">
      <p className="section-label">HOW IT WORKS</p>
      <h2 className="section-heading">Assess → Deliver → Document</h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <article
              key={step.title}
              className="rounded-lg border border-brand-border bg-brand-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-brand-accent">
                  0{index + 1}
                </span>
                <Icon className="h-5 w-5 text-brand-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold text-brand-primary">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-brand-secondary">
                {step.copy}
              </p>
            </article>
          )
        })}
      </div>
    </FadeIn>
  )
}
