import type { MetadataRoute } from 'next'

const siteUrl = 'https://cannashieldct.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/blogadmin/', '/blog/template.html'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/blogadmin/', '/blog/template.html'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
