import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { calendlyUrl } from '@/lib/constants'
import { absoluteUrl, founderName } from '@/lib/seo'

const pagePath = '/about'
const pageUrl = absoluteUrl(pagePath)
const pageTitle = 'About CannaShield — Alex Castrillo, Cannabis vCISO in Connecticut'
const pageDescription =
  'CannaShield is run by Alex Castrillo, a working cyber incident response analyst who builds security programs, control evidence, and incident readiness for licensed Connecticut cannabis operators.'

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: pagePath },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pagePath,
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
  },
}

const certifications = [
  { name: 'SSCP', detail: 'ISC2 Systems Security Certified Practitioner' },
  {
    name: 'Tines Expert Builder',
    detail: 'security automation and response workflow design',
  },
  { name: 'AWS Security Specialty', detail: 'in progress' },
]

const practiceAreas = [
  {
    name: 'SIEM and detection engineering',
    detail: 'writing, tuning, and triaging the rules that decide what gets escalated',
  },
  {
    name: 'Vulnerability management',
    detail: 'finding, prioritizing, and tracking exposure to closure rather than to a report',
  },
  {
    name: 'Incident response',
    detail: 'live investigation, evidence handling, and the reporting decision that follows',
  },
  {
    name: 'Cloud security',
    detail: 'posture, identity, and workload exposure in AWS environments',
  },
  {
    name: 'NIST CSF 2.0 program design',
    detail: 'the framework behind every program CannaShield builds and maps evidence to',
  },
]

const boundaries = [
  {
    lead: "I wasn't inside the STIIIZY breach.",
    rest: 'I read the attorney general notices, the same as anyone can. What I bring is knowing how to read them.',
  },
  {
    lead: "I can't guarantee your license, your coverage, or your premium.",
    rest: 'Nobody can. What I can build is the evidence that makes those conversations go better.',
  },
  {
    lead: "I'm not your lawyer, your broker, or your regulator.",
    rest: "When a question belongs to one of them, I'll say so and help you frame it.",
  },
  {
    lead: "I'm not replacing your MSP.",
    rest: 'They own systems, uptime, and support. I own the program, the evidence, and the decisions.',
  },
  {
    lead: 'No framework is required to hold a cannabis license in Connecticut.',
    rest: 'Anyone telling you NIST or SOC 2 is mandated for licensure is selling you something. The obligations that do exist are narrower, and worth knowing exactly.',
  },
]

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    '@id': absoluteUrl('/about#alex-castrillo'),
    name: founderName,
    givenName: 'Alex',
    familyName: 'Castrillo',
    jobTitle: 'Founder and Virtual Chief Information Security Officer',
    description:
      'Working cyber incident response analyst and founder of CannaShield, building security programs, control evidence, and incident readiness for licensed Connecticut cannabis operators.',
    url: pageUrl,
    worksFor: {
      '@type': 'Organization',
      '@id': absoluteUrl('/#organization'),
      name: 'CannaShield',
      url: absoluteUrl('/'),
    },
    knowsAbout: [
      'Cannabis cybersecurity',
      'Governance, risk, and compliance',
      'Incident response',
      'Security information and event management',
      'Detection engineering',
      'Vulnerability management',
      'Cloud security',
      'NIST Cybersecurity Framework 2.0',
      'Vendor risk management',
      'Cyber insurance readiness',
      'Connecticut cannabis regulation',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'Systems Security Certified Practitioner (SSCP)',
        recognizedBy: { '@type': 'Organization', name: 'ISC2' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'Tines Expert Builder',
        recognizedBy: { '@type': 'Organization', name: 'Tines' },
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'CT',
      addressCountry: 'US',
    },
    sameAs: ['https://www.linkedin.com/in/acastrillo87'],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl}#breadcrumbs`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name: 'About', item: pageUrl },
  ],
}

