import { FileCheck, ShieldAlert, ShieldCheck } from 'lucide-react'

import type { Breach, Pillar, ServicePage, Sku } from '@/lib/types'

export const calendlyUrl = 'https://calendly.com/cannashieldct'

export const pillars = [
  {
    title: 'License Protection',
    href: '/services/license-protection',
    icon: ShieldCheck,
    pain:
      'Your MSP handles IT. Nobody owns the written ISP, vendor risk, or audit-ready evidence your regulator wants at renewal.',
    solution:
      'We deliver NIST CSF 2.0-mapped security programs built for cannabis operators — designed to hold up when your regulator, investor, or acquirer asks for proof.',
    priceAnchor: 'From $1,800/mo',
    cta: 'Explore License Protection →',
  },
  {
    title: 'Insurance Qualification',
    href: '/services/insurance-qualification',
    icon: FileCheck,
    pain:
      "Premiums went up 40%. Your carrier wants MFA attestation, an IR plan, and EDR proof — or they're non-renewing you.",
    solution:
      'We prepare the documentation, close the gaps, and sit on the call with your broker so you walk into underwriting with the evidence your carrier is asking for.',
    priceAnchor: 'From $1,800/yr',
    cta: 'Explore Insurance Qualification →',
  },
  {
    title: 'Downtime Prevention',
    href: '/services/downtime-prevention',
    icon: ShieldAlert,
    pain:
      'POS goes down and you lose $30,000 a day. STIIIZY scared your board. Someone almost wired $200K to a fake vendor.',
    solution:
      "Incident response retainers, ransomware resilience audits, and BEC defense sprints — so when it hits the industry, it doesn't shut you down.",
    priceAnchor: 'From $1,200/mo',
    cta: 'Explore Downtime Prevention →',
  },
] satisfies Pillar[]

export const breaches = [
  {
    company: 'STIIIZY',
    date: 'January 2025',
    impact: '380,000 people notified',
    rootCause: 'Third-party POS vendor breach',
    note: 'Patient data, purchase history, ID scans — all exposed.',
    counter: { value: 380000, label: 'people notified' },
  },
  {
    company: 'MariMed',
    date: '2023',
    impact: '$646,000 wired to attackers',
    rootCause: 'Business Email Compromise (BEC)',
    note: 'A spoofed vendor email. One wire transfer. Gone.',
    counter: { prefix: '$', value: 646000, label: 'wired to attackers' },
  },
  {
    company: 'MJ Freeway',
    date: '2018 (industry reference)',
    impact: '14-state operational outage',
    rootCause: 'Ransomware destroyed seed-to-sale tracking',
    note: "Dispensaries couldn't legally sell for days.",
    counter: { value: 14, suffix: '-state', label: 'operational outage' },
  },
  {
    company: 'Aurora Cannabis',
    date: '2024',
    impact: 'Breach disclosed to regulators',
    rootCause: 'Undisclosed network intrusion',
    note: 'Public company. Mandatory disclosure. Brand damage.',
  },
  {
    company: 'Ontario Cannabis Store',
    date: '2024',
    impact: 'Customer data leaked',
    rootCause: 'Third-party vendor compromise',
    note: 'Government-run. Still got hit.',
  },
] satisfies Breach[]

