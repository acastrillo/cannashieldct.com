import type { StateRuleset } from './types'

const ct: StateRuleset = {
  state: 'CT',
  fullName: 'Connecticut',
  statuteNote:
    'Connecticut General Statutes § 42-471 requires any person possessing another person\'s personal information to safeguard it from misuse. Section 36a-701b establishes breach-notification duties, and the CTDPA adds privacy and security obligations for covered controllers. Connecticut cannabis rules focus heavily on physical security and inventory control; this score therefore combines legal context with recommended cyber safeguards. It is not legal advice.',
  controls: [
    {
      id: 'mfa-email',
      label: 'MFA on email',
      weight: 15,
      criticalGap: false,
      gapNote:
        'Email is the primary BEC attack vector for cannabis operators. MFA is a baseline control expected under reasonable cybersecurity standards and most cyber insurance policies.',
    },
    {
      id: 'mfa-pos',
      label: 'MFA on POS',
      weight: 15,
      criticalGap: false,
      gapNote:
        'Compromised POS credentials can expose payment, customer, or operational data. MFA is a recommended safeguard; this check does not represent it as an express Connecticut cannabis mandate.',
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        'Managed endpoint protection helps detect malware and unauthorized activity. It is a recommended safeguard and a common insurance-control question, not an express Connecticut cannabis mandate.',
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'A written security program turns safeguards, ownership, and evidence into a repeatable operating process. It supports reasonable-security and insurance reviews, but applicability and legal sufficiency require counsel.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Document the vendors that handle regulated, personal, financial, and operational data. Vendor review is recommended risk management; this check does not claim DCP expressly requires a vendor register.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Connecticut § 36a-701b creates breach-notification duties when covered personal information is involved. A documented response plan helps an operator investigate and coordinate notice, but counsel should determine actual obligations and deadlines.',
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        'Role-based training reduces phishing and payment-fraud risk. It is a recommended safeguard, not an express Connecticut cannabis mandate.',
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: false,
      gapNote:
        'Tested, protected backups support ransomware recovery. Encryption can also affect the analysis of a breach under § 36a-701b, but this control is presented as recommended resilience—not a blanket DCP requirement.',
    },
  ],
}

export default ct
