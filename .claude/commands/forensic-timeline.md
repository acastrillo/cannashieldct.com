---
description: Reconstruct an incident timeline (super-timeline) from artifacts and logs. Invoke when you need to establish sequence of events, dwell time, patient-zero, and root cause.
argument-hint: <available artifacts/logs + what you're reconstructing>
---

# Forensic Timeline Reconstruction

> **Source:** wraps upstream `performing-timeline-reconstruction-with-plaso` + `building-incident-timeline-with-timesketch`. NIST SP 800-86. Anchors events to ATT&CK techniques.

Reconstruct the timeline for: **$ARGUMENTS**

## Workflow
1. **Inventory sources** — list what's available and what each contributes:
   - Disk: MFT/`$MFT`, USN journal, registry hives, prefetch, amcache, shimcache, SRUM, LNK/jumplists, browser history, event logs (EVTX).
   - Memory: process list, network connections, injected regions.
   - Logs: EDR telemetry, M365/cloud audit, DNS, proxy, firewall, auth.
   Note timezone normalization (work in UTC) and clock-skew risks.
2. **Generate the super-timeline** — describe the Plaso/`log2timeline` → `psort` workflow (or Timesketch ingest) to merge sources into one normalized timeline; specify the artifact parsers relevant to this case.
3. **Anchor key events** — identify and order: initial access, execution, persistence, privilege escalation, lateral movement, collection, exfil, impact. For each, give `Timestamp (UTC) | Host | Artifact/source | Event | ATT&CK ID | Confidence`.
4. **Establish the narrative** — patient-zero, initial-access vector, dwell time (first compromise → detection), scope of spread, and what data/systems were touched. Distinguish attacker actions from normal activity and from responder actions.
5. **Identify gaps** — missing logs / retention gaps / anti-forensics (timestomping `T1070.006`, log clearing `T1070.001`, shadow-copy deletion `T1490`) and what additional collection would close them.

## Output
- **Source inventory** + reconstruction method (tooling + parsers).
- **Master timeline table** (UTC, ATT&CK-tagged, confidence per row).
- **Incident narrative** — prose: initial access → impact, with dwell time and root cause.
- **Evidence gaps & anti-forensics** observed.
- **Feeds**: root cause → `/ir-containment` eradication + `/secpolicy-generator` lessons-learned; TTP set → `/mitre-map`.

Everything in UTC. Mark each event's confidence and cite the artifact it came from. Separate "attacker did X" from "we infer X." Flag any evidence of log tampering.
