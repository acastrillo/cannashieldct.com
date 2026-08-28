import fs from 'node:fs'
import path from 'node:path'

import {
  BLOG_EDITORIAL,
  renderEditorialContent,
  type EditorialSource,
} from '@/lib/blog-editorial'
import { absoluteUrl, founderName } from '@/lib/seo'

const blogDirectory = path.join(process.cwd(), 'blog')
const blogAssetPath = '/blog-assets'
const sourceDomain = 'https://cannashieldct.com'

export type BlogPost = {
  slug: string
  sourceFile: string
  legacyUrl: string
  url: string
  canonicalUrl: string
  title: string
  description: string
  image: string
  imageAlt: string
  category: string
  publishedDate: string
  modifiedDate: string
  readTime: string
  contentHtml: string
  archived: boolean
  reviewedDate?: string
  sources: EditorialSource[]
}

function decodeHtml(value: string) {
  let decoded = value

  for (let i = 0; i < 3; i += 1) {
    const next = decoded.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
      const normalized = code.toLowerCase()

      if (normalized === 'amp') return '&'
      if (normalized === 'quot') return '"'
      if (normalized === 'apos' || normalized === '#39') return "'"
      if (normalized === 'nbsp') return ' '
      if (normalized === 'ndash' || normalized === 'mdash') return '-'

      if (normalized.startsWith('#x')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16))
      }

      if (normalized.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10))
      }

      return entity
    })

    if (next === decoded) break
    decoded = next
  }

  return decoded
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractAttribute(tag: string, attribute: string) {
  const doubleQuoted = tag.match(
    new RegExp(`${escapeRegExp(attribute)}\\s*=\\s*"([^"]*)"`, 'i'),
  )

  if (doubleQuoted?.[1]) {
    return decodeHtml(doubleQuoted[1].trim())
  }

  const singleQuoted = tag.match(
    new RegExp(`${escapeRegExp(attribute)}\\s*=\\s*'([^']*)'`, 'i'),
  )

  return singleQuoted?.[1] ? decodeHtml(singleQuoted[1].trim()) : ''
}

function extractMeta(html: string, key: string) {
  const tag = html.match(
    new RegExp(
      `<meta\\s+[^>]*(?:name|property)\\s*=\\s*["']${escapeRegExp(
        key,
      )}["'][^>]*>`,
      'i',
    ),
  )?.[0]

  return tag ? extractAttribute(tag, 'content') : ''
}

function extractTagText(html: string, tagName: string) {
  const value = html.match(
    new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'),
  )?.[1]

  return value ? textFromHtml(value) : ''
}

function extractArticleSchema(html: string) {
  const script = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
  )?.[1]

  if (!script) return null

  try {
    return JSON.parse(decodeHtml(script)) as Record<string, unknown>
  } catch {
    try {
      return JSON.parse(script) as Record<string, unknown>
    } catch {
      return null
    }
  }
}

function textFromHtml(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function normalizeText(value: string) {
  return textFromHtml(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function extractElementInnerHtml(html: string, className: string) {
  const startMatch = html.match(
    new RegExp(`<div\\s+[^>]*class=["'][^"']*${escapeRegExp(className)}[^"']*["'][^>]*>`, 'i'),
  )

  if (startMatch?.index === undefined) return ''

  const openTagEnd = html.indexOf('>', startMatch.index)
  let index = openTagEnd + 1
  let depth = 1

  const divPattern = /<\/?div\b[^>]*>/gi
  divPattern.lastIndex = index

  while (depth > 0) {
    const match = divPattern.exec(html)
    if (!match) return html.slice(index)

    if (match[0].startsWith('</')) {
      depth -= 1
    } else {
      depth += 1
    }

    if (depth === 0) {
      return html.slice(index, match.index).trim()
    }
  }

  return ''
}

function preserveUsefulClass(classes: string) {
  const classList = classes.split(/\s+/)

  if (classList.includes('highlight-box')) return ' class="highlight-box"'
  if (classList.includes('lead')) return ' class="lead"'

  return ''
}

function rewriteLegacyUrls(html: string) {
  return html
    .replace(/href=["']\.\.\/blog\.html["']/gi, 'href="/blog"')
    .replace(
      /href=["']\.\.\/free-cannashieldct-cybersec-assessment\.html["']/gi,
      'href="/cyber-check"',
    )
    .replace(/\s(src|href)=["']\.\.\/([^"']+)["']/gi, (_match, attribute, target) => {
      const cleanTarget = String(target).trim()

      if (/\.(png|jpe?g|webp|gif|svg)$/i.test(cleanTarget)) {
        return ` ${attribute}="${blogAssetPath}/${cleanTarget}"`
      }

      if (cleanTarget.endsWith('.html')) {
        return ` ${attribute}="/${cleanTarget.replace(/\.html$/i, '')}"`
      }

      return ` ${attribute}="/${cleanTarget}"`
    })
}

function cleanArticleContent(html: string, title: string) {
  let content = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, '')
    .replace(/\sstyle\s*=\s*'[^']*'/gi, '')
    .replace(/\sclass\s*=\s*"([^"]*)"/gi, (_match, classes) =>
      preserveUsefulClass(String(classes)),
    )
    .replace(/\sclass\s*=\s*'([^']*)'/gi, (_match, classes) =>
      preserveUsefulClass(String(classes)),
    )

  content = content.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i, (match, attrs, heading) => {
    if (normalizeText(heading) === normalizeText(title)) return ''
    return `<h2${attrs}>${heading}</h2>`
  })

  content = content.replace(/^\s*<p\b[^>]*>([\s\S]*?)<\/p>\s*/i, (match, paragraph) => {
    const titleText = normalizeText(title)
    const paragraphText = normalizeText(paragraph)

    if (titleText && paragraphText.startsWith(`${titleText} `)) {
      return ''
    }

    return match
  })

  return rewriteLegacyUrls(content)
    .replace(/<h1\b/gi, '<h2')
    .replace(/<\/h1>/gi, '</h2>')
    .trim()
}