export default function AboutPage() {
  return (
    <>
      <JsonLd id="about-jsonld" data={[profileJsonLd, breadcrumbJsonLd]} />

      <article>
        <header className="section-shell pb-12 pt-32 sm:pt-40 lg:pb-16">
          <p className="section-label">ABOUT</p>
          <h1 className="max-w-4xl font-serif text-[42px] font-semibold leading-headline text-brand-primary sm:text-6xl lg:text-7xl">
            Who&apos;s actually doing the work
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-brand-primary/90 sm:text-xl">
            CannaShield is a practice, not a rebranded IT shop. One person&apos;s
            name is on it, and that&apos;s deliberate: the work is judgment work.
            Deciding what a finding means for your license, your renewal, and
            your Tuesday morning isn&apos;t something you can put in a ticket
            queue.
          </p>
        </header>

        <section className="section-shell pt-0">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
              Alex Castrillo, Founder
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
              <p>
                I do incident response for a living. In-house, for a national
                identity and security company in New York City, on a team
                that gets the alert before anyone outside the building knows
                there was one. Since 2023 that&apos;s been the job: figure
                out what happened, find out what evidence exists, decide who
                needs to be told, and do it while the clock is running.
              </p>
              <p>
                Then I come home to Connecticut, where the operators I work
                with have the same exposure and almost none of the same
                resources.
              </p>
              <p>
                That gap is the whole reason CannaShield exists. Nearly every
                licensed operator in this state has an MSP, and most of them
                are fine at what they&apos;re hired to do. What&apos;s
                missing is someone who owns the layer above it — what
                controls are expected, which ones are actually running,
                where the proof lives, which vendor owns each gap, and what
                leadership can truthfully say to DCP, an underwriter, or
                counsel when they ask.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <h2 className="section-heading">Credentials</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  Certifications
                </p>
                <ul className="mt-5 space-y-4">
                  {certifications.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-lg border border-brand-border bg-brand-background p-5 text-sm leading-relaxed text-brand-primary/90 sm:text-base"
                    >
                      <span className="font-semibold text-brand-primary">
                        {item.name}
                      </span>{' '}
                      — {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  Practice areas
                </p>
                <ul className="mt-5 space-y-4">
                  {practiceAreas.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-lg border border-brand-border bg-brand-background p-5 text-sm leading-relaxed text-brand-primary/90 sm:text-base"
                    >
                      <span className="font-semibold text-brand-primary">
                        {item.name}
                      </span>{' '}
                      — {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-brand-secondary">
              Working practitioner since 2023. That&apos;s why CannaShield
              findings name the control and the system rather than stopping
              at &quot;improve your security posture.&quot;
            </p>
          </div>
        </section>

        <section className="section-shell">
          <h2 className="section-heading">What I don&apos;t claim</h2>
          <p className="support-copy mt-5 max-w-3xl">
            This section exists because the cannabis security market is full
            of people who will tell you anything. Here&apos;s the boundary:
          </p>
          <ul className="mt-8 grid gap-4">
            {boundaries.map((item) => (
              <li
                key={item.lead}
                className="rounded-lg border border-brand-border bg-brand-surface p-5 text-sm leading-relaxed text-brand-primary/90 sm:text-base"
              >
                <span className="font-semibold text-brand-primary">
                  {item.lead}
                </span>{' '}
                {item.rest}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-brand-border bg-brand-surface/40">
          <div className="section-shell">
            <div className="max-w-3xl">
              <h2 className="section-heading">
                Why a practitioner instead of a firm
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
                <p>
                  Enterprise vCISO firms are real, and for a 400-person MSO
                  they may be the right call. For a single-site or growing
                  multi-site operator, they tend to arrive with a maturity
                  model, leave a document set, and bill for the meetings in
                  between.
                </p>
                <p>
                  What a working analyst brings is different. I&apos;ve
                  watched enough real incidents to know which findings
                  actually change an outcome and which ones just fill a
                  report. That shows up as shorter deliverables, fewer
                  recommendations, and a roadmap you can finish.
                </p>
                <p>It also means direct access. You get me, not a delivery pod.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="max-w-3xl">
            <h2 className="section-heading">Where CannaShield works</h2>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
              <p>
                Connecticut, primarily. The state&apos;s Department of
                Consumer Protection lists cyber events — including security
                and information breaches — among reportable events for
                licensed establishments, and CT-specific delivery is where
                the work is validated.
              </p>
              <p>
                Operators in other states can still get value from an
                assessment, but out-of-state regulatory content is
                orientation, not a legal mapping, and I&apos;ll flag where
                local counsel needs to weigh in.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="grid gap-8 rounded-xl border border-brand-accent/40 bg-brand-surface p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-3xl font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                Start somewhere small
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-secondary">
                The Cannabis Cyber Starter Assessment ($750) is a written
                exposure snapshot and a prioritized next step. Not a
                certification, not a retainer commitment — a clear picture of
                what&apos;s exposed and what to do first.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={calendlyUrl}
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-background transition-colors hover:bg-brand-accent-hover"
              >
                Book the starter assessment
              </a>
              <Link
                href="/#service-catalog"
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-brand-border px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                See all nine services
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
