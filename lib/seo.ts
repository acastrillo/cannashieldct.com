import { calendlyUrl, pillars, servicePages, skus } from '@/lib/constants'
import type { ServiceSlug } from '@/lib/types'

export const siteUrl = 'https://cannashieldct.com'
export const publicContactEmail = 'Alejo@cannashieldct.com'
export const publicPhone = '+1-203-443-1473'
export const founderName = 'Alex Castrillo'

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': absoluteUrl('/#organization'),
  name: 'CannaShield',
  alternateName: 'CannaShield CT',
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon.png'),
  image: absoluteUrl('/og-image.png'),
  email: publicContactEmail,
  telephone: publicPhone,
  founder: {
    '@type': 'Person',
    name: founderName,
    jobTitle: 'Founder and cybersecurity consultant',
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'CT',
    addressCountry: 'US',
  },
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Connecticut' }],
  sameAs: [
    'https://linkedin.com/company/cannashieldct',
    'https://instagram.com/cannashieldct',
  ],
  knowsAbout: [
    'cannabis cybersecurity',
    'dispensary cybersecurity',
    'cannabis GRC',
    'virtual CISO',
    'cyber insurance readiness',
    'DMARC',
    'SPF',
    'DKIM',
    'business email compromise',
    'ransomware resilience',
    'NIST CSF 2.0',
    'written information security programs',
  ],
  serviceType: [
    'Cannabis cybersecurity',
    'Virtual CISO',
    'GRC and compliance support',
    'Cyber insurance readiness',
    'Incident response retainer',
    'Email security scorecard',
  ],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  url: absoluteUrl('/'),
  name: 'CannaShield',
  alternateName: 'CannaShield CT',
  publisher: { '@id': absoluteUrl('/#organization') },
  inLanguage: 'en-US',
}

export const homeFaqs = [
  {
    question: 'What does CannaShield do?',
    answer:
      'CannaShield provides cannabis-specific cybersecurity, virtual CISO, GRC, cyber insurance readiness, incident response, ransomware resilience, and email security support.',
  },
  {
    question: 'Who does CannaShield serve?',
    answer:
      'CannaShield serves licensed Connecticut cannabis dispensaries, cultivators, processors, manufacturers, MSOs, and ancillary operators.',
  },
  {
    question: 'Does CannaShield replace an MSP?',
    answer:
      'No. CannaShield works alongside MSPs by owning the cyber risk, compliance evidence, vendor risk, incident response, and board/regulator-facing security program work that many MSPs do not cover.',
  },
  {
    question: 'What is the free Email Security Scorecard?',
    answer:
      'The Email Security Scorecard checks DMARC, SPF, DKIM, MX, and domain spoofing signals so cannabis operators can see whether attackers can impersonate their business domain.',
  },
]

export function faqJsonLd(id: string, faqs: typeof homeFaqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${id}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function homePageJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': absoluteUrl('/#webpage'),
      url: absoluteUrl('/'),
      name: 'Connecticut Cannabis Cybersecurity & Compliance | CannaShield',
      description:
        'Connecticut cannabis cybersecurity, virtual CISO, GRC, cyber insurance readiness, incident response, and email security support for licensed operators.',
      isPartOf: { '@id': absoluteUrl('/#website') },
      about: { '@id': absoluteUrl('/#organization') },
      primaryImageOfPage: absoluteUrl('/og-image.png'),
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': absoluteUrl('/#services'),
      name: 'CannaShield cannabis cybersecurity services',
      itemListElement: pillars.map((pillar, index) => ({
        '@type': 'Service',
        position: index + 1,
        name: pillar.title,
        description: pillar.solution,
        url: absoluteUrl(pillar.href),
        provider: { '@id': absoluteUrl('/#organization') },
      })),
    },
    faqJsonLd(absoluteUrl('/'), homeFaqs),
  ]
}