function assetPathFromImage(image: string) {
  if (!image) return '/og-image.png'

  try {
    const url = new URL(image)

    if (url.origin === sourceDomain) {
      return `${blogAssetPath}/${path.basename(url.pathname)}`
    }

    return image
  } catch {
    return image.startsWith('/') ? image : `${blogAssetPath}/${path.basename(image)}`
  }
}

function getCategory(html: string) {
  const articleHeader = html.match(
    /<header[^>]*class=["'][^"']*article-header[^"']*["'][^>]*>([\s\S]*?)<\/header>/i,
  )?.[1]

  return articleHeader ? extractTagText(articleHeader, 'span') : 'Threat Intel'
}

function getReadTime(html: string) {
  const meta = html.match(
    /<div[^>]*class=["'][^"']*article-meta[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  )?.[1]
  const readTime = meta?.match(/([0-9]+\s+min\s+read)/i)?.[1]

  return readTime ? readTime.toLowerCase() : '3 min read'
}

function parseBlogPost(sourceFile: string): BlogPost {
  const sourcePath = path.join(blogDirectory, sourceFile)
  const html = fs.readFileSync(sourcePath, 'utf8')
  const schema = extractArticleSchema(html)
  const slug = sourceFile.replace(/\.html$/i, '')
  const editorial = BLOG_EDITORIAL[slug]
  const rawTitle =
    (typeof schema?.headline === 'string' ? schema.headline : '') ||
    extractMeta(html, 'og:title') ||
    extractTagText(html, 'title').replace(/\s*\|\s*CannaShield Blog$/i, '')
  const title = decodeHtml(rawTitle)
  const description =
    (typeof schema?.description === 'string' ? decodeHtml(schema.description) : '') ||
    extractMeta(html, 'description') ||
    textFromHtml(extractElementInnerHtml(html, 'article-content')).slice(0, 180)
  const rawImage =
    (typeof schema?.image === 'string' ? schema.image : '') || extractMeta(html, 'og:image')
  const contentSource = extractElementInnerHtml(html, 'article-content')
  const publishedDate =
    (typeof schema?.datePublished === 'string' ? schema.datePublished : '') ||
    extractMeta(html, 'article:published_time') ||
    '2026-01-01'
  const modifiedDate =
    (typeof schema?.dateModified === 'string' ? schema.dateModified : '') || publishedDate
  const imageTag = html.match(/<img\b[^>]*>/i)?.[0] || ''

  return {
    slug,
    sourceFile,
    legacyUrl: `/blog/${sourceFile}`,
    url: `/blog/${slug}`,
    canonicalUrl: absoluteUrl(`/blog/${slug}`),
    title: editorial?.title ?? title,
    description: editorial?.description ?? description,
    image: assetPathFromImage(rawImage),
    imageAlt: editorial?.title ?? (extractAttribute(imageTag, 'alt') || title),
    category: editorial?.category ?? getCategory(html),
    publishedDate,
    modifiedDate: editorial?.reviewedDate ?? modifiedDate,
    readTime: getReadTime(html),
    contentHtml: editorial
      ? renderEditorialContent(editorial)
      : cleanArticleContent(contentSource, title),
    archived: !editorial,
    reviewedDate: editorial?.reviewedDate,
    sources: editorial?.sources ?? [],
  }
}

export function getAllBlogPosts() {
  if (!fs.existsSync(blogDirectory)) return []

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.html') && file !== 'template.html')
    .map(parseBlogPost)
    .sort((a, b) => {
      const dateCompare = b.publishedDate.localeCompare(a.publishedDate)
      return dateCompare || a.title.localeCompare(b.title)
    })
}

export function getBlogPosts() {
  return getAllBlogPosts().filter((post) => !post.archived)
}

export function getBlogPost(slug: string) {
  return getAllBlogPosts().find((post) => post.slug === slug)
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function blogPostJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${post.canonicalUrl}#article`,
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Person',
      name: founderName,
    },
    publisher: {
      '@id': absoluteUrl('/#organization'),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
    articleSection: post.category,
    inLanguage: 'en-US',
  }
}
