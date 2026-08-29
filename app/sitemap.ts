import type { MetadataRoute } from 'next'

import { getBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/seo'

const routes = [
  { path: '/', priority: 1 },
  { path: '/cyber-check', priority: 0.95 },
  { path: '/cyber-check/attack-surface', priority: 0.9 },
  { path: '/compliance-check', priority: 0.9 },
  { path: '/services/license-protection', priority: 0.9 },
  { path: '/services/insurance-qualification', priority: 0.85 },
  { path: '/services/downtime-prevention', priority: 0.85 },
  { path: '/partners', priority: 0.75 },
  { path: '/contact', priority: 0.7 },
  { path: '/blog', priority: 0.75 },
  {
    path: '/resources/connecticut-cannabis-cybersecurity-requirements',
    priority: 0.9,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date('2026-08-29'),
    changeFrequency: route.path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: route.priority,
  }))

  const blogRoutes = getBlogPosts().map((post) => ({
    url: post.canonicalUrl,
    lastModified: new Date(post.modifiedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [...coreRoutes, ...blogRoutes]
}
