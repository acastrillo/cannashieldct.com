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
      {
        source: '/resources.html',
        destination: '/resources/connecticut-cannabis-cybersecurity-requirements',
        permanent: true,
      },
      { source: '/about.html', destination: '/#why-cannashield', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      {
        source: '/free-cannashieldct-cybersec-assessment.html',
        destination: '/cyber-check',
        permanent: true,
      },
      { source: '/cyber-check/index.html', destination: '/cyber-check', permanent: true },
      { source: '/automations.html', destination: '/#service-catalog', permanent: true },
      { source: '/blog/template.html', destination: '/blog', permanent: true },
      {
        source: '/blog/when-the-guards-are-silenced-the-reynolds-ransomware-threat',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/the-wolf-in-sheeps-clothing-attack-reynolds-ransomware',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/the-wolf-in-sheep-s-clothing-when-ransomware-disables-your-guards',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/the-wolf-in-sheep-s-clothing-when-ransomware-turns-off-your-alarm',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/trojan-horse-tactics-how-reynolds-ransomware-uses-trusted-files-to-lock-down-can',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/when-the-call-comes-from-inside-the-house-the-reynolds-ransomware-threat',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/when-the-guard-dog-gets-muzzled-the-reynolds-ransomware-threat',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/the-silent-assassin-when-ransomware-kills-your-defenses-first-20260211140208',
        destination: '/blog/reynolds-ransomware-when-the-attackers-use-your-own-keys',
        permanent: true,
      },
      {
        source: '/blog/the-invisible-risk-in-your-marketing-department-why-adobe-s-update-mat-20260212032949',
        destination: '/blog/the-hidden-vector-when-your-marketing-team-becomes-a-security-risk-20260212031800',
        permanent: true,
      },
      {
        source: '/blog/the-invisible-backdoor-why-your-marketing-team-is-the-new-attack-vecto-20260212031802',
        destination: '/blog/the-hidden-vector-when-your-marketing-team-becomes-a-security-risk-20260212031800',
        permanent: true,
      },
      {
        source: '/blog/the-trojan-horse-in-your-marketing-department-20260212020357',
        destination: '/blog/the-hidden-vector-when-your-marketing-team-becomes-a-security-risk-20260212031800',
        permanent: true,
      },
      {
        source: '/blog/the-fix-that-breaks-your-business-the-matryoshka-clickfix-threat-20260219235527',
        destination: '/blog/the-clickfix-trap-when-a-quick-fix-kills-your-compliance-20260219181527',
        permanent: true,
      },
      {
        source: '/blog/the-illusion-of-safety-why-your-mfa-isnt-bulletproof-20260305170755',
        destination: '/blog/your-mfa-can-be-bypassed-here-is-the-starkiller-defense-strategy-20260304141154',
        permanent: true,
      },
      {
        source: '/blog/the-supply-chain-doesn-t-end-at-your-loading-dock-it-stretches-into-ev-20260331132754',
        destination: '/blog/the-trojan-horse-in-your-tech-stack-why-supply-chain-security-matters-20260218170851',
        permanent: true,
      },
      { source: '/blog/:slug.html', destination: '/blog/:slug', permanent: true },
    ]
  },
}

module.exports = createMDX({})(nextConfig)
