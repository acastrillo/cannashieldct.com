import Link from 'next/link'

import { calendlyUrl } from '@/lib/constants'

const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'License Protection', href: '/services/license-protection' },
      {
        label: 'Insurance Qualification',
        href: '/services/insurance-qualification',
      },
      { label: 'Downtime Prevention', href: '/services/downtime-prevention' },
      { label: 'Service Catalog', href: '/#service-catalog' },
      { label: 'Free Cyber Check', href: '/cyber-check' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Cannabis Cyber Brief', href: '/#resources' },
      { label: 'Partner Program', href: '/partners' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#why-cannashield' },
      { label: 'Contact', href: 'mailto:alex@cannashieldct.com' },
      { label: 'Book a Call', href: calendlyUrl },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-background">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="focus-ring rounded-sm text-lg font-bold text-brand-primary"
          >
            CannaShield
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-secondary">
            Cannabis cybersecurity. Built for operators.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm text-brand-secondary">
            <a
              className="focus-ring w-fit rounded-sm transition-colors hover:text-brand-accent"
              href="https://linkedin.com/company/cannashieldct"
            >
              LinkedIn
            </a>
            <span>Instagram: @cannashieldct</span>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-brand-primary">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="focus-ring rounded-sm text-sm text-brand-secondary transition-colors hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-border py-5">
        <div className="container text-xs leading-relaxed text-brand-secondary">
          © 2025 CannaShield LLC. All rights reserved. | CannaShield is a
          Connecticut LLC. Not a law firm. Information provided is not legal
          advice.
        </div>
      </div>
    </footer>
  )
}
