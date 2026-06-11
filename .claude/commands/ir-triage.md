---
description: Triage a security alert/incident — classify severity, determine true vs false positive, assign and escalate. Invoke at the start of any incident or when a SIEM/EDR alert lands.
argument-hint: <alert details / SIEM output / what was observed>
---

# Incident Triage (IR Playbook)

> **Source:** wraps upstream skill `triaging-security-incident-with-ir-playbook`. Enterprise SOC workflow. NIST CSF: RS.MA-01, RS.MA-02, RS.AN-03.

Triage: **$ARGUMENTS**

## Workflow
1. **Acknowledge & record** — capture detection source (SIEM/EDR/email/user-report), timestamp, raw indicators. Open/append a ticket reference.
2. **Enrich** — for each observable (IP, domain, hash, user, host) note the enrichment you'd run (VirusTotal, threat-intel feed, GeoIP, internal asset/owner lookup, prior-alert history) and the verdict it would drive. Flag known-good vs. suspicious.
3. **True/false positive determination** — state the hypothesis and the evidence for/against. If insufficient telemetry, list exactly what to pull (EDR process tree, auth logs, proxy/DNS, mailbox audit).
4. **Severity classification** — assign **SEV1–SEV4** using a clear matrix:
   - SEV1: confirmed active compromise of critical asset / data exfil / ransomware encryption in progress
   - SEV2: confirmed compromise, contained blast radius / credential theft
   - SEV3: suspicious, likely true positive, no confirmed impact yet
   - SEV4: low-risk / informational / likely FP
   State the business-impact reasoning, not just the score.
5. **ATT&CK tag** — map the activity to technique IDs (or call `/mitre-map`). Common: `T1486`, `T1490`, `T1078`, `T1566`, `T1070`.
6. **Assign & escalate** — who owns it, escalation path, and notification triggers (SEV1/SEV2 → IR lead + management; confirmed PII/data exfil → legal/privacy + comms). Set next action + clock (MTTA/MTTC awareness).

## Output
- **Triage summary card**: Source · Severity (SEV#) · TP/FP/Unknown · Affected assets/users · ATT&CK IDs · Recommended immediate action · Escalation.
- **Investigation task list** — ordered next steps with the specific queries/log sources.
- **Containment trigger** — if SEV1/SEV2, hand off to `/ir-containment` (and `/ir-bec-response` or `/ir-ransomware-response` if the type matches).

Be decisive but evidence-bound. Distinguish "confirmed" from "suspected" explicitly. Don't escalate noise; don't sit on a real SEV1.
