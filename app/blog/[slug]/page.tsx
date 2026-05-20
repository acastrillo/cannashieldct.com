import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import {
  blogPostJsonLd,
  formatBlogDate,
  getBlogPost,
  getBlogPosts,
} from '@/lib/blog'
import { absoluteUrl } from '@/lib/seo'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: 'Cannabis Cybersecurity Article',
      alternates: { canonical: '/blog' },
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.url,
    },
    openGraph: {
      title: `${post.title} | CannaShield`,
      description: post.description,
      url: post.url,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      images: [{ url: post.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const relatedPosts = getBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3)
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${post.canonicalUrl}#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: absoluteUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: post.canonicalUrl,
      },
    ],
  }

  return (
    <>
      <JsonLd id="blog-post-jsonld" data={[blogPostJsonLd(post), breadcrumbJsonLd]} />
      <article className="section-shell max-w-5xl pt-32 sm:pt-40">
        <Link
          href="/blog"
          className="focus-ring inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
        >
          ← Back to blog
        </Link>

        <header className="mt-10">
          <p className="section-label">{post.category}</p>
          <h1 className="max-w-4xl font-serif text-[40px] font-semibold leading-headline text-brand-primary sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            {post.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-secondary">
            <time dateTime={post.publishedDate}>
              {formatBlogDate(post.publishedDate)}
            </time>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        <div
          className="blog-article-content mx-auto mt-12 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mx-auto mt-14 max-w-3xl rounded-lg border border-brand-border bg-brand-surface p-6">
          <h2 className="text-2xl font-semibold text-brand-primary">
            Make the risk concrete.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-secondary">
            Start with the free CannaShield Email Security Scorecard to see
            whether your domain can be spoofed and whether DMARC, SPF, and DKIM
            are giving attackers room to impersonate your cannabis business.
          </p>
          <Link
            href="/cyber-check"
            className="focus-ring mt-6 inline-flex rounded-sm text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
          >
            Run the free scorecard →
          </Link>
        </div>
      </article>

      <section className="section-shell pt-0">
        <div className="mx-auto max-w-5xl">
          <p className="section-label">MORE INTEL</p>
          <h2 className="max-w-3xl font-serif text-3xl font-semibold leading-headline text-brand-primary sm:text-4xl">
            Keep sharpening the cannabis security picture.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.slug}
                className="rounded-lg border border-brand-border bg-brand-surface p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                  {relatedPost.category}
                </p>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-brand-primary">
                  <Link
                    href={relatedPost.url}
                    className="focus-ring rounded-sm transition-colors hover:text-brand-accent"
                  >
                    {relatedPost.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
                  {relatedPost.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
