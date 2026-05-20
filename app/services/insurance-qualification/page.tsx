import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'Cannabis Cyber Insurance Readiness',
  description:
    'Cyber insurance readiness documentation, MFA and EDR evidence, renewal defense, and broker-facing technical support for cannabis operators.',
  alternates: { canonical: '/services/insurance-qualification' },
  openGraph: {
    title: 'Cannabis Cyber Insurance Readiness | CannaShield',
    description:
      'Cyber insurance readiness documentation, MFA and EDR evidence, renewal defense, and broker-facing technical support for cannabis operators.',
    url: '/services/insurance-qualification',
  },
}

export default function InsuranceQualificationPage() {
  return <ServicePageTemplate slug="insurance-qualification" />
}
