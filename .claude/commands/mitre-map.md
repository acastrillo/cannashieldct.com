---
description: Map observed activity, an alert, or a report to MITRE ATT&CK techniques and produce a Navigator-ready layer. Invoke when triaging detections, writing IR reports, or doing detection-coverage mapping.
argument-hint: <alert/behavior/IOCs/report text to map>
---

# MITRE ATT&CK Technique Mapping

> **Source:** wraps upstream skill `mapping-mitre-attack-techniques` (ATT&CK v19.1). SOC-workflow conventions for enterprise IR. Real technique IDs only.

Map the following to ATT&CK: **$ARGUMENTS**

## Workflow
1. **Extract observables/behaviors** — pull discrete actions from the input (process exec, persistence, network, auth events, etc.). Don't map vibes; map behaviors.
2. **Assign techniques** — for each behavior give `Tactic | Technique ID (Txxxx[.xxx]) | Technique name | Why (the evidence) | Confidence (High/Med/Low)`. Use sub-techniques when the evidence supports them; otherwise stay at parent technique. Do **not** invent IDs — if you can't confidently assign one, say "unmapped — needs more telemetry".
3. **Tactic coverage view** — list which of the 14 Enterprise tactics are represented, in kill-chain order (Initial Access → Impact).
4. **Detection & data sources** — for each mapped technique, name the log/data source that would confirm it (Sysmon EID, Windows Security EID, EDR telemetry, M365 audit, firewall) and a hunt/detection idea.
5. **Defensive next step** — for the top techniques, name the D3FEND-style countermeasure class (isolate, harden credential, network-filter) — or suggest running `/d3fend-countermeasures`.

## Output
- The mapping table (above).
- **Tactic coverage summary line.**
- **ATT&CK Navigator layer JSON** — emit a valid layer object (`name`, `versions`, `domain: enterprise-attack`, `techniques: [{techniqueID, score, comment}]`) so it can be loaded directly into Navigator. Score mapped techniques 1–100 by confidence.
- **Report snippet** — 2–3 sentence prose paragraph suitable for pasting into an IR ticket / SOC report ("The actor demonstrated TTPs consistent with …").

Match enterprise SOC conventions: concise, evidence-linked, no speculation presented as fact.
