import type { Metadata } from 'next'

import { ServicePageTemplate } from '@/components/services/ServicePageTemplate'

export const metadata: Metadata = {
  title: 'License Protection — CannaShield',
  description:
    'NIST CSF 2.0-mapped security programs, written ISPs, vendor risk, and audit-ready evidence for cannabis operators.',
}

export default function LicenseProtectionPage() {
  return <ServicePageTemplate slug="license-protection" />
}