export const skus = [
  {
    code: 'LP-1',
    name: 'GRC Foundations Retainer',
    price: '$1,800/mo',
    delivery: 'Ongoing',
    trigger: 'You need a real security program, not a policy folder.',
    pillar: 'license-protection',
  },
  {
    code: 'LP-2',
    name: 'State Cannabis Cyber Compliance Audit',
    price: '$2,500–$4,500',
    delivery: '3 weeks',
    trigger: 'Renewal, expansion, or investor diligence is coming.',
    pillar: 'license-protection',
  },
  {
    code: 'LP-3',
    name: 'Schedule III Readiness Assessment',
    price: '$3,500',
    delivery: '2 weeks',
    trigger: 'Schedule III change creates new control expectations.',
    pillar: 'license-protection',
  },
  {
    code: 'IQ-1',
    name: 'Cyber Insurance Readiness Package',
    price: '$2,500',
    delivery: '3 weeks',
    trigger: 'Your carrier is asking harder questions.',
    pillar: 'insurance-qualification',
  },
  {
    code: 'IQ-2',
    name: 'Renewal Defense Pack',
    price: '$1,800/yr',
    delivery: '2 weeks pre-renewal',
    trigger: 'Renewal is close and the paperwork is stale.',
    pillar: 'insurance-qualification',
  },
  {
    code: 'DP-1',
    name: 'Incident Response Retainer',
    price: '$1,200/mo + $275/hr',
    delivery: 'Ongoing',
    trigger: 'You want IR muscle before the weekend call.',
    pillar: 'downtime-prevention',
  },
  {
    code: 'DP-2',
    name: 'BEC/Phishing Defense Sprint',
    price: '$3,000',
    delivery: '2 weeks',
    trigger: 'Finance is one spoofed email from a bad wire.',
    pillar: 'downtime-prevention',
  },
  {
    code: 'DP-3',
    name: 'Ransomware Resilience Audit',
    price: '$4,000',
    delivery: '3 weeks',
    trigger: 'Your POS, backups, and recovery plan need proof.',
    pillar: 'downtime-prevention',
  },
  {
    code: 'TOF-1',
    name: 'Cannabis Cyber Starter Assessment',
    price: '$750',
    delivery: '1 week',
    trigger: 'You need a written snapshot of your exposure before committing to a program.',
    pillar: 'license-protection',
  },
] satisfies Sku[]

