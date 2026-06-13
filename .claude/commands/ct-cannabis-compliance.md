---
description: Map a CT cannabis operator's security posture to state regulatory + data-protection obligations. Invoke for CT licensing security requirements, state data-breach duties, or regulator-facing mapping.
argument-hint: <client name> | <license type: LP-1|LP-2|IQ-1|dispensary|cultivator> | <stack>
---

# Connecticut Cannabis Regulatory Compliance Mapping

> **Source:** CannaShield-original. No upstream skill covers state cannabis regulation. Cross-references the `/nist-csf-gap` output and CT statutes. **Treat all statutory citations as DRAFT pending Alex's legal verification** — flag, don't assert as legal advice.

Map security/compliance obligations for: **$ARGUMENTS**

## Scope of obligations to walk
1. **CT cannabis program (RSA / DCP regulations)** — recordkeeping, seed-to-sale (METRC) reporting integrity, surveillance/retention requirements, inventory & purchase-limit controls, security-plan obligations attached to the license type. Map each to a supporting **NIST CSF subcategory** (e.g. surveillance retention → `PR.DS` + `ID.AM`; METRC integrity → `PR.DS-01`/`PR.AA-05`; access logs → `DE.CM-01`).
2. **CT data-breach notification law (Conn. Gen. Stat. § 36a-701b)** — what counts as personal information, notification timeline, AG notification trigger. Map to `RS.CO`/`RS.MA`.
3. **Payment / cardholder obligations** — PCI DSS scope if card data touched (many use cashless ATM/PIN-debit to limit scope — note actual scope).
4. **Federal overlay where relevant** — FinCEN/BSA cannabis banking guidance touchpoints for the finance stack (note, don't over-reach).

## Output
1. **Compliance Obligation Matrix** — `Obligation | Source (statute/reg — DRAFT) | License-type applicability | Current status | Supporting CSF subcat | Gap/action`.
2. **License-type-specific callouts** — tailor to the license in $ARGUMENTS (cultivation vs. retail dispensary vs. micro have different physical-security & reporting demands).
3. **Regulator-readiness summary** — what the operator could show a DCP inspector today vs. gaps.
4. **Cross-link** — note which gaps are also `/cyber-insurance-readiness` blockers (overlap is common: IR plan, logging, access control).

## Rules
- Statutory/regulatory citations are **drafting aids for Alex to verify**, never delivered to a client as legal conclusions. Mark them `[VERIFY]`.
- Anything threatening METRC reporting integrity or purchase-limit enforcement = **license risk**, surfaced at the top.
- Tie every security obligation to a real CSF 2.0 subcategory ID.
