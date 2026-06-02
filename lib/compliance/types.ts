export type ControlId =
  | 'mfa-email'
  | 'mfa-pos'
  | 'edr-endpoints'
  | 'written-isp'
  | 'vendor-risk'
  | 'ir-plan'
  | 'security-training'
  | 'encrypted-backups'

export type ControlRule = {
  id: ControlId
  label: string
  weight: number
  criticalGap: boolean
  gapNote: string
}

export type StateRuleset = {
  state: string
  fullName: string
  statuteNote: string
  controls: ControlRule[]
}