export function serviceJsonLd(slug: ServiceSlug) {
  const page = servicePages[slug]
  const pageSkus = skus.filter((sku) => page.skus.includes(sku.code))
  const url = absoluteUrl(`/services/${slug}`)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
      name: `${page.label} for cannabis operators`,
      description: page.pain,
      provider: { '@id': absoluteUrl('/#organization') },
      url,
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Connecticut' }],
      audience: {
        '@type': 'BusinessAudience',
        name: page.operatorTypes.join(', '),
      },
      serviceType: page.label,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${page.label} service catalog`,
        itemListElement: pageSkus.map((sku) => ({
          '@type': 'Offer',
          name: sku.name,
          description: sku.trigger,
          category: sku.code,
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'USD',
            description: sku.price,
          },
          availability: 'https://schema.org/InStock',
        })),
      },
    },
    faqJsonLd(url, page.faqs),
  ]
}

export function serviceBreadcrumbJsonLd(slug: ServiceSlug) {
  const page = servicePages[slug]
  const url = absoluteUrl(`/services/${slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Services', item: absoluteUrl('/#service-catalog') },
      { '@type': 'ListItem', position: 3, name: page.label, item: url },
    ],
  }
}

export function scorecardJsonLd() {
  const url = absoluteUrl('/cyber-check')
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#scorecard`,
      name: 'CannaShield Email Security Scorecard',
      url,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      provider: { '@id': absoluteUrl('/#organization') },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'DMARC check',
        'SPF check',
        'DKIM signal review',
        'MX review',
        'Domain spoofing risk summary',
      ],
      audience: {
        '@type': 'BusinessAudience',
        name: 'Cannabis businesses',
      },
    },
    faqJsonLd(url, [
      {
        question: 'What does the Email Security Scorecard check?',
        answer:
          'It checks DMARC, SPF, DKIM, MX, and domain spoofing signals for a business domain.',
      },
      {
        question: 'Is the scorecard free?',
        answer:
          'Yes. CannaShield provides the email security scorecard as a free initial check for business domains.',
      },
    ]),
  ]
}

export function attackSurfaceJsonLd() {
  const url = absoluteUrl('/cyber-check/attack-surface')
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#attack-surface`,
      name: 'CannaShield Attack Surface Snapshot',
      url,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      provider: { '@id': absoluteUrl('/#organization') },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Open ports and exposed services (Shodan InternetDB)',
        'Exposed subdomains (certificate transparency logs)',
        'Known breach history (public breach directory)',
        'Email spoofing exposure (SPF, DMARC, DKIM, MX)',
        'HTTP security headers audit',
        'Scored risk report with prioritized recommendations',
      ],
      audience: {
        '@type': 'BusinessAudience',
        name: 'Cannabis businesses',
      },
    },
    faqJsonLd(url, [
      {
        question: 'What does the Attack Surface Snapshot check?',
        answer:
          'It runs passive recon across five public data sources: open ports and services (Shodan InternetDB), exposed subdomains (certificate transparency logs), known breach history (the public breach directory), email spoofing exposure (SPF, DMARC, DKIM, MX), and HTTP security headers — returning a 0–100 risk score with prioritized recommendations.',
      },
      {
        question: 'Is the Attack Surface Snapshot free?',
        answer:
          'Yes. CannaShield provides the Attack Surface Snapshot as a free, fully passive check for cannabis business domains using only publicly-available data.',
      },
    ]),
  ]
}

export function complianceCheckJsonLd() {
  const url = absoluteUrl('/compliance-check')
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#compliance-check`,
      name: 'CannaShield Cannabis Compliance Quick-Check',
      url,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      provider: { '@id': absoluteUrl('/#organization') },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Connecticut cannabis security-readiness scoring',
        'Connecticut-focused control gap analysis',
        'Per-control pass/gap badges',
        'Weighted readiness score',
        'Connecticut legal-context notes',
      ],
      audience: {
        '@type': 'BusinessAudience',
        name: 'Licensed cannabis operators',
      },
    },
    faqJsonLd(url, [
      {
        question: 'What does the Cannabis Compliance Quick-Check assess?',
        answer:
          'It reviews eight security controls—MFA on email, MFA on POS, endpoint protection, a written security program, vendor risk, incident response, training, and tested encrypted backups—through a Connecticut-focused readiness lens. It is not a legal determination.',
      },
      {
        question: 'Is the Cannabis Compliance Quick-Check free?',
        answer:
          'Yes. CannaShield provides the Compliance Quick-Check as a free initial gap analysis for cannabis operators. It is not a legal assessment and does not replace qualified counsel.',
      },
    ]),
  ]
}
