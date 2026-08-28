import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'Cannabis Ransomware & Downtime Prevention',
  description:
    'Incident response retainers, BEC defense, and ransomware resilience audits for cannabis POS, email, and recovery risk.',
  alternates: { canonical: '/services/downtime-prevention' },
  openGraph: {
    title: 'Cannabis Ransomware & Downtime Prevention | CannaShield',
    description:
      'Incident response retainers, BEC defense, and ransomware resilience audits for cannabis POS, email, and recovery risk.',
    url: '/services/downtime-prevention',
    images: ['/og-image.png'],
  },
}

export default function DowntimePreventionPage() {
  return <ServicePageTemplate slug="downtime-prevention" />
}
