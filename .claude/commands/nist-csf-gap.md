---
description: Run a NIST CSF 2.0 maturity + gap assessment for a client and produce a roadmap. Invoke when scoping or delivering a CSF assessment, gap analysis, or control-maturity baseline.
argument-hint: <client name> | <stack notes, e.g. M365, Dutchie POS, Cloudflare>
---

# NIST CSF 2.0 Gap Assessment

> **Source:** wraps upstream skill `performing-nist-csf-maturity-assessment` (Anthropic-Cybersecurity-Skills). Adapted for CannaShield vCISO deliverables. Cite real subcategory IDs — never invent them.

You are acting as Alex's CannaShield vCISO assessor. Produce an evidence-credible CSF 2.0 gap assessment for: **$ARGUMENTS**

## Method

Assess against all 6 CSF 2.0 Functions and 22 Categories. Score each assessed subcategory against the 4 Implementation Tiers: **Tier 1 Partial → Tier 2 Risk-Informed → Tier 3 Repeatable → Tier 4 Adaptive**. State a Current Tier and a Target Tier (default Target = Tier 3 for a solo-operated cannabis SMB unless the client is pursuing insurance/enterprise contracts, then Tier 4 for GV/DE/RS).

### Functions & categories to walk
- **GV — Govern**: GV.OC (Organizational Context), GV.RM (Risk Management Strategy), GV.RR (Roles/Responsibilities), GV.PO (Policy), GV.OV (Oversight), GV.SC (Supply Chain Risk Mgmt)
- **ID — Identify**: ID.AM (Asset Management), ID.RA (Risk Assessment), ID.IM (Improvement)
- **PR — Protect**: PR.AA (Identity/Auth/Access Control), PR.AT (Awareness & Training), PR.DS (Data Security), PR.PS (Platform Security), PR.IR (Tech Infrastructure Resilience)
- **DE — Detect**: DE.CM (Continuous Monitoring), DE.AE (Adverse Event Analysis)
- **RS — Respond**: RS.MA (Incident Management), RS.AN (Analysis), RS.CO (Reporting/Comms), RS.MI (Mitigation)
- **RC — Recover**: RC.RP (Recovery Plan Execution), RC.CO (Recovery Comms)

## Output (client-report ready)

1. **Executive Summary** — 4–6 sentences: overall posture, top 3 risks in business terms, headline maturity (e.g. "Tier 1.6 weighted average"). Written for a dispensary owner + their insurance broker, not an engineer.
2. **Maturity Heatmap table** — columns: `Function | Category | Subcategory ID | Current Tier | Target Tier | Gap | Evidence/Observation`. Use real subcategory IDs (e.g. `GV.OC-01`, `ID.AM-01`, `PR.AA-01`, `PR.AA-05`, `PR.DS-01`, `DE.CM-01`, `DE.AE-02`, `RS.MA-01`, `RS.MA-05`, `RC.RP-01`).
3. **Prioritized Gap Register** — each gap: ID, severity (Critical/High/Med/Low), affected CSF subcategory, recommended control, rough effort, and where relevant the **MITRE ATT&CK technique** it mitigates (real Txxxx IDs only).
4. **90-Day Roadmap** — Quick wins (0–30d) → Foundational (30–60d) → Maturity (60–90d), each line tagged to the CSF subcategory it advances.
5. **Insurance/Attorney Notes** — call out which gaps map to common cyber-insurance application questions (MFA coverage → PR.AA-01/03, EDR → DE.CM-01, backups/immutability → PR.DS-11/RC.RP-01, IR plan → RS.MA-01, awareness training → PR.AT-01).

## Cannabis-specific lenses (apply when the stack mentions these)
- **POS (Dutchie/Treez/Flowhub/Cova)** → cardholder + purchase-limit data, PR.DS, DE.CM; ATT&CK POS/credential theft (T1078, T1539, T1556).
- **METRC (state seed-to-sale)** → API token handling, GV.SC, PR.AA-05; integrity of state reporting.
- **M365 / Google Workspace** → PR.AA (MFA, conditional access), DE.CM (audit logs), BEC exposure (T1566, T1114).
- **Cloudflare** → PR.IR / DE.CM at the edge; WAF + bot mitigation evidence.

## Rules
- Every control claim ties to a **real** CSF 2.0 subcategory ID and, where defensive coverage is discussed, a **real** MITRE technique ID. If unsure an ID exists, say so rather than fabricate.
- If the stack is underspecified, state assumptions explicitly at the top.
- Keep it droppable into a Word/PDF client report — clean headers, tables, no internal jargon.
