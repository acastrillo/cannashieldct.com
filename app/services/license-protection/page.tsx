import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'Cannabis License Protection Cybersecurity',
  description:
    'NIST CSF 2.0-mapped security programs, written ISPs, vendor risk, and audit-ready evidence for cannabis license protection.',
  alternates: { canonical: '/services/license-protection' },
  openGraph: {
    title: 'Cannabis License Protection Cybersecurity | CannaShield',
    description:
      'NIST CSF 2.0-mapped security programs, written ISPs, vendor risk, and audit-ready evidence for cannabis operators.',
    url: '/services/license-protection',
    images: ['/og-image.png'],
  },
}

export default function LicenseProtectionPage() {
  return <ServicePageTemplate slug="license-protection" />
}
