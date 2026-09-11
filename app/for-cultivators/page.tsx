import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl } from '@/lib/seo'

const pagePath = '/for-cultivators'
const pageUrl = absoluteUrl(pagePath)

const dcpSourceUrl =
  'https://portal.ct.gov/cannabis/knowledge-base/articles/summary-of-updates-to-policies-and-procedures-sept-2024'

const pageTitle = 'What Cybersecurity Risks Do Cannabis Cultivators Face?'
const pageDescription =
  'Six recurring cyber exposure points for licensed CT cultivators — environmental-system vendor risk, crop-cycle continuity, seed-to-sale dependency, and vendor payment fraud.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'cannabis cultivator cybersecurity',
    'grow facility cyber risk',
    'Connecticut cultivation license security',
    'canopy operational continuity',
    'cannabis vendor risk',
    'cultivator vCISO',
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
  furtherReading?: {
    href: string
    label: string
  }
}

const riskAreas: RiskArea[] = [
  {
    id: 'environmental-system-vendor-risk',
    number: '01',
    title: 'Environmental and facility-system vendor risk',
    intro:
      'Climate control, irrigation, and camera platforms at a grow facility are almost never systems your team built — they belong to a vendor who holds remote access to keep them running. That access is part of your security program whether you manage it or not.',
    breaks:
      'A vendor\'s remote-management portal is compromised, and whoever holds that credential can reach the same climate, irrigation, or camera systems your team relies on every day.',
    owner:
      'Usually whichever vendor sold the system, with no one on your side tracking who else can reach it or when access was last reviewed.',
    evidence:
      'A current list of every vendor with remote access to an environmental or facility system, who owns that relationship, and what you would ask them the day after their name showed up in a breach notice.',
    anchor: {
      label: 'On the record',
      body: [
        "STIIIZY's 2024 breach is the clearest illustration of this pattern, even though it started at a point-of-sale vendor rather than an environmental one: a vendor was compromised, and the incident affected 380,000 people.",
        'The lesson carries over directly — a vendor holding remote access to any system in your building is part of your security program whether you manage its systems or not.',
      ],
    },
    furtherReading: {
      href: '/blog/the-invisible-open-door-why-your-smart-grow-is-your-biggest-liability-20260223184330',
      label: "Further reading: why your smart grow can be your biggest liability →",
    },
  },
  {
    id: 'crop-cycle-continuity',
    number: '02',
    title: 'Crop-cycle operational continuity',
    intro:
      'A dispensary can usually work around a short outage. A cultivator running a live crop cycle has less room — climate control, irrigation, or seed-to-sale tracking going dark for even a few days creates a different kind of exposure.',
    breaks:
      'Climate control, the irrigation controller, or seed-to-sale tracking becomes unavailable for 72 hours, and there is no written manual fallback — just whoever happens to be on shift improvising.',
    owner:
      'Often nobody in writing. Cultivation staff know the manual workaround exists in someone\'s head; it is rarely documented as a procedure the whole team can follow.',
    evidence:
      'A written continuity procedure for each system a crop cycle depends on, when it was last tested, and who is authorized to invoke the manual fallback.',
  },
  {
    id: 'seed-to-sale-dependency',
    number: '03',
    title: 'Seed-to-sale platform dependency',
    intro:
      'METRC or BioTrack integrations are how the state tracks your plants in real time. They are also an API connection, a set of credentials, and a vendor relationship most cultivation teams never revisit after go-live.',
    breaks:
      'An expired API key or a vendor-side outage breaks the seed-to-sale sync — which is not just an inconvenience, it is a compliance-tracking gap the moment it happens.',
    owner:
      'Frequently unclear. Compliance staff know the reporting requirement; whoever set up the integration holds the credentials; nobody has mapped who does what when the connection drops.',
    evidence:
      'Who holds the API keys and how often they rotate, what the fallback process is during an outage, and who is authorized to re-establish the connection.',
    furtherReading: {
      href: '/blog/the-supply-chain-doesn-t-end-at-your-loading-dock-it-stretches-into-ev-20260331132754',
      label: 'Further reading: the supply chain behind your seed-to-sale stack →',
    },
  },
  {
    id: 'vendor-payment-fraud',
    number: '04',
    title: 'Equipment and nutrient vendor payment fraud',
    intro:
      'Lighting, HVAC, nutrient, and equipment vendors get paid by wire or ACH on a recurring basis — which makes every one of those payment threads a target for a forged invoice or a spoofed approval email.',
    breaks:
      'A forged payment email — one that looks like it came from your equipment or nutrient vendor, or from your own finance lead — routes a wire transfer to the wrong account before anyone checks.',
    owner:
      'Usually IT, but the verification step before a wire or ACH goes out is a governance decision, not just a technical setting.',
    evidence:
      'MFA enforcement across every account that touches vendor payments, and a documented verification step — a callback to a known number, not a reply to the same email thread — before funds move.',
    anchor: {
      label: 'On the record',
      body: [
        "MariMed's 2023 incident is the anchor here: a forged loan-payment email moved $646,000 to a fraudulent account before anyone caught it. The FBI got involved; MariMed filed a cyber-insurance claim.",
        'The mechanism is identical for a nutrient or equipment vendor payment — a single unverified email is what it costs.',
      ],
    },
  },
  {
    id: 'access-control-and-evidence',
    number: '05',
    title: 'Access control and evidence',
    intro:
      'Badge systems at the facility entrance, camera retention on the canopy floor, and remote network access for staff and contractors all generate a paper trail — if anyone is keeping it.',
    breaks:
      'A regulator or insurer asks who could reach the facility network remotely last month, and the honest answer is that nobody has checked.',
    owner:
      'Whoever administers the badge and camera systems, which is rarely the person accountable for producing that record on request.',
    evidence:
      'A current access list tied to your cultivation license, camera retention settings, and a record of who reviewed remote-access permissions and when.',
  },
  {
    id: 'reporting-obligation',
    number: '06',
    title: 'The reporting obligation',
    intro:
      'A cyber event at a cultivation facility is not only an operations problem the moment it happens — it is a compliance question, too.',
    breaks:
      'The first instinct after an incident is "get the environmental systems back online." That is necessary, but it is not the whole job.',
    owner: 'Often nobody, until the moment it is needed — which is the worst time to figure it out.',
    evidence:
      'Who owns the incident decision, what gets escalated immediately, current regulator and insurer contacts, and a simple timeline of what happened and when.',
  },
]

