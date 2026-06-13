import type { StateRuleset } from './types'

const il: StateRuleset = {
  state: 'IL',
  fullName: 'Illinois',
  statuteNote:
    'The Illinois Cannabis Regulation and Tax Act (CRTA) and Personal Information Protection Act (PIPA) require cannabis licensees to implement "adequate security measures" including multi-factor authentication for system access and encryption of all personal and financial data. This assessment reflects commonly expected controls — it is not legal advice. Consult qualified counsel regarding your specific licensing obligations.',
  controls: [
    {
      id: 'mfa-email',
      label: 'MFA on email',
      weight: 15,
      criticalGap: true,
      gapNote:
        'Illinois CRTA and PIPA explicitly require access controls including MFA. This gap will surface at license renewal and cyber insurance underwriting.',
    },
    {
      id: 'mfa-pos',
      label: 'MFA on POS',
      weight: 15,
      criticalGap: true,
      gapNote:
        'Point-of-sale access without MFA is a direct control deficiency under Illinois cannabis access-control requirements.',
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        'Endpoint detection significantly reduces dwell time after a breach. Illinois regulators increasingly expect documented endpoint security controls.',
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'Illinois PIPA requires a written security program. Absence is a documented audit finding at renewal.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Seed-to-sale, POS, and compliance vendors are high-risk third parties. Illinois expects documented vendor risk management for licensees.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Illinois breach notification obligations make a documented IR plan critical to meeting mandatory response timelines.',
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        'Social engineering is the primary attack vector for cannabis operations. Annual training is expected under reasonable care standards.',
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: true,
      gapNote:
        'Illinois cannabis rules explicitly require encryption of sensitive data. Untested backups frequently fail when most needed — a ransomware event without verified backups typically means paying the ransom.',
    },
  ],
}

export default il
