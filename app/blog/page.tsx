import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { formatBlogDate, getBlogPosts } from '@/lib/blog'
import { absoluteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Cannabis Cybersecurity Blog',
  description:
    'Cannabis cyber intel, breach analysis, compliance notes, and operator-ready security guidance from CannaShield.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Cannabis Cybersecurity Blog | CannaShield',
    description:
      'Cannabis cyber intel, breach analysis, compliance notes, and operator-ready security guidance from CannaShield.',
    url: '/blog',
  },
}

export default function BlogPage() {
  const posts = getBlogPosts()
  const [featuredPost, ...archivePosts] = posts
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absoluteUrl('/blog')}#blog`,
    url: absoluteUrl('/blog'),
    name: 'CannaShield Cannabis Cybersecurity Blog',
    description:
      'Cannabis cyber intel, breach analysis, compliance notes, and operator-ready security guidance.',
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-US',
    blogPost: posts.slice(0, 25).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: post.canonicalUrl,
      datePublished: post.publishedDate,
      image: absoluteUrl(post.image),
    })),
  }
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/blog')}#articles`,
    name: 'CannaShield cannabis cybersecurity article archive',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: post.canonicalUrl,
      name: post.title,
    })),
  }

  return (
    <>
      <JsonLd id="blog-jsonld" data={[blogJsonLd, itemListJsonLd]} />
      <section className="section-shell pt-32 sm:pt-40">
        <p className="section-label">RESOURCES</p>
        <h1 className="section-heading">Cannabis cyber intel, decoded.</h1>
        <p className="support-copy mt-6 max-w-2xl">
          Breach analysis, compliance watch notes, and security guidance for
          cannabis operators who need plain-English risk signals before a cyber
          event turns into downtime, insurance trouble, or license exposure.
        </p>

        {featuredPost ? (
          <article className="mt-12 grid overflow-hidden rounded-lg border border-brand-border bg-brand-surface lg:grid-cols-[0.92fr_1.08fr]">
            <Link
              href={featuredPost.url}
              className="focus-ring relative block min-h-72 bg-brand-background"
              aria-label={`Read ${featuredPost.title}`}
            >
              <Image
                src={featuredPost.image}
                alt={featuredPost.imageAlt}
                width={1200}
                height={800}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Latest / {featuredPost.category}
              </p>
              <h2 className="mt-5 font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
                <Link
                  href={featuredPost.url}
                  className="focus-ring rounded-sm transition-colors hover:text-brand-accent"
                >
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm font-semibold text-brand-secondary">
                {formatBlogDate(featuredPost.publishedDate)} / {featuredPost.readTime}
              </p>
              <p className="mt-5 text-base leading-relaxed text-brand-secondary">
                {featuredPost.description}
              </p>
              <Link
                href={featuredPost.url}
                className="focus-ring mt-7 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
              >
                Read latest briefing →
              </Link>
            </div>
          </article>
        ) : null}

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archivePosts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col rounded-lg border border-brand-border bg-brand-surface p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                {post.category}
              </p>
              <h2 className="mt-5 text-xl font-semibold leading-snug text-brand-primary">
                <Link
                  href={post.url}
                  className="focus-ring rounded-sm transition-colors hover:text-brand-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm font-semibold text-brand-secondary">
                {formatBlogDate(post.publishedDate)} / {post.readTime}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-secondary">
                {post.description}
              </p>
              <Link
                href={post.url}
                className="focus-ring mt-7 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
              >
                Read briefing →
              </Link>
            </article>
          ))}
        </div>
        <Link
          href="/#resources"
          className="focus-ring mt-10 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
        >
          Subscribe to the Cannabis Cyber Brief →
        </Link>
      </section>
    </>
  )
}