const faqs = [
  {
    question: 'Do cannabis cultivators need a CISO?',
    answer:
      'Most cultivation operations do not need a full-time CISO — but they do need someone accountable for the security program: which vendors hold access to facility systems, where the evidence lives, and who owns each gap. A fractional or vCISO arrangement fills that role without the full-time cost, working alongside your existing MSP rather than replacing it.',
    schemaAnswer:
      'Most cultivation operations do not need a full-time CISO — but they do need someone accountable for the security program: which vendors hold access to facility systems, where the evidence lives, and who owns each gap. A fractional or vCISO arrangement fills that role without the full-time cost, working alongside your existing MSP rather than replacing it.',
    link: null,
  },
  {
    question: 'Are climate control and irrigation systems a cybersecurity risk?',
    answer:
      'They are a vendor-risk exposure more than a technical one. Most cultivators do not manage these systems directly — a vendor does, with remote access to keep them running. The exposure is not the equipment itself; it is not knowing who else can reach it, how the vendor secures its own remote-access platform, or what happens to your crop cycle if that access is misused.',
    schemaAnswer:
      'Climate control and irrigation systems are a vendor-risk exposure more than a technical one — most cultivators do not manage these systems directly, a vendor does. The exposure is not knowing who else can reach the vendor\'s remote-access platform or what happens to a crop cycle if that access is misused.',
    link: null,
  },
  {
    question:
      "What happens to a crop cycle if seed-to-sale tracking or climate control goes down?",
    answer:
      'That depends entirely on whether a manual fallback exists and is written down. Without one, a 72-hour outage can create both an operational problem and a compliance-tracking gap. A documented continuity procedure — tested before it is needed, not during the outage — is what separates a manageable interruption from a scramble.',
    schemaAnswer:
      'Whether a crop-cycle outage is manageable depends on whether a manual fallback exists and is written down. Without one, a 72-hour outage can create both an operational problem and a compliance-tracking gap.',
    link: {
      href: '/services/downtime-prevention',
      label: 'Ransomware Resilience Audit →',
    },
  },
  {
    question: "What if a nutrient or equipment vendor's payment email is compromised?",
    answer:
      'The exposure lands on your business even though the vendor\'s email account failed, not yours. MariMed lost $646,000 to a forged loan-payment email in 2023. The fix is not avoiding vendor payments — it is enforcing MFA on every account that touches payments and requiring a callback verification, not a reply to the same email thread, before a wire or ACH moves.',
    schemaAnswer:
      'A compromised vendor payment email creates exposure for the cultivator even though the vendor\'s account failed. MariMed lost $646,000 to a forged loan-payment email in 2023. The fix is MFA on payment-touching accounts and callback verification before a wire or ACH moves.',
    link: {
      href: '/services/downtime-prevention',
      label: 'BEC/Phishing Defense Sprint →',
    },
  },
  {
    question: "Does a cyber incident at a cultivation facility have to be reported to Connecticut's DCP?",
    answer:
      "Cyber events, security breaches, and information breaches are explicitly listed among Connecticut's reportable events for licensed cannabis establishments, cultivators included. Whether a specific incident triggers that duty depends on its scope and impact, so this is not legal advice — but treating \"was this reportable?\" as a first-day question, not an afterthought, is the safer default.",
    schemaAnswer:
      "Cyber events, security breaches, and information breaches are explicitly listed among Connecticut's reportable events for licensed cannabis establishments, cultivators included. Whether a specific incident triggers that duty depends on its scope and impact, so this is not legal advice.",
    link: {
      href: '/resources/connecticut-cannabis-cybersecurity-requirements',
      label: 'Connecticut cannabis cybersecurity requirements →',
    },
  },
  {
    question: "What's the difference between what an MSP covers and what CannaShield covers?",
    answer:
      'Your MSP owns infrastructure, support, and uptime — keeping systems running and issues contained technically. CannaShield owns the layer above that: vendor-risk ownership for the facility systems you depend on, control mapping, evidence, and the business decisions leadership needs to make when something breaks. The two roles work together.',
    schemaAnswer:
      'The MSP owns infrastructure, support, and uptime. CannaShield owns the layer above that: vendor-risk ownership, control mapping, evidence, and the business decisions leadership needs to make when something breaks. The two roles work together.',
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
    { '@type': 'ListItem', position: 2, name: 'For Cultivators', item: pageUrl },
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
    audienceType: 'Licensed cannabis cultivators',
  },
  description:
    'vCISO and GRC services for Connecticut cannabis cultivators addressing environmental-system vendor risk, crop-cycle operational continuity, seed-to-sale platform dependency, vendor payment fraud, and state reporting obligations.',
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

export default function ForCultivatorsPage() {
  return (
    <>
      <JsonLd id="for-cultivators-jsonld" data={graphJsonLd} />

      <article>
        <header className="section-shell pb-10 pt-32 sm:pt-40">
          <p className="section-label">AUDIENCE</p>
          <h1 className="max-w-4xl font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl lg:text-7xl">
            For Cultivators
          </h1>

          <div className="mt-10 max-w-3xl rounded-xl border border-brand-accent/40 bg-brand-surface p-7 sm:p-9">
            <h2 className="font-serif text-2xl font-semibold leading-headline text-brand-primary sm:text-3xl">
              What cybersecurity risks do cannabis cultivators face?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-primary/90 sm:text-lg">
              Cultivators carry six recurring exposure points: vendor risk in the
              climate-control, irrigation, and camera systems that keep a canopy
              running; operational continuity when one of those systems — or
              seed-to-sale tracking — goes down mid crop-cycle; seed-to-sale
              platform dependency on METRC or BioTrack; payment fraud against
              equipment and nutrient vendors; access control and evidence for
              badge and camera systems; and a state reporting duty that treats
              cyber events as a compliance matter, not just an operations one.
              None of this is an argument for treating grow-facility technology as
              a specialized OT security problem — it is vendor risk and
              continuity planning applied to the systems a cultivation license
              depends on.
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
          <h2 className="section-heading">Where cultivator risk actually sits.</h2>
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

                {area.furtherReading ? (
                  <Link
                    href={area.furtherReading.href}
                    className="focus-ring mt-6 inline-flex rounded-sm text-sm font-semibold text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-accent-hover"
                  >
                    {area.furtherReading.label}
                  </Link>
                ) : null}

                {area.id === 'crop-cycle-continuity' ? (
                  <div className="mt-7 grid gap-5 rounded-lg border border-brand-accent/40 bg-brand-background p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <p className="max-w-2xl text-sm leading-relaxed text-brand-secondary">
                      If recovery and continuity planning is the open question, the
                      Ransomware Resilience Audit reviews backups, recovery, and
                      critical-vendor continuity for the systems your crop cycle
                      depends on.
                    </p>
                    <Link href="/services/downtime-prevention" className={primaryCtaClass}>
                      Ransomware Resilience Audit · $4,000 →
                    </Link>
                  </div>
                ) : null}

                {area.id === 'vendor-payment-fraud' ? (
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
                  This isn&apos;t about replacing your MSP — or building an OT security program.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-brand-primary/90 sm:text-lg">
                <p>
                  None of this means replacing your MSP, and it doesn&apos;t mean
                  standing up an industrial-control-systems security program. Your
                  MSP keeps the systems running — that&apos;s its job, and it&apos;s
                  a real one.
                </p>
                <p>
                  What most cultivators are missing isn&apos;t more technology.
                  It&apos;s one accountable owner for the program: the vendor
                  relationships behind facility systems, the evidence, and the
                  decision-making when something breaks mid crop-cycle.
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
                cultivation license first?
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
          <h2 className="section-heading">What cultivators ask first.</h2>

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
