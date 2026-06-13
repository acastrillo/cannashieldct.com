# CLAUDE.md

Project guidance for Claude Code in this repository (CannaShield CT — cannabis cybersecurity & GRC).

## Cybersecurity Skills

Curated cybersecurity slash commands live in `.claude/commands/`, adapted from the
[Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills)
catalog (754 skills, mapped to MITRE ATT&CK, NIST CSF 2.0, D3FEND, ATLAS, NIST AI RMF).
Each command wraps a verified upstream skill (slug noted in the file) or, where no upstream
equivalent exists, is a CannaShield-original grounded in the same frameworks.

Deliverables must cite **real** NIST CSF 2.0 subcategory IDs and MITRE technique IDs — these
commands are built to do that. For packaged GRC engagements, use the `cannashield-grc` Cowork
skill (see `skills/cannashield-grc/`), which orchestrates the GRC commands by client + service type.

### CannaShield GRC (vCISO deliverables)
| Command | When to invoke |
|---|---|
| `/nist-csf-gap` | NIST CSF 2.0 maturity + gap assessment and 90-day roadmap |
| `/cannabis-pos-threat-model` | ATT&CK threat model for POS / METRC / Dutchie / Treez environments |
| `/secpolicy-generator` | Generate ISP / AUP / BCP / IRP policy documents |
| `/cyber-insurance-readiness` | Cyber-insurance application readiness + control attestation evidence |
| `/vendor-risk` | Vendor / third-party risk assessment + register (CSF GV.SC) |
| `/ct-cannabis-compliance` | Map posture to CT cannabis regulation + state breach-notice duties |

### Day-job Incident Response (enterprise SOC)
| Command | When to invoke |
|---|---|
| `/ir-triage` | Triage an alert/incident — severity, TP/FP, escalation |
| `/ir-containment` | Containment / eradication / recovery for a confirmed incident |
| `/ir-bec-response` | BEC / email account takeover in M365 or Google Workspace |
| `/ir-ransomware-response` | Ransomware response (CISA #StopRansomware) |
| `/threat-hunt` | Hypothesis-driven hunt with SPL/KQL/Sigma queries |
| `/forensic-timeline` | Reconstruct a super-timeline (Plaso/Timesketch), NIST 800-86 |
| `/mitre-map` | Map activity to ATT&CK + emit a Navigator layer |
| `/d3fend-countermeasures` | Turn ATT&CK techniques into a prioritized D3FEND defense plan |

### Conventions
- Always cite real framework IDs (`GV.OC-01`, `T1486`, D3FEND technique names). Never fabricate an ID — if unsure it exists, say so.
- GRC outputs are client-report-ready (clean tables/headers, business language up top).
- Statutory/regulatory citations are drafting aids for Alex to verify (`[VERIFY]`), not legal advice.
- Cowork skill deliverables are written to the `outputs/` folder.
