---
description: Assess a client's readiness for a cyber-insurance application and build control attestation evidence. Invoke before a renewal/application or when a carrier sends a control questionnaire.
argument-hint: <client name> | <carrier or questionnaire notes> | <stack>
---

# Cyber Insurance Readiness & Control Attestation

> **Source:** CannaShield-original, grounded in upstream `performing-soc2-type2-audit-preparation`. Maps each carrier control to NIST CSF 2.0 subcategories so the same evidence reuses the `/nist-csf-gap` output.

Assess insurance readiness for: **$ARGUMENTS**

## What carriers actually ask (build attestation status for each)
Produce a table: `Control | Carrier asks? | Client status (Yes/Partial/No) | Evidence artifact | CSF subcat | Remediation if gap`.

Core control set carriers (Coalition, At-Bay, Chubb, Travelers, etc.) gate on:
1. **MFA everywhere** — email, remote access, privileged, VPN → `PR.AA-01`, `PR.AA-03`
2. **EDR/XDR on endpoints & servers** → `DE.CM-01`
3. **Backups: tested, encrypted, immutable/offline** → `PR.DS-11`, `RC.RP-01`, `RC.RP-04`
4. **Email security / anti-phishing (BEC)** — DMARC/SPF/DKIM, filtering → `PR.DS`, `DE.CM`; mitigates `T1566`
5. **Patch & vulnerability management cadence** → `ID.RA-01`, `PR.PS`
6. **Privileged access management / least privilege** → `PR.AA-05`
7. **Security awareness training + phishing simulation** → `PR.AT-01`
8. **Incident Response Plan, tested** → `RS.MA-01` (ties to `/secpolicy-generator` IRP)
9. **Network segmentation** (esp. POS VLAN isolation) → `PR.IR-01`
10. **Logging/monitoring with retention** → `DE.CM-01`, `DE.AE-02`
11. **End-of-life software inventory / no unsupported OS** → `ID.AM-08`
12. **Vendor/third-party risk process** → `GV.SC` (ties to `/vendor-risk`)

## Output
1. **Readiness Scorecard** — % of carrier-critical controls met; RED/AMBER/GREEN per control.
2. **Attestation Evidence Pack list** — for each "Yes", name the artifact that proves it (e.g. "Entra Conditional Access policy export", "Datto immutable backup report", "KnowBe4 training completion CSV").
3. **Blocker list** — controls that, if answered "No", commonly cause **declination or higher premium** (MFA, EDR, immutable backups, tested IR plan). Flag these first.
4. **Remediation plan to "insurable"** — fastest path to flip each blocker to Yes, with effort estimate.
5. **Application-answer draft** — suggested truthful wording for the questionnaire answers the client can attest to today.

Never advise attesting to a control the client doesn't actually have — misrepresentation voids coverage. Where status is Partial, say exactly what's missing.
