const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.cannashieldct.com' }],
        destination: 'https://cannashieldct.com/:path*',
        permanent: true,
      },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/blog_from_s3.html', destination: '/blog', permanent: true },
      { source: '/solutions.html', destination: '/#service-catalog', permanent: true },
      { source: '/pricing.html', destination: '/#service-catalog', permanent: true },
      { source: '/resources.html', destination: '/blog', permanent: true },
      { source: '/about.html', destination: '/#why-cannashield', permanent: true },
      { source: '/contact.html', destination: '/', permanent: true },
      {
        source: '/free-cannashieldct-cybersec-assessment.html',
        destination: '/cyber-check',
        permanent: true,
      },
      { source: '/cyber-check/index.html', destination: '/cyber-check', permanent: true },
      { source: '/automations.html', destination: '/#service-catalog', permanent: true },
      { source: '/blog/template.html', destination: '/blog', permanent: true },
      { source: '/blog/:slug.html', destination: '/blog/:slug', permanent: true },
    ]
  },
}

module.exports = createMDX({})(nextConfig)
