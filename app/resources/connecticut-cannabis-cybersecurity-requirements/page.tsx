import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl, founderName } from '@/lib/seo'

const resourcePath = '/resources/connecticut-cannabis-cybersecurity-requirements'
const resourceUrl = absoluteUrl(resourcePath)

export const metadata: Metadata = {
  title: 'Connecticut Cannabis Cybersecurity Requirements (2026)',
  description:
    'A practical 2026 guide to Connecticut cannabis cybersecurity rules, DCP incident deadlines, tracking-system controls, breach notification, CTDPA, and the records operators should keep.',
  keywords: [
    'Connecticut cannabis cybersecurity requirements',
    'Connecticut cannabis compliance',
    'DCP cannabis cyber incident reporting',
    'dispensary cybersecurity Connecticut',
    'CTDPA cannabis',
    'cannabis cybersecurity checklist',
  ],
  authors: [{ name: founderName }],
  alternates: { canonical: resourcePath },
  openGraph: {
    title: 'Connecticut Cannabis Cybersecurity Requirements: 2026 Guide',
    description:
      'The deadlines, system controls, privacy rules, and proof Connecticut cannabis operators should have ready before an incident or inspection.',
    url: resourcePath,
    type: 'article',
    publishedTime: '2026-08-29',
    modifiedTime: '2026-08-29',
    authors: [founderName],
    images: [
      {
        url: '/hero-risk-map.png',
        width: 1800,
        height: 1000,
        alt: 'A map of cybersecurity evidence for Connecticut cannabis operators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connecticut Cannabis Cybersecurity Requirements: 2026 Guide',
    description:
      'A plain-English guide to DCP reporting clocks, tracking-system controls, CT breach law, and CTDPA.',
    images: ['/hero-risk-map.png'],
  },
}

const deadlines = [
  {
    clock: 'Immediately',
    action:
      'Tell DCP in writing about suspected diversion, theft, loss, or unauthorized alteration or loss of required cannabis or patient records.',
  },
  {
    clock: 'Within 24 hours',
    action:
      'Send the detailed statement after an immediate report. Tracking-system errors also carry a 24-hour correction and notification clock.',
  },
  {
    clock: 'Next business day',
    action:
      'Report a security breach, including a physical or cyber incident involving possible access to information or systems.',
  },
  {
    clock: 'End of business day',
    action:
      'Notify DCP when the state tracking system is unavailable for more than one hour during business hours.',
  },
  {
    clock: 'Within 10 days',
    action: 'Submit a written report describing the corrective measures taken after a reportable event.',
  },
  {
    clock: 'Within 60 days',
    action:
      'For a covered personal-information breach, notify affected Connecticut residents and the Attorney General within the statutory window.',
  },
]

const requirements = [
  {
    topic: 'Cyber and security events',
    who: 'Connecticut cannabis licensees',
    requirement:
      'Escalate suspected or attempted access to systems, information, security equipment, or security procedures. Keep the initial notice, investigation notes, signed statement, and corrective-action report together.',
    timing: 'Next business day for a cyber/security breach; other event clocks may be faster',
    mapping: 'NIST DE.AE, RS.MA, RS.CO; CIS 8, 17',
  },
  {
    topic: 'State tracking-system access',
    who: 'Licensees and authorized users',
    requirement:
      'Use individual accounts, give access only to the minimum number of authorized employees, maintain a current user list, and do not share credentials.',
    timing: 'Continuous',
    mapping: 'NIST PR.AA; CIS 5, 6',
  },
  {
    topic: 'Training and offboarding',
    who: 'Tracking-system users and staff with security responsibilities',
    requirement:
      'Complete at least two hours of tracking-system training before access. Remove tracking access as soon as practical and no later than 24 hours after termination, suspension, or removal of access.',
    timing: 'Before access; deprovision within 24 hours',
    mapping: 'NIST PR.AT, PR.AA; CIS 5, 6, 14',
  },
  {
    topic: 'Tracking-system outages',
    who: 'Licensees using the state system',
    requirement:
      'Protect manual records from erasure or unauthorized change, contact the vendor, record outage and restoration times, and reconcile the missing transactions after service returns.',
    timing: 'DCP by end of day if outage exceeds one hour; back-entry within 24 hours of restoration',
    mapping: 'NIST PR.DS, PR.IR, RC.RP; CIS 3, 11, 15, 17',
  },
  {
    topic: 'Records and audit trail',
    who: 'Cannabis licensees',
    requirement:
      'Keep business records current and auditable. Be ready to produce electronic copies to DCP and retain the current tax year plus the three preceding tax years.',
    timing: 'Copies generally within three days',
    mapping: 'NIST GV.PO, PR.DS; CIS 3, 8',
  },
  {
    topic: 'Security systems and video',
    who: 'Licensed premises',
    requirement:
      'Protect security equipment and recordings from theft, loss, destruction, or alteration. Restrict access, keep an authorized-user list, test the equipment, and preserve exportable video.',
    timing: 'Video at least 30 days; equipment tests every six months',
    mapping: 'NIST PR.AA, PR.DS, DE.CM; CIS 3, 6, 8, 13',
  },
  {
    topic: 'Electronic patient records',
    who: 'Dispensaries using electronic patient or marijuana records',
    requirement:
      'Protect confidentiality, prevent unauthorized changes after verification, and make the records reconstructable after a malfunction or database loss.',
    timing: 'Continuous',
    mapping: 'NIST PR.AA, PR.DS, PR.IR, RC.RP; CIS 3, 6, 8, 11',
  },
  {
    topic: 'Connecticut personal information',
    who: 'Any business holding another person’s covered personal information',
    requirement:
      'Safeguard the information from misuse and make it unreadable before disposal. Businesses collecting Social Security numbers need a published privacy-protection policy.',
    timing: 'Continuous; before disposal',
    mapping: 'NIST GV.PO, PR.AA, PR.DS; CIS 3, 5, 6',
  },
  {
    topic: 'Personal-information breach',
    who: 'Businesses after a qualifying breach',
    requirement:
      'Investigate the scope, notify affected Connecticut residents and the Attorney General, and preserve the reasoning, notices, and delivery records. Some SSN or taxpayer-ID breaches require 24 months of identity-theft protection.',
    timing: 'Without unreasonable delay and no later than 60 days',
    mapping: 'NIST RS.MA, RS.AN, RS.CO, RC.CO; CIS 17',
  },
  {
    topic: 'CTDPA privacy and security',
    who: 'Covered controllers and processors',
    requirement:
      'Minimize data, secure it with reasonable safeguards, obtain consent for sensitive-data processing, publish the required notice, honor consumer rights, assess high-risk processing, and use proper processor contracts.',
    timing: 'Continuous; consumer requests generally within 45 days',
    mapping: 'NIST GV.RM, GV.SC, ID.AM, ID.RA, PR.DS; CIS 1, 3, 7, 15',
  },
]

const evidence = [
  'An incident-response plan with separate decision paths for DCP, the Connecticut Attorney General, law enforcement, the insurer, customers, and vendors.',
  'A one-page reporting-clock sheet that the manager on duty can use without hunting through a policy manual.',
  'Current tracking-system, facility-access, and security-system user lists, plus completed termination checklists.',
  'Training records showing what each role learned and when access was approved.',
  'A tracking-system outage procedure, manual transaction form, vendor tickets, restoration log, and post-outage reconciliation.',
  'A data inventory covering IDs, patient and caregiver data, employees, payments, video, delivery records, loyalty tools, biometrics, and vendor copies.',
  'A retention and secure-destruction schedule, backed by disposal records.',
  'Backup inventories and restore-test results—not just a screenshot that says backups are enabled.',
  'Six-month security-equipment test logs, alert tests, authorized-user lists, and a documented video-export process.',
  'Vendor due diligence, contracts with fast incident-notification terms, and proof that critical vendors are reviewed again each year.',
]

const sources = [
  {
    label: 'DCP cannabis policies and procedures',
    url: 'https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures?language=en_US',
  },
  {
    label: 'Full DCP cannabis policies and procedures',
    url: 'https://eregulations.ct.gov/eRegsPortal/Search/getDocument?guid=%7BF09D9491-0000-CE11-B774-AC15149B470F%7D',
  },
  {
    label: 'Connecticut medical-marijuana regulations',
    url: 'https://eregulations.ct.gov/eRegsPortal/Browse/RCSA/Title_21aSubtitle_21a-408_HTML/',
  },
  {
    label: 'Connecticut breach law, including §36a-701b',
    url: 'https://www.cga.ct.gov/current/pub/chap_669.htm',
  },
  {
    label: 'Connecticut Attorney General breach-reporting guidance',
    url: 'https://portal.ct.gov/ag/sections/privacy/reporting-a-data-breach',
  },
  {
    label: 'Connecticut Data Privacy Act',
    url: 'https://www.cga.ct.gov/2026/sup/chap_743jj.htm',
  },
  {
    label: 'Connecticut Attorney General CTDPA guidance',
    url: 'https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act',
  },
  {
    label: 'Connecticut cybersecurity safe harbor, §42-901',
    url: 'https://cga.ct.gov/current/pub/chap_747.htm',
  },
  {
    label: 'NIST Cybersecurity Framework 2.0',
    url: 'https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20',
  },
  {
    label: 'CIS Critical Security Controls v8.1',
    url: 'https://www.cisecurity.org/controls/v8-1',
  },
]

const faqs = [
  {
    question: 'Do Connecticut cannabis operators have a cyber-incident reporting rule?',
    answer:
      'Yes. DCP policies treat certain physical and cyber security incidents as reportable events. A qualifying security breach must be reported no later than the next business day, while related record-loss or alteration events can carry immediate and 24-hour requirements.',
  },
  {
    question: 'Does every Connecticut cannabis business fall under the CTDPA?',
    answer:
      'No. Applicability depends on the business, the data it processes, and statutory thresholds or categories. The July 1, 2026 expansion deserves attention because processing sensitive data outside payment-only transactions can bring a business into scope.',
  },
  {
    question: 'Does handling medical-cannabis data automatically make a dispensary subject to HIPAA?',
    answer:
      'No. HIPAA status depends on whether the business is a covered entity or business associate under federal law. Connecticut medical-cannabis record rules can still apply even when HIPAA does not.',
  },
  {
    question: 'Are NIST CSF or CIS Controls mandatory for a Connecticut cannabis license?',
    answer:
      'Not as universal certification requirements. They are useful ways to organize the controls and evidence Connecticut rules do require, and alignment with a recognized framework may help a qualifying business use Connecticut’s cybersecurity safe harbor.',
  },
]

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${resourceUrl}#article`,
  headline: 'Connecticut Cannabis Cybersecurity Requirements: 2026 Operator Guide',
  description:
    'A practical guide to Connecticut cannabis cyber requirements, reporting deadlines, privacy law, and audit evidence.',
  url: resourceUrl,
  datePublished: '2026-08-29',
  dateModified: '2026-08-29',
  image: absoluteUrl('/hero-risk-map.png'),
  author: { '@type': 'Person', name: founderName },
  publisher: { '@id': absoluteUrl('/#organization') },
  about: [
    'Connecticut cannabis cybersecurity',
    'Cannabis compliance',
    'Data breach notification',
    'Connecticut Data Privacy Act',
  ],
  citation: sources.map((source) => source.url),
  inLanguage: 'en-US',
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${resourceUrl}#breadcrumbs`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Resources',
      item: absoluteUrl('/#resources'),
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Connecticut cannabis cybersecurity requirements',
      item: resourceUrl,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${resourceUrl}#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function ConnecticutCannabisCybersecurityRequirementsPage() {
  return (
    <>
      <JsonLd
        id="ct-cannabis-cyber-requirements-jsonld"
        data={[pageJsonLd, breadcrumbJsonLd, faqJsonLd]}
      />

      <article>
        <header className="section-shell pb-12 pt-32 sm:pt-40 lg:pb-16">
          <Link
            href="/#resources"
            className="focus-ring inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
          >
            ← Resources
          </Link>
          <p className="section-label mt-10">CONNECTICUT OPERATOR GUIDE</p>
          <h1 className="max-w-5xl font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl lg:text-7xl">
            Connecticut cannabis cybersecurity requirements, without the legal fog.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-brand-primary/90 sm:text-xl">
            A breach on Friday afternoon does not give a licensed operator a leisurely
            week to sort things out. Connecticut&apos;s cannabis rules can start the clock
            immediately—and a cyber incident may need to reach DCP by the next business
            day.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand-secondary">
            <span>By {founderName}</span>
            <time dateTime="2026-08-29">Updated August 29, 2026</time>
            <span>12-minute guide</span>
          </div>
        </header>

        <div className="container">
          <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
            <Image
              src="/hero-risk-map.png"
              alt="A map connecting vendor risk, a written security program, incident response, audit evidence, MFA proof, and an insurance packet"
              width={1800}
              height={1000}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="aspect-[9/5] w-full object-cover"
            />
          </div>
        </div>

        <section className="section-shell pb-12 lg:pb-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="section-label">THE SHORT VERSION</p>
              <h2 className="font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                This is an operations issue, not a binder-on-a-shelf issue.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-brand-primary/90 sm:text-lg">
              <p>
                Connecticut expects cannabis licensees to control access to the state
                tracking system, train users, handle outages without losing the audit
                trail, protect security recordings, and report certain incidents fast.
              </p>
              <p>
                The cannabis rules sit on top of Connecticut&apos;s broader privacy and
                breach laws. Since July 1, 2026, the CTDPA also reaches more businesses
                that process sensitive data. ID scans, patient information, biometrics,
                loyalty profiles, and delivery records all deserve a closer look.
              </p>
              <p className="rounded-lg border border-brand-accent/40 bg-brand-surface p-5 text-sm text-brand-secondary">
                This guide translates the requirements into operating tasks. It is not
                legal advice, and it does not replace a license-specific review with
                Connecticut counsel or DCP.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <p className="section-label">REPORTING CLOCKS</p>
            <h2 className="section-heading">The deadlines worth putting on one page.</h2>
            <p className="support-copy mt-5 max-w-3xl">
              During an incident, nobody should be searching through a 100-page policy
              PDF to figure out who needs a call.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.clock}
                  className="rounded-lg border border-brand-border bg-brand-background p-6"
                >
                  <p className="text-lg font-semibold text-brand-accent">
                    {deadline.clock}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
                    {deadline.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <p className="section-label">REQUIREMENT MATRIX</p>
          <h2 className="section-heading">What applies, who owns it, and what proves it.</h2>
          <p className="support-copy mt-5 max-w-3xl">
            The framework references are crosswalks, not extra laws. They show where the
            work belongs in a NIST CSF 2.0 or CIS Controls program.
          </p>

          <div className="mt-10 overflow-x-auto rounded-lg border border-brand-border">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <thead className="bg-brand-surface">
                <tr>
                  <th className="p-4 font-semibold text-brand-primary">Area</th>
                  <th className="p-4 font-semibold text-brand-primary">Who it reaches</th>
                  <th className="p-4 font-semibold text-brand-primary">What to do and keep</th>
                  <th className="p-4 font-semibold text-brand-primary">Clock</th>
                  <th className="p-4 font-semibold text-brand-primary">Framework map</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((item) => (
                  <tr key={item.topic} className="border-t border-brand-border align-top">
                    <th className="p-4 font-semibold text-brand-accent">{item.topic}</th>
                    <td className="p-4 leading-relaxed text-brand-secondary">{item.who}</td>
                    <td className="p-4 leading-relaxed text-brand-primary/90">
                      {item.requirement}
                    </td>
                    <td className="p-4 leading-relaxed text-brand-secondary">{item.timing}</td>
                    <td className="p-4 leading-relaxed text-brand-secondary">{item.mapping}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="section-label">EVIDENCE CHECKLIST</p>
                <h2 className="font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                  Keep proof that survives a stressful week.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-brand-secondary">
                  A policy says what should happen. Evidence shows what actually happened.
                  Operators need both.
                </p>
              </div>
              <ul className="grid gap-4">
                {evidence.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 rounded-lg border border-brand-border bg-brand-background p-5 text-sm leading-relaxed text-brand-primary/90"
                  >
                    <span aria-hidden="true" className="mt-0.5 text-brand-accent">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6 sm:p-8">
              <p className="section-label">REQUIRED OR CONDITIONAL</p>
              <h2 className="font-serif text-3xl font-semibold text-brand-primary">
                Do not blur the categories.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-secondary">
                <p>
                  DCP incident reporting, tracking-system controls, records, security
                  systems, and the applicable medical-record safeguards are cannabis
                  requirements.
                </p>
                <p>
                  Connecticut breach law applies when its event and data definitions are
                  met. CTDPA, HIPAA, and PCI DSS depend on the business, data, and role.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6 sm:p-8">
              <p className="section-label">STRONG PRACTICE</p>
              <h2 className="font-serif text-3xl font-semibold text-brand-primary">
                Useful controls are not fake legal citations.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-brand-secondary">
                MFA, managed endpoint protection, patching, network segmentation,
                centralized logging, penetration testing, and immutable backups are a
                sound baseline. The cited cannabis rules do not name every one of them
                word for word. Use them to meet the outcome and reduce risk—do not claim
                they are verbatim DCP mandates when they are not.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <p className="section-label">COMMON QUESTIONS</p>
            <h2 className="section-heading">The questions operators ask first.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-brand-border bg-brand-background p-6">
                  <h3 className="text-lg font-semibold leading-snug text-brand-primary">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-8 rounded-xl border border-brand-accent/40 bg-brand-surface p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-label">PUT IT TO WORK</p>
              <h2 className="max-w-3xl font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                Turn the matrix into an incident plan and evidence file your team can use.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-secondary">
                CannaShield can map the requirements to your systems, vendors, license
                type, and current controls—then help close the gaps without burying the
                team in paperwork.
              </p>
            </div>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-background transition-colors hover:bg-brand-accent-hover"
            >
              Review your CT readiness →
            </Link>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="mx-auto max-w-4xl rounded-lg border border-brand-border bg-brand-surface p-6 sm:p-8">
            <p className="section-label">PRIMARY SOURCES</p>
            <p className="text-sm leading-relaxed text-brand-secondary">
              Last reviewed August 29, 2026. Recheck after regulatory changes and before
              relying on a deadline in a live incident.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    rel="noopener noreferrer"
                    className="focus-ring rounded-sm text-sm font-semibold leading-relaxed text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
                  >
                    {source.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </>
  )
}
