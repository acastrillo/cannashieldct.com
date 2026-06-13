import type { StateRuleset } from './types'

const ny: StateRuleset = {
  state: 'NY',
  fullName: 'New York',
  statuteNote:
    "New York's Marihuana Regulation and Taxation Act (MRTA), SHIELD Act (NY Gen. Bus. Law § 899-bb), and breach notification law together require cannabis operators to maintain reasonable administrative, technical, and physical safeguards commensurate with the size of the business and sensitivity of data. This assessment reflects commonly expected controls — it is not legal advice. Consult qualified counsel regarding your specific OCM licensing obligations.",
  controls: [
    {
      id: 'mfa-email',
      label: 'MFA on email',
      weight: 15,
      criticalGap: false,
      gapNote:
        'NY SHIELD Act defines failure to implement reasonable MFA as a potential deficiency in administrative safeguards. BEC remains the primary financial threat to cannabis operators.',
    },
    {
      id: 'mfa-pos',
      label: 'MFA on POS',
      weight: 15,
      criticalGap: false,
      gapNote:
        "POS access controls are part of the reasonable technical safeguards expected under SHIELD. OCM audits are increasingly reviewing access management practices.",
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        "Endpoint detection is a baseline technical safeguard under NY SHIELD Act's reasonable security framework.",
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'NY SHIELD Act explicitly requires a written data security program scaled to business size. This gap is a documented audit finding.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'SHIELD Act requires oversight of third-party service providers. Cannabis operations rely heavily on seed-to-sale, POS, and compliance vendors.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        "New York's 30-day breach notification window requires a pre-planned IR process. An undocumented process increases notification risk.",
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        'NY SHIELD Act lists employee training as a component of reasonable administrative safeguards.',
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: false,
      gapNote:
        'Encryption of private information is expected under SHIELD. Untested backups are a ransomware exposure that OCM and insurers both scrutinize.',
    },
  ],
}

export default ny