export const servicePages = {
  'license-protection': {
    slug: 'license-protection',
    label: 'License Protection',
    headline: "Your license is your business. Don't let a cyber gap cost you it.",
    pain:
      'Most cannabis operators have an MSP handling IT. Almost none have a written Information Security Program, documented vendor risk, or audit-ready evidence. When your regulator asks — and they will ask — that gap becomes a license problem.',
    painDetails: [
      'Renewal evidence lives across inboxes, MSP tickets, and disconnected vendor portals.',
      'Vendor contracts mention security, but nobody tracks proof, exceptions, or renewal dates.',
      'Policies exist as templates, not as operating controls your team can demonstrate.',
    ],
    skus: ['LP-1', 'LP-2', 'LP-3'],
    operatorTypes: ['Dispensary', 'Cultivator', 'MSO', 'Processor'],
    faqs: [
      {
        question: 'What is a written ISP and why does my state care?',
        answer:
          "A written Information Security Program (ISP) documents your security controls, policies, and procedures. Several states now reference them explicitly in cannabis licensing rules, and others use them as evidence of due care in breach investigations. Without one, you're exposed at renewal and in litigation.",
      },
      {
        question: 'Which states have cyber requirements for cannabis operators?',
        answer:
          'CannaShield currently serves Connecticut operators only. We map Connecticut data-protection and breach-notification obligations to practical security controls, then separate legal requirements from recommended safeguards. Counsel should confirm how each obligation applies to your business.',
      },
      {
        question: 'How long does LP-2 take?',
        answer:
          'Three weeks for a Connecticut engagement. You receive a written findings report, a prioritized remediation roadmap, and a control evidence binder prepared for renewal, insurance, investor, and counsel review.',
      },
      {
        question: "What's included in the Schedule III Readiness Assessment (LP-3)?",
        answer:
          'A two-week engagement mapping your current controls against DEA Schedule III security requirements (21 CFR 1301.71–1301.76), HIPAA Security Rule safeguards, and DSCSA track-and-trace parallels. Output: written gap report + prioritized roadmap.',
      },
    ],
  },
  'insurance-qualification': {
    slug: 'insurance-qualification',
    label: 'Insurance Qualification',
    headline: "Stop paying 40% more for coverage you can't prove you deserve.",
    pain:
      "Cyber insurers are tightening. They want MFA attestation, EDR proof, incident response plans, and vendor lists before they quote — let alone renew. Most cannabis operators can't produce any of it. We close those gaps before the underwriter does.",
    painDetails: [
      'Underwriters are asking for MFA, EDR, backups, training, and incident response proof before they quote.',
      "Your broker can't defend your risk without evidence mapped to carrier language.",
      'One unchecked box can push you into non-renewal, exclusions, or a painful premium increase.',
    ],
    skus: ['IQ-1', 'IQ-2'],
    operatorTypes: ['Dispensary', 'Cultivator', 'MSO', 'Processor'],
    faqs: [
      {
        question: 'What do carriers actually want from cannabis operators?',
        answer:
          'The most common underwriting requirements: MFA on all email and remote access, an EDR/AV solution on endpoints, a written incident response plan, an annual security awareness training program, and MFA-protected backups tested within 12 months. We assess and document all of it.',
      },
      {
        question: 'Can you work directly with our broker?',
        answer:
          'Yes. We regularly participate in underwriting calls as the technical authority. We translate your controls into the language carriers need to hear.',
      },
      {
        question: 'What if we fail the readiness assessment?',
        answer:
          "Most clients have gaps — that's expected. We prioritize remediation by underwriting impact and work through the highest-risk items first. Most clients are ready to resubmit within 3 weeks.",
      },
      {
        question: 'How does the Renewal Defense Pack (IQ-2) work?',
        answer:
          'Two weeks before your renewal date, we produce updated attestation documentation, close any new gaps identified since last year, and prepare a briefing document for your broker. $1,800/yr, timed to your renewal.',
      },
    ],
  },
  'downtime-prevention': {
    slug: 'downtime-prevention',
    label: 'Downtime Prevention',
    headline:
      "When ransomware hits your POS, you lose $30,000 a day. We make sure it doesn't.",
    pain:
      "The cannabis industry is cash-heavy, banking-constrained, PHI-rich, and running POS systems that weren't designed for enterprise security. STIIIZY. MJ Freeway. The pattern is consistent — and the MSP wasn't enough.",
    painDetails: [
      'POS, METRC workflows, and email payments all create operational choke points.',
      'Ransomware crews steal data before encryption, turning recovery into a privacy event.',
      'BEC attacks move faster than policy approvals when finance lacks verification controls.',
    ],
    skus: ['DP-1', 'DP-2', 'DP-3'],
    operatorTypes: ['Dispensary', 'Cultivator', 'MSO', 'Processor'],
    faqs: [
      {
        question: 'What does an Incident Response Retainer (DP-1) actually include?',
        answer:
          "On-retainer IR capability means we're on call when something happens. Included: written IR runbook customized to your stack, annual tabletop exercise, BEC detection checklist, 4-hour response SLA during declared incidents, and $275/hr for active incident hours.",
      },
      {
        question: 'What is BEC and why does it hit cannabis operators hard?',
        answer:
          'Business Email Compromise — attackers impersonate a vendor or executive over email and trick your finance team into wiring money. MariMed lost $646,000 in a single BEC incident. Cannabis operators are targets because they move large cash-equivalent transactions and often lack the internal controls to catch it.',
      },
      {
        question: 'How long does a Ransomware Resilience Audit take?',
        answer:
          'Three weeks. We assess your backup architecture, POS vendor security posture, network segmentation, endpoint protection, and recovery procedures. Output: written findings + a prioritized resilience roadmap.',
      },
      {
        question: 'We already have an MSP. Why do we need DP-1?',
        answer:
          "MSPs manage IT. They handle uptime, endpoints, and METRC connectivity. Very few have written IR runbooks for cannabis-specific scenarios, run tabletop exercises, or provide on-call IR response. That's not a knock on your MSP — it's just a different scope. We work alongside them, not instead of them.",
      },
    ],
  },
} satisfies Record<string, ServicePage>
