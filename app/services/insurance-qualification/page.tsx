import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'Insurance Qualification — CannaShield',
  description:
    'Cyber insurance readiness documentation, MFA and EDR evidence, renewal defense, and broker-facing technical support for cannabis operators.',
}

export default function InsuranceQualificationPage() {
  return <ServicePageTemplate slug="insurance-qualification" />
}
