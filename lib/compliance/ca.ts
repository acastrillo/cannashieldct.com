import type { StateRuleset } from './types'

const ca: StateRuleset = {
  state: 'CA',
  fullName: 'California',
  statuteNote:
    "California Consumer Privacy Act (CCPA/CPRA) and Department of Cannabis Control (DCC) regulations require cannabis operators to implement reasonable security procedures appropriate to the nature of the data handled. The CCPA creates a private right of action for data breaches involving inadequate security. This assessment reflects commonly expected controls — it is not legal advice. Consult qualified counsel regarding your specific DCC licensing obligations.",
  controls: [
    {
      id: 'mfa-email',
      label: 'MFA on email',
      weight: 15,
      criticalGap: false,
      gapNote:
        "Email compromise is a direct CCPA breach risk for cannabis operators. California AG guidance points to MFA as a 'reasonable security measure' under CCPA.",
    },
    {
      id: 'mfa-pos',
      label: 'MFA on POS',
      weight: 15,
      criticalGap: false,
      gapNote:
        'POS systems that handle personal information fall under CCPA. MFA on these systems reduces breach exposure and CCPA private-right-of-action liability.',
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        "CIS Controls and California AG guidance on 'reasonable security' include endpoint protection. EDR significantly reduces breach risk.",
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'California SB 327 and CPRA amendments reference documented security programs. A written ISP is increasingly standard for CCPA compliance.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'CCPA requires data processing agreements with service providers. A vendor register enables this — and DCC audits review third-party relationships.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        "California's 72-hour breach notification requirement under CPRA makes a documented IR plan essential for compliance.",
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        "Training is referenced in CPRA's 'reasonable security' standard and in most DCC operational requirements.",
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: false,
      gapNote:
        "California breach notification safe harbor applies to encrypted data. Encryption of backup data is the key risk mitigant and is expected under CCPA's reasonable security standard.",
    },
  ],
}

export default ca
