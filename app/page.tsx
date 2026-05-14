import { BreachWall } from '@/components/home/BreachWall'
import { FinalCTA } from '@/components/home/FinalCTA'
import { FounderAuthority } from '@/components/home/FounderAuthority'
import { FreeTools } from '@/components/home/FreeTools'
import { Hero } from '@/components/home/Hero'
import { IndustriesStrip } from '@/components/home/IndustriesStrip'
import { PartnerChannels } from '@/components/home/PartnerChannels'
import { ResourceTeaser } from '@/components/home/ResourceTeaser'
import { ServiceCatalogPreview } from '@/components/home/ServiceCatalogPreview'
import { ThreePillars } from '@/components/home/ThreePillars'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ThreePillars />
      <BreachWall />
      <FreeTools />
      <ServiceCatalogPreview />
      <FounderAuthority />
      <PartnerChannels />
      <IndustriesStrip />
      <ResourceTeaser />
      <FinalCTA />
    </>
  )
}
