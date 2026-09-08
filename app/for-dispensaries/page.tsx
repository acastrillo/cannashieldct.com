import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl } from '@/lib/seo'

const pagePath = '/for-dispensaries'
const pageUrl = absoluteUrl(pagePath)

const dcpSourceUrl =
  'https://portal.ct.gov/cannabis/knowledge-base/articles/summary-of-updates-to-policies-and-procedures-sept-2024'

const pageTitle = 'What Cybersecurity Risks Do Dispensaries Face?'
const pageDescription =
  "Six recurring cyber exposure points for licensed CT dispensaries — POS, customer data, seed-to-sale software, and Connecticut's reporting rule. See what to fix first."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'dispensary cybersecurity',
    'cannabis dispensary cyber risk',
    'Connecticut dispensary security',
    'cannabis POS security',
    'seed-to-sale security',
    'dispensary vCISO',
  ],
  alternates: { canonical: pagePath },
  openGraph: {
    title: `${pageTitle} | CannaShield`,
    description: pageDescription,
    url: pagePath,
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${pageTitle} | CannaShield`,
    description: pageDescription,
    images: ['/og-image.png'],
  },
}

type RiskArea = {
  id: string
  number: string
  title: string
  intro: string
  breaks: string
  owner: string
  evidence: string
  anchor?: {
    label: string
    body: string[]
  }
}

const riskAreas: RiskArea[] = [
  {
    id: 'pos-and-payments',
    number: '01',
    title: 'POS and payment systems',
    intro:
      'Your point-of-sale system is also your payment system, your customer log, and — for a lot of stores — your only real-time record of what happened on the floor tonight.',
    breaks:
      'A cashless-ATM outage stalls checkout during your busiest hours. A compromised terminal exposes card data. A shared “manager” login means nobody can say who actually processed a transaction.',
    owner:
      'Usually split three ways — your MSP manages the network, your payment processor handles the transaction layer, and nobody owns the gap between them.',
    evidence:
      'Who has terminal access and why, what your cashless-ATM vendor agreement actually commits them to after an incident, and how fast you’d know if something looked wrong.',
    anchor: {
      label: 'On the record',
      body: [
        'STIIIZY’s 2024 breach is the clearest example of why this matters. It didn’t start inside STIIIZY’s own systems — a point-of-sale vendor was compromised, and the incident affected 380,000 people.',
        'The lesson isn’t “watch your firewall.” It’s that a vendor holding your POS or payment data is part of your security program whether you manage its systems or not.',
      ],
    },
  },
  {
    id: 'customer-and-patient-data',
    number: '02',
    title: 'Customer and patient data',
    intro:
      'Loyalty programs, ID scans at the door, medical-patient records — dispensaries collect more identity-verifying data per transaction than almost any other retail category, and most of it sits in systems nobody outside IT has ever opened.',
    breaks:
      'A loyalty database or membership platform gets exposed through a misconfigured server or an unauthenticated URL — not a sophisticated hack, just a setting nobody checked.',
    owner:
      'Whoever set up the platform, which is often a vendor your team never audited after go-live.',
    evidence:
      'How long you retain scanned ID data, who can access it, and whether your vendor’s storage configuration has ever actually been reviewed — not just assumed to be fine.',
    anchor: {
      label: 'On the record',
      body: [
        'A cannabis membership platform’s 2026 breach put this on the record: roughly 1.08 million member records, including passport and national-ID numbers and ID photos, sat exposed through unauthenticated public URLs.',
        'That is a configuration failure, not a sophisticated attack — which is precisely why it’s worth checking your own vendor’s setup rather than assuming it.',
      ],
    },
  },
  {
    id: 'seed-to-sale',
    number: '03',
    title: 'Seed-to-sale platform risk',
    intro:
      'METRC or BioTrack integrations are how the state watches your inventory in real time. They’re also an API connection, a set of credentials, and a vendor relationship most stores never think about until it breaks.',
    breaks:
      'An expired API key or a vendor-side outage stops your seed-to-sale sync — which isn’t just an inconvenience, it’s a compliance-tracking gap the moment it happens.',
    owner:
      'Frequently unclear. Compliance staff know the reporting requirement; IT or the MSP holds the credentials; nobody has mapped who does what when the integration goes down at 4pm on a Friday.',
    evidence:
      'Who holds API keys and how often they rotate, what your fallback process is during an outage, and who is authorized to re-establish the connection.',
  },
  {
    id: 'email-and-identity',
    number: '04',
    title: 'Email and identity',
    intro:
      'Vendor payments, license renewals, and payroll all move through email — which makes email the highest-value target in the building, even though it rarely gets treated that way.',
    breaks:
      'A forged payment email routes a wire transfer to the wrong account. A shared counter login means a phished credential reaches further than it should.',
    owner:
      'Usually IT, but MFA coverage gaps and payment-verification steps are governance decisions, not just technical settings.',
    evidence:
      'MFA enforcement across every account that touches payments or patient data, and a documented verification step before any wire or ACH goes out.',
    anchor: {
      label: 'On the record',
      body: [
        'MariMed’s 2023 incident is the anchor here: a forged loan-payment email moved $646,000 to a fraudulent account before anyone caught it. The FBI got involved; MariMed filed a cyber-insurance claim.',
        'Three years on, it’s still the clearest illustration of what a single unverified email can cost.',
      ],
    },
  },
  {
    id: 'vendor-and-remote-access',
    number: '05',
    title: 'Vendor and remote-access sprawl',
    intro:
      'Every POS provider, camera system, loyalty platform, and IT contractor with remote access to your network is a door into the store. Most operators can’t list all of them without checking.',
    breaks:
      'A vendor’s own platform gets misconfigured or breached, and the exposure lands on you — even though you never touched the system yourself.',
    owner:
      'Whoever signed the vendor contract, which is rarely the same person tracking that vendor’s security posture afterward.',
    evidence:
      'A current list of every vendor with network or data access, who owns each relationship, and what you’d ask them the day after their name showed up in a breach notice.',
    anchor: {
      label: 'On the record',
      body: [
        'A cannabis-adjacent digital-signage platform’s August 2026 disclosure is a live example: a misconfigured cloud storage bucket exposed dispensary data the vendor held — not the dispensary’s own systems.',
        'That’s the sprawl problem in one incident.',
      ],
    },
  },
  {
    id: 'reporting-obligation',
    number: '06',
    title: 'The reporting obligation',
    intro:
      'A cyber event at a Connecticut dispensary isn’t only an IT problem the moment it happens — it’s a compliance question, too.',
    breaks:
      'The first instinct after an incident is “get us back online.” That’s necessary, but it isn’t the whole job.',
    owner: 'Often nobody, until the moment it’s needed — which is the worst time to figure it out.',
    evidence:
      'Who owns the incident decision, what gets escalated immediately, current regulator and insurer contacts, and a simple timeline of what happened and when.',
  },
]

const faqs = [
  {
    question: 'Do cannabis dispensaries need a CISO?',
    answer:
      'Most single-site and growing multi-site dispensaries don’t need a full-time CISO — but they do need someone accountable for the security program: what controls exist, where the evidence lives, and who owns each vendor’s risk. A fractional or vCISO arrangement fills that role without the full-time cost, working alongside your existing MSP rather than replacing it.',
    schemaAnswer:
      'Most single-site and growing multi-site dispensaries don’t need a full-time CISO — but they do need someone accountable for the security program: what controls exist, where the evidence lives, and who owns each vendor’s risk. A fractional or vCISO arrangement fills that role without the full-time cost, working alongside your existing MSP rather than replacing it.',
    link: null,
  },
  {
    question: 'What cybersecurity requirements apply to Connecticut dispensaries?',
    answer:
      'Connecticut’s Department of Consumer Protection lists cyber events, security breaches, and information breaches among the events licensed cannabis operators must report. Beyond the reporting duty, operators are expected to maintain reasonable safeguards around POS, seed-to-sale, and customer data systems — see our Connecticut compliance guide for the current detail.',
    schemaAnswer:
      'Connecticut’s Department of Consumer Protection lists cyber events, security breaches, and information breaches among the events licensed cannabis operators must report. Beyond the reporting duty, operators are expected to maintain reasonable safeguards around POS, seed-to-sale, and customer data systems.',
    link: {
      href: '/resources/connecticut-cannabis-cybersecurity-requirements',
      label: 'Connecticut cannabis cybersecurity requirements →',
    },
  },
  {
    question:
      'How long should a dispensary keep scanned ID data, and who should be able to access it?',
    answer:
      'There’s no single Connecticut-mandated retention period published for ID-scan data at the point of sale, so the safer approach is operator-defined: set a documented retention window, restrict access to roles that need it, and be able to produce that policy on request. If you can’t currently answer who has access, that’s the gap to close first.',
    schemaAnswer:
      'There is no single Connecticut-mandated retention period published for ID-scan data at the point of sale, so the safer approach is operator-defined: set a documented retention window, restrict access to roles that need it, and be able to produce that policy on request.',
    link: null,
  },
  {
    question: 'What happens if a dispensary’s POS or software vendor gets breached?',
    answer:
      'The exposure lands on you even though the vendor’s systems failed, not yours. STIIIZY’s 2024 breach notified 380,000 people after a point-of-sale vendor was compromised. The fix isn’t avoiding vendors — it’s knowing what data each one holds, how fast they’re contractually required to notify you, and what evidence they’ll hand over afterward.',
    schemaAnswer:
      'The exposure lands on the dispensary even though the vendor’s systems failed, not theirs. STIIIZY’s 2024 breach notified 380,000 people after a point-of-sale vendor was compromised. The fix is knowing what data each vendor holds, how fast they must notify you, and what evidence they hand over afterward.',
    link: null,
  },
  {
    question: 'Does a cyber incident have to be reported to Connecticut’s DCP?',
    answer:
      'Cyber events, security breaches, and information breaches are explicitly listed among Connecticut’s reportable events for licensed cannabis establishments. Whether a specific incident triggers that duty depends on its scope and impact, so this isn’t legal advice — but treating “was this reportable?” as a first-day question, not an afterthought, is the safer default.',
    schemaAnswer:
      'Cyber events, security breaches, and information breaches are explicitly listed among Connecticut’s reportable events for licensed cannabis establishments. Whether a specific incident triggers that duty depends on its scope and impact, so this is not legal advice, but treating “was this reportable” as a first-day question is the safer default.',
    link: null,
  },
  {
    question: 'What’s the difference between what an MSP covers and what CannaShield covers?',
    answer:
      'Your MSP owns infrastructure, support, and uptime — keeping systems running and issues contained technically. CannaShield owns the layer above that: control mapping, evidence, vendor-risk ownership, and the business decisions leadership needs to make when something breaks. The two roles work together; a good MSP relationship makes this layer easier to build, not harder.',
    schemaAnswer:
      'The MSP owns infrastructure, support, and uptime. CannaShield owns the layer above that: control mapping, evidence, vendor-risk ownership, and the business decisions leadership needs to make when something breaks. The two roles work together.',
    link: null,
  },
]

const webPageJsonLd = {
  '@type': 'WebPage',
  '@id': `${pageUrl}#webpage`,
  url: pageUrl,
  name: `${pageTitle} | CannaShield`,
  description: pageDescription,
  isPartOf: { '@id': absoluteUrl('/#website') },
  inLanguage: 'en-US',
}

