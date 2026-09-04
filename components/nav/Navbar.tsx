'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { calendlyUrl, freeTools, pillars } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navLinks = [
  {
    label: 'Resources',
    href: '/resources/connecticut-cannabis-cybersecurity-requirements',
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/#why-cannashield' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 -z-10 transition-[bottom,background-color,border-color] duration-300',
          scrolled
            ? 'bottom-0 border-b border-brand-border bg-brand-surface/85 backdrop-blur-md'
            : '-bottom-8 bg-gradient-to-b from-brand-background/85 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,black_55%,transparent)]',
        )}
      />
      <nav
        className="container flex h-20 items-center justify-between"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="focus-ring rounded-sm text-lg font-bold text-brand-primary"
        >
          CannaShield
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-ring rounded-sm text-sm font-medium text-brand-secondary transition-colors hover:text-brand-accent">
              Services
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {pillars.map((pillar) => (
                <DropdownMenuItem key={pillar.href} asChild>
                  <Link href={pillar.href}>{pillar.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-ring rounded-sm text-sm font-medium text-brand-secondary transition-colors hover:text-brand-accent">
              Free Tools
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {freeTools.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link href={tool.href}>{tool.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-sm text-sm font-medium text-brand-secondary transition-colors hover:text-brand-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={calendlyUrl}>Book a call</a>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-brand-border text-brand-primary lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="fixed inset-x-0 top-20 z-40 min-h-[calc(100vh-5rem)] border-t border-brand-border bg-brand-background px-6 py-8 lg:hidden"
          >
            <div className="mx-auto flex max-w-md flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
                Services
              </p>
              {pillars.map((pillar) => (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-md border border-brand-border bg-brand-surface px-4 py-4 text-lg font-semibold text-brand-primary"
                >
                  {pillar.title}
                </Link>
              ))}
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
                Free Tools
              </p>
              {freeTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-md border border-brand-border bg-brand-surface px-4 py-4 text-lg font-semibold text-brand-primary"
                >
                  {tool.title}
                </Link>
              ))}
              <div className="mt-5 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring rounded-md px-1 py-3 text-base font-semibold text-brand-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-5 w-full">
                <a href={calendlyUrl}>Book a call</a>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
