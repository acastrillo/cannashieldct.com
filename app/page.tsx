import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { AnswerEngineSummary } from '@/components/home/AnswerEngineSummary'
import { BreachWall } from '@/components/home/BreachWall'
import { FinalCTA } from '@/components/home/FinalCTA'
import { FounderAuthority } from '@/components/home/FounderAuthority'
import { FreeTools } from '@/components/home/FreeTools'
import { HomeFAQ } from '@/components/home/HomeFAQ'
import { Hero } from '@/components/home/Hero'
import { IndustriesStrip } from '@/components/home/IndustriesStrip'
import { PartnerChannels } from '@/components/home/PartnerChannels'
import { ResourceTeaser } from '@/components/home/ResourceTeaser'
import { ServiceCatalogPreview } from '@/components/home/ServiceCatalogPreview'
import { ThreePillars } from '@/components/home/ThreePillars'
import { getBlogPosts } from '@/lib/blog'
import { homePageJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const latestPosts = getBlogPosts()
    .slice(0, 3)
    .map((post) => ({
      tag: post.category,
      title: post.title,
      excerpt: post.description,
      href: post.url,
    }))

  return (
    <>
      <JsonLd id="homepage-jsonld" data={homePageJsonLd()} />
      <Hero />
      <AnswerEngineSummary />
      <ThreePillars />
      <BreachWall />
      <FreeTools />
      <ServiceCatalogPreview />
      <FounderAuthority />
      <PartnerChannels />
      <IndustriesStrip />
      <ResourceTeaser posts={latestPosts} />
      <HomeFAQ />
      <FinalCTA />
    </>
  )
}
