import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'Downtime Prevention — CannaShield',
  description:
    'Incident response retainers, BEC defense, and ransomware resilience audits for cannabis POS, email, and recovery risk.',
}

export default function DowntimePreventionPage() {
  return <ServicePageTemplate slug="downtime-prevention" />
}
