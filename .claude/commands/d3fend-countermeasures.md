---
description: Select MITRE D3FEND defensive countermeasures for a given set of ATT&CK techniques or an incident. Invoke to turn offense (ATT&CK) into a prioritized defense plan.
argument-hint: <ATT&CK technique IDs, an incident, or a threat model>
---

# D3FEND Countermeasure Selection

> **Source:** CannaShield/IR-original, grounded in upstream `implementing-mitre-attack-coverage-mapping`. Uses MITRE D3FEND v1.3 defensive taxonomy mapped against ATT&CK. (The upstream catalog carries D3FEND IDs in frontmatter but has no standalone selection skill — this command fills that.)

Select countermeasures for: **$ARGUMENTS**

## Workflow
1. **Normalize the input to ATT&CK techniques** — if given an incident or threat model, first extract technique IDs (or run `/mitre-map`). List the techniques to defend against.
2. **Map ATT&CK → D3FEND** — for each technique, identify D3FEND countermeasures via the digital-artifact relationship (ATT&CK technique → artifact it produces/uses → D3FEND technique that detects/hardens/isolates/deceives/evicts it). Use D3FEND's five tactics:
   - **Model** (asset/inventory understanding)
   - **Harden** (e.g. Credential Hardening, Message Hardening, Platform Hardening)
   - **Detect** (e.g. Network Traffic Analysis, Process Analysis, User Behavior Analysis, File Analysis)
   - **Isolate** (e.g. Network Isolation, Execution Isolation)
   - **Deceive** / **Evict** (e.g. Credential Eviction, Process Eviction)
3. **Prioritize** — rank countermeasures by coverage (how many input techniques each addresses), feasibility for the environment (enterprise SOC vs. cannabis SMB), and whether it's preventive vs. detective. Favor high-coverage, low-effort first.
4. **Map back to controls & CSF** — translate each D3FEND countermeasure into a concrete control the org can implement (tool/config) and the NIST CSF subcategory it satisfies (e.g. Credential Hardening → `PR.AA`; Network Traffic Analysis → `DE.CM-01`; Network Isolation → `PR.IR-01`).

## Output
- **ATT&CK→D3FEND mapping table**: `ATT&CK Txxxx | Digital artifact | D3FEND countermeasure | D3FEND tactic | Concrete control | CSF subcat`.
- **Prioritized defense plan** — ordered list with coverage count + effort + preventive/detective tag.
- **Coverage summary** — which input techniques are well-covered vs. residual gaps.
- **Tie-in** — for a CannaShield client, feed this into `/nist-csf-gap` roadmap; for the day job, into detection-engineering backlog.

Use D3FEND countermeasure names accurately. State the artifact linking each ATT&CK technique to its D3FEND counter so the mapping is defensible, not asserted.
