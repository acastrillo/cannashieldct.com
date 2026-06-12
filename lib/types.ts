import type { LucideIcon } from 'lucide-react'

export type ServiceSlug =
  | 'license-protection'
  | 'insurance-qualification'
  | 'downtime-prevention'

export type Sku = {
  code: string
  name: string
  price: string
  delivery: string
  trigger: string
  pillar: ServiceSlug
}

export type Pillar = {
  title: string
  href: string
  icon: LucideIcon
  pain: string
  solution: string
  priceAnchor: string
  cta: string
}

export type Breach = {
  company: string
  date: string
  impact: string
  rootCause: string
  note: string
  counter?: {
    prefix?: string
    value: number
    suffix?: string
    label: string
  }
}

export type ServicePage = {
  slug: ServiceSlug
  label: string
  headline: string
  pain: string
  painDetails: string[]
  skus: string[]
  operatorTypes: string[]
  faqs: {
    question: string
    answer: string
  }[]
}
