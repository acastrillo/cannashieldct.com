---
description: Threat-model a cannabis operator's POS/seed-to-sale environment using MITRE ATT&CK. Invoke for POS, METRC, Dutchie, Treez, Flowhub, or dispensary IT threat assessments.
argument-hint: <client name> | <POS + integrations, e.g. Dutchie, METRC, M365>
---

# Cannabis POS & Seed-to-Sale Threat Model (MITRE ATT&CK)

> **Source:** wraps upstream skill `implementing-threat-modeling-with-mitre-attack`; cannabis asset context is CannaShield-original. Use real ATT&CK technique IDs only.

Build a threat-informed model for: **$ARGUMENTS**

## Steps

1. **Asset & data-flow inventory** — enumerate crown-jewel assets typical of a CT cannabis operator: POS terminals & backend (Dutchie/Treez/Flowhub/Cova), METRC API integration + tokens, payment path (cashless ATM / PIN-debit / ACH — note card data scope), customer PII & purchase-limit data, loyalty DB, M365/Workspace identity, back-office finance, surveillance/IoT (cameras, badge readers), Wi-Fi segmentation (guest vs. POS vs. corp).

2. **Threat actors** — financially-motivated eCrime (POS malware, card skimming), ransomware affiliates, BEC operators targeting AP/payroll, insider threat (budtender/manager), and opportunistic credential abuse. Cash-heavy + cyber-immature = high target value.

3. **Map plausible TTPs to ATT&CK** — produce a table: `Tactic | Technique (Txxxx) | How it manifests here | Detection idea | NIST CSF subcat`. Anchor on real techniques such as:
   - Initial Access: Phishing `T1566`, Valid Accounts `T1078`, External Remote Services `T1133`
   - Credential Access: `T1539` (steal web session cookie), `T1556` (modify auth), `T1110` (brute force)
   - Collection/Exfil: `T1114` (email collection), `T1213` (data from info repos), `T1041` (exfil over C2)
   - Impact: `T1486` (data encrypted for impact / ransomware), `T1657` (financial theft)
   - POS-specific: memory scraping / `T1005` (data from local system) on terminal backends
4. **Detection & control coverage** — for each top technique, give a detectable signal and the CSF subcategory + a defensive countermeasure (network segmentation of POS VLAN, MFA `PR.AA-01`, EDR `DE.CM-01`, egress filtering, METRC token vaulting).
5. **Top-10 prioritized risk list** — ranked by likelihood × business impact (purchase-limit/METRC integrity violations carry *regulatory* impact, not just financial — weight accordingly).

## Output
- One-paragraph executive risk statement for the operator.
- The ATT&CK mapping table (ATT&CK Navigator-layer-ready: list technique IDs so a layer JSON can be generated on request).
- Prioritized mitigation roadmap tied to CSF subcategories.
- Cannabis compliance callouts: anything that threatens METRC reporting integrity or purchase-limit enforcement is flagged as a **state-license risk**, not just IT risk.

Only cite ATT&CK technique IDs that actually exist. If you reference a sub-technique, use the real `Txxxx.xxx` form.
