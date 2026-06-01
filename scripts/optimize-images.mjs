#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

import sharp from 'sharp'

const ROOT = process.cwd()
const BLOG_ASSETS = join(ROOT, 'public', 'blog-assets')
const APP_DIR = join(ROOT, 'app')
const FAVICON_SRC = join(ROOT, 'favicon.png')

const MAX_WIDTH = 1600
const JPEG_QUALITY = 78
const PNG_COMPRESSION = 9

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

async function reencode(file) {
  const ext = extname(file).toLowerCase()
  const before = (await stat(file)).size

  const image = sharp(file, { failOn: 'none' })
  const metadata = await image.metadata()
  const width = metadata.width || 0
  const resized = width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image

  let buffer
  if (ext === '.jpg' || ext === '.jpeg') {
    buffer = await resized
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer()
  } else if (ext === '.png') {
    buffer = await resized
      .png({ compressionLevel: PNG_COMPRESSION, palette: true })
      .toBuffer()
  } else {
    return null
  }

  if (buffer.length >= before) {
    return { file, before, after: before, skipped: true }
  }

  await sharp(buffer).toFile(file + '.tmp')
  const { rename } = await import('node:fs/promises')
  await rename(file + '.tmp', file)
  return { file, before, after: buffer.length, skipped: false }
}

async function optimizeBlogAssets() {
  const entries = await readdir(BLOG_ASSETS)
  const targets = entries.filter((name) => /\.(jpe?g|png)$/i.test(name))
  let totalBefore = 0
  let totalAfter = 0
  for (const name of targets) {
    const file = join(BLOG_ASSETS, name)
    try {
      const result = await reencode(file)
      if (!result) continue
      totalBefore += result.before
      totalAfter += result.after
      const tag = result.skipped ? 'SKIP' : 'OK  '
      console.log(`${tag}  ${name.padEnd(80)} ${fmt(result.before)} → ${fmt(result.after)}`)
    } catch (err) {
      console.error(`FAIL ${name}: ${err.message}`)
    }
  }
  console.log(`\nblog-assets total: ${fmt(totalBefore)} → ${fmt(totalAfter)}`)
}

async function makeAppIcons() {
  if (!(await stat(FAVICON_SRC).catch(() => null))) {
    console.warn(`No favicon source at ${FAVICON_SRC}; skipping app icons.`)
    return
  }
  const tasks = [
    { size: 32, out: join(APP_DIR, 'icon.png') },
    { size: 180, out: join(APP_DIR, 'apple-icon.png') },
  ]
  for (const t of tasks) {
    await sharp(FAVICON_SRC)
      .resize({ width: t.size, height: t.size, fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(t.out)
    const size = (await stat(t.out)).size
    console.log(`wrote ${t.out} (${fmt(size)})`)
  }
}

await makeAppIcons()
await optimizeBlogAssets()
