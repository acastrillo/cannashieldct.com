import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { getBlogPosts } from '@/lib/blog'
import { freeTools, pillars } from '@/lib/constants'
import { absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Site Map',
  description:
    'Every page on the CannaShield site — company pages, services, free security tools, resources, and the full blog archive.',
  alternates: { canonical: '/site-map' },
  openGraph: {
    title: 'Site Map | CannaShield',
    description:
      'Every page on the CannaShield site — company pages, services, free security tools, resources, and the full blog archive.',
    url: '/site-map',
    images: ['/og-image.png'],
  },
}

export default function SiteMapPage() {
  const posts = getBlogPosts()

  const sections = [
    {
      title: 'Company',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Partner Program', href: '/partners' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: pillars.map((pillar) => ({
        label: pillar.title,
        href: pillar.href,
      })),
    },
    {
      title: 'Free Tools',
      links: freeTools.map((tool) => ({
        label: tool.title,
        href: tool.href,
      })),
    },
    {
      title: 'Resources',
      links: [
        {
          label: 'Connecticut Cannabis Cybersecurity Requirements',
          href: '/resources/connecticut-cannabis-cybersecurity-requirements',
        },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ]

  const siteMapJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/site-map')}#webpage`,
    url: absoluteUrl('/site-map'),
    name: 'CannaShield Site Map',
    description:
      'Every page on the CannaShield site — company pages, services, free security tools, resources, and the full blog archive.',
    about: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-US',
  }

  return (
    <>
      <JsonLd id="site-map-jsonld" data={siteMapJsonLd} />
      <section className="section-shell pt-32 sm:pt-40">
        <p className="section-label">SITE MAP</p>
        <h1 className="section-heading">Every page on CannaShield.</h1>
        <p className="support-copy mt-6 max-w-2xl">
          A full index of the site, including every published blog post.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-brand-border bg-brand-surface p-6"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring rounded-sm text-sm text-brand-secondary transition-colors hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-brand-border bg-brand-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Blog ({posts.length})
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={post.url}
                  className="focus-ring rounded-sm text-sm text-brand-secondary transition-colors hover:text-brand-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
