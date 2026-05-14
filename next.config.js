const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

module.exports = createMDX({})(nextConfig)
