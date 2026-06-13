import type { StateRuleset } from './types'

const ct: StateRuleset = {
  state: 'CT',
  fullName: 'Connecticut',
  statuteNote:
    "Connecticut's Department of Consumer Protection cannabis regulations, the Connecticut Data Privacy Act (CTDPA), and general breach notification law (Conn. Gen. Stat. § 36a-701b) collectively require licensed operators to implement reasonable security practices and maintain written security programs for personal data. This assessment reflects commonly expected controls — it is not legal advice. Consult qualified counsel regarding your specific DCP licensing obligations.",
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
        'POS compromise can trigger reporting obligations and license risk. Multi-factor access is increasingly expected by Connecticut DCP during audits.',
    },
    {
      id: 'edr-endpoints',
      label: 'EDR on endpoints',
      weight: 12,
      criticalGap: false,
      gapNote:
        'Endpoint detection is a standard expectation under Connecticut reasonable-security frameworks and most cyber insurance applications.',
    },
    {
      id: 'written-isp',
      label: 'Written information security program',
      weight: 12,
      criticalGap: true,
      gapNote:
        'The CTDPA and DCP cannabis regulations expect documented security programs. This gap frequently surfaces during DCP audits and insurance underwriting.',
    },
    {
      id: 'vendor-risk',
      label: 'Vendor risk register',
      weight: 10,
      criticalGap: false,
      gapNote:
        'Connecticut DCP increasingly reviews third-party security in cannabis audits. Document your METRC, POS, and compliance vendors.',
    },
    {
      id: 'ir-plan',
      label: 'Incident response plan documented',
      weight: 10,
      criticalGap: false,
      gapNote:
        "Connecticut's breach notification statute requires prompt response. A documented IR plan is the baseline for meeting that obligation.",
    },
    {
      id: 'security-training',
      label: 'Annual security awareness training',
      weight: 8,
      criticalGap: false,
      gapNote:
        'Social engineering targets budtenders and admin staff alike. Annual training demonstrates reasonable care under Connecticut law.',
    },
    {
      id: 'encrypted-backups',
      label: 'Encrypted backups tested in last 12 months',
      weight: 18,
      criticalGap: false,
      gapNote:
        'Encryption of personal and financial data is expected under the CTDPA. Untested backups are a ransomware liability that DCP and insurers both scrutinize.',
    },
  ],
}

export default ct
