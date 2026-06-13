---
description: Run a vendor / third-party risk assessment for a cannabis operator's SaaS and service providers. Invoke when onboarding a vendor or building a third-party risk register.
argument-hint: <client name> | <vendor name(s) + what they access>
---

# Vendor / Third-Party Risk Assessment

> **Source:** CannaShield-original (no dedicated upstream vendor-risk skill exists in the catalog — the closest upstream skills are supply-chain technical ones). Mapped to NIST CSF 2.0 GV.SC and ID.RA.

Assess third-party risk for: **$ARGUMENTS**

## Method
For each vendor, classify by **data access + business criticality**, then assess control posture.

1. **Vendor inventory & tiering** — table: `Vendor | Service | Data accessed | Criticality | Tier (1 critical / 2 important / 3 low)`. For a CT cannabis operator, common vendors: POS (Dutchie/Treez), METRC integrator, payment/cashless-ATM provider, M365/Google, accounting (QuickBooks), payroll/HR, marketing/SMS, managed IT/MSP, surveillance vendor.

2. **Inherent risk scoring** — score each vendor on: data sensitivity (PII / cardholder / METRC), access level (admin/API/physical), integration depth, and concentration risk. Output a 1–5 inherent risk rating.

3. **Control assessment (GV.SC)** — for Tier 1/2 vendors, assess and record:
   - Security attestation held (SOC 2 Type II, ISO 27001, PCI DSS AOC) → `GV.SC-07`
   - Data handling & breach-notification clause in contract → `GV.SC-05`
   - MFA + access controls on their platform → `PR.AA`
   - Sub-processor / fourth-party exposure
   - Offboarding / data-return process
4. **Residual risk + treatment** — residual rating after controls; decision: Accept / Mitigate / Avoid. Note required contract language or compensating controls.

## Output
- **Third-Party Risk Register** (the table above + inherent/residual scores + treatment) — droppable into the client's GRC binder.
- **Top vendor risks** narrative (3–5) in business terms.
- **Required actions** — missing DPAs, attestations to request, MFA to enforce, contract clauses to add.
- **CSF mapping note** — every finding tied to a real `GV.SC-xx` / `ID.RA-xx` subcategory.

Cannabis note: a vendor whose failure breaks METRC reporting or purchase-limit enforcement is a **license-continuity risk** — tier it as critical regardless of data sensitivity.