const breadcrumbJsonLd = {
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl}#breadcrumbs`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'For Dispensaries', item: pageUrl },
  ],
}

const serviceJsonLd = {
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  serviceType: 'Cannabis vCISO and GRC Services',
  provider: {
    '@type': 'Organization',
    name: 'CannaShield',
    url: absoluteUrl('/'),
  },
  areaServed: 'Connecticut',
  audience: {
    '@type': 'Audience',
    audienceType: 'Licensed cannabis dispensaries',
  },
  description:
    'vCISO and GRC services for Connecticut cannabis dispensaries addressing POS security, customer and patient data protection, seed-to-sale platform risk, and state reporting obligations.',
}

const faqJsonLd = {
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.schemaAnswer },
  })),
}

const graphJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [webPageJsonLd, breadcrumbJsonLd, serviceJsonLd, faqJsonLd],
}

const primaryCtaClass =
  'focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-background transition-colors hover:bg-brand-accent-hover'

const secondaryCtaClass =
  'focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-brand-accent/50 px-6 py-3 text-sm font-semibold text-brand-accent transition-colors hover:border-brand-accent hover:text-brand-accent-hover'

function RiskDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-brand-secondary">{children}</p>
    </div>
  )
}

export default function ForDispensariesPage() {
  return (
    <>
      <JsonLd id="for-dispensaries-jsonld" data={graphJsonLd} />

      <article>
        <header className="section-shell pb-10 pt-32 sm:pt-40">
          <p className="section-label">AUDIENCE</p>
          <h1 className="max-w-4xl font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl lg:text-7xl">
            For Dispensaries
          </h1>

          <div className="mt-10 max-w-3xl rounded-xl border border-brand-accent/40 bg-brand-surface p-7 sm:p-9">
            <h2 className="font-serif text-2xl font-semibold leading-headline text-brand-primary sm:text-3xl">
              What cybersecurity risks do cannabis dispensaries face?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-primary/90 sm:text-lg">
              Dispensaries carry six recurring exposure points: point-of-sale and payment
              systems, customer and patient data, seed-to-sale software integrations,
              email and identity, vendor and remote-access sprawl, and a state reporting
              duty that treats cyber events as a compliance matter, not just an IT one.
              Connecticut&apos;s Department of Consumer Protection lists cyber events,
              security breaches, and information breaches among the events licensed
              operators must report. Your MSP keeps the systems running. Someone still has
              to own the evidence, the vendor risk, and the call on what happened when one
              of these breaks.
            </p>
          </div>

          <div className="mt-8 grid gap-5 rounded-lg border border-brand-border bg-brand-surface/60 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-2xl text-base leading-relaxed text-brand-secondary">
              Not sure where you stand? Start with the Cannabis Cyber Starter Assessment —
              a written exposure snapshot and a prioritized next step, not a
              certification.
            </p>
            <Link href="/cyber-check" className={primaryCtaClass}>
              Cannabis Cyber Starter Assessment · $750 →
            </Link>
          </div>
        </header>

        <section className="section-shell pt-4">
          <p className="section-label">THE SIX EXPOSURE POINTS</p>
          <h2 className="section-heading">Where dispensary risk actually sits.</h2>
          <p className="support-copy mt-5 max-w-3xl">
            Each one below follows the same shape: what breaks, who owns it today, and
            what the evidence trail should show if a regulator, an insurer, or your own
            leadership asks.
          </p>

          <div className="mt-12 grid gap-6">
            {riskAreas.map((area) => (
              <div
                key={area.id}
                id={area.id}
                className="rounded-xl border border-brand-border bg-brand-surface p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-serif text-2xl font-semibold text-brand-accent">
                    {area.number}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold leading-headline text-brand-primary sm:text-3xl">
                    {area.title}
                  </h3>
                </div>

                <p className="mt-5 max-w-3xl text-base leading-relaxed text-brand-primary/90">
                  {area.intro}
                </p>

                <div className="mt-7 grid gap-6 md:grid-cols-3">
                  <RiskDetail label="What breaks">{area.breaks}</RiskDetail>
                  <RiskDetail label="Who owns it today">{area.owner}</RiskDetail>
                  <RiskDetail label="What the evidence trail should show">
                    {area.evidence}
                  </RiskDetail>
                </div>

                {area.anchor ? (
                  <div className="mt-7 rounded-lg border-l-2 border-brand-accent bg-brand-background p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                      {area.anchor.label}
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-primary/90">
                      {area.anchor.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {area.id === 'email-and-identity' ? (
                  <div className="mt-7 grid gap-5 rounded-lg border border-brand-accent/40 bg-brand-background p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <p className="max-w-2xl text-sm leading-relaxed text-brand-secondary">
                      If payment verification and MFA gaps are the open question, the
                      BEC/Phishing Defense Sprint closes that loop — email, identity, and
                      payment-verification controls in one scoped engagement.
                    </p>
                    <Link href="/services/downtime-prevention" className={primaryCtaClass}>
                      BEC/Phishing Defense Sprint · $3,000 →
                    </Link>
                  </div>
                ) : null}

                {area.id === 'reporting-obligation' ? (
                  <div className="mt-7 rounded-lg border-l-2 border-brand-accent bg-brand-background p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                      Primary source
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-primary/90">
                      Connecticut&apos;s Department of Consumer Protection expressly
                      includes cyber events, security breaches, and information breaches
                      among the events licensed operators must report.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-primary/90">
                      Backups restore your systems. They don&apos;t decide what happened,
                      document the response, or tell you what the state expects next —
                      that&apos;s a separate, ownable job.
                    </p>
                    <a
                      href={dcpSourceUrl}
                      rel="noopener noreferrer"
                      className="focus-ring mt-4 inline-flex rounded-sm text-sm font-semibold text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
                    >
                      CT DCP — Summary of updates to policies and procedures ↗
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="section-label">THE OWNERSHIP GAP</p>
                <h2 className="font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                  This isn&apos;t about replacing your MSP.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-brand-primary/90 sm:text-lg">
                <p>
                  None of this means replacing your MSP. Your MSP keeps the systems
                  running — that&apos;s its job, and it&apos;s a real one.
                </p>
                <p>
                  What most dispensaries are missing isn&apos;t more IT. It&apos;s one
                  accountable owner for the program: the controls, the evidence, the
                  vendor risk, and the decision-making when something breaks.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-5 rounded-xl border border-brand-accent/40 bg-brand-background p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="max-w-2xl text-base leading-relaxed text-brand-primary/90">
                The GRC Foundations Retainer is that ownership layer — an ongoing program,
                a roadmap, and evidence you can hand to a regulator, an insurer, or your
                own leadership without scrambling to assemble it after the fact.
              </p>
              <Link href="/services/license-protection" className={primaryCtaClass}>
                GRC Foundations Retainer · $1,800/mo →
              </Link>
            </div>

            <div className="mt-5 grid gap-5 rounded-lg border border-brand-border bg-brand-background p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="max-w-2xl text-sm leading-relaxed text-brand-secondary">
                Not ready for an ongoing retainer? The Cannabis Cyber Starter Assessment
                ($750) is the lower-friction way to see where you actually stand first.
              </p>
              <Link href="/cyber-check" className={secondaryCtaClass}>
                Start with the assessment →
              </Link>
            </div>

            <div className="mt-5 rounded-lg border border-brand-border bg-brand-background p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-brand-secondary">
                Want to see the full catalog, or talk through which of these fits your
                store first?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/services" className={secondaryCtaClass}>
                  Service catalog →
                </Link>
                <Link href="/contact" className={secondaryCtaClass}>
                  Talk it through →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <p className="section-label">COMMON QUESTIONS</p>
          <h2 className="section-heading">What dispensary operators ask first.</h2>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-brand-border bg-brand-surface p-6"
              >
                <h3 className="text-lg font-semibold leading-snug text-brand-primary">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
                  {faq.answer}
                </p>
                {faq.link ? (
                  <Link
                    href={faq.link.href}
                    className="focus-ring mt-4 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
                  >
                    {faq.link.label}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-brand-secondary">
            This page is practical cybersecurity and GRC guidance for licensed operators.
            It is not legal advice, and it does not replace a license-specific review with
            Connecticut counsel or DCP.
          </p>
        </section>
      </article>
    </>
  )
}
