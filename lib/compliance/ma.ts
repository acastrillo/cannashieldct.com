import type { StateRuleset } from './types'

const ma: StateRuleset = {
  state: 'MA',
  fullName: 'Massachusetts',
  statuteNote:
    'Massachusetts 201 CMR 17.00 (Standards for the Protection of Personal Information) is among the strictest state data security regulations in the country and applies to all businesses handling MA residents\' personal data. The Cannabis Control Commission (CCC) also incorporates data security into operational requirements for licensees. This assessment reflects commonly expected controls — it is not legal advice. Consult qualified counsel regarding your specific CCC licensing obligations.',
  controls: [
    {
      id: 'mfa-email',
      label: 'MFA on email',
      weight: 15,
      criticalGap: false,
      gapNote:
        'MA 201 CMR 17.04 requires authentication controls for systems containing personal information. MFA on email is a documented gap under this standard.',
    },
    {
      id: 'mfa-pos',
      label: 'MFA on POS',
      weight: 15,
      criticalGap: false,
      gapNote:
        'POS systems handling customer data fall under MA 201 CMR 17.04 access control requirements.',
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        'MA 201 CMR 17.04 requires up-to-date malware protection on all systems. EDR fulfills this requirement at a higher standard.',
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'MA 201 CMR 17.03 explicitly requires a written comprehensive information security program. This is among the most enforceable controls under Massachusetts law.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'MA 201 CMR 17.03(2)(f) requires overseeing third-party service providers. Cannabis operators must contractually require adequate security from vendors handling personal data.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Massachusetts breach notification law (M.G.L. c. 93H) requires prompt notification. A documented plan is the baseline for compliance.',
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        'MA 201 CMR 17.03(2)(a) requires employee security training. Annual frequency is the practical standard.',
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: false,
      gapNote:
        'MA 201 CMR 17.04(5) requires encryption of personal information transmitted across networks. Backup encryption extends this requirement. Untested backups are a CCC and insurance liability.',
    },
  ],
}

export default ma
