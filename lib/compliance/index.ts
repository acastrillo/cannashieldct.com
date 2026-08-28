import ct from './ct'

export type { ControlId, ControlRule, StateRuleset } from './types'

export { ct }

export const STATE_RULESETS: Record<string, import('./types').StateRuleset> = {
  CT: ct,
}

export const OPERATOR_TYPES = [
  'Dispensary',
  'Cultivator',
  'Processor',
  'Manufacturer',
  'MSO',
  'Ancillary',
] as const

export type OperatorType = (typeof OPERATOR_TYPES)[number]

export const ALL_CONTROL_IDS: import('./types').ControlId[] = [
  'mfa-email',
  'mfa-pos',
  'edr-endpoints',
  'written-isp',
  'vendor-risk',
  'ir-plan',
  'security-training',
  'encrypted-backups',
]

export type ControlResult = {
  id: import('./types').ControlId
  label: string
  present: boolean
  criticalGap: boolean
  gapNote: string
  weight: number
}

export type ComplianceScore = {
  score: number
  readinessBadge: 'Strong' | 'Moderate' | 'Needs Work' | 'Critical Gaps'
  controlResults: ControlResult[]
}

export function scoreCompliance(
  ruleset: import('./types').StateRuleset,
  presentControls: import('./types').ControlId[],
): ComplianceScore {
  const presentSet = new Set(presentControls)
  const totalWeight = ruleset.controls.reduce((sum, c) => sum + c.weight, 0)
  const earnedWeight = ruleset.controls
    .filter((c) => presentSet.has(c.id))
    .reduce((sum, c) => sum + c.weight, 0)

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0

  let readinessBadge: ComplianceScore['readinessBadge']
  if (score >= 80) readinessBadge = 'Strong'
  else if (score >= 60) readinessBadge = 'Moderate'
  else if (score >= 40) readinessBadge = 'Needs Work'
  else readinessBadge = 'Critical Gaps'

  const controlResults: ControlResult[] = ruleset.controls.map((c) => ({
    id: c.id,
    label: c.label,
    present: presentSet.has(c.id),
    criticalGap: c.criticalGap && !presentSet.has(c.id),
    gapNote: c.gapNote,
    weight: c.weight,
  }))

  return { score, readinessBadge, controlResults }
}
