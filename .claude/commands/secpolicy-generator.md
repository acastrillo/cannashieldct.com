---
description: Generate a security policy set (ISP, AUP, BCP, IRP) for a cannabis client. Invoke when a client needs written policies for insurance, audits, or onboarding.
argument-hint: <client name> | <policy type: ISP|AUP|BCP|IRP|ALL> | <stack notes>
---

# Security Policy Generator (ISP / AUP / BCP / IRP)

> **Source:** grounded in upstream `implementing-iso-27001-information-security-management` and `building-incident-response-playbook`; CannaShield packaging and cannabis tailoring are original. Maps every policy section to NIST CSF 2.0 GV.PO and ISO 27001 Annex A where relevant.

Generate the requested policy for: **$ARGUMENTS**

If policy type is `ALL`, produce all four. Each policy is a complete, signature-ready document — not an outline.

## Document standards (all policies)
- Header block: Org name, document title, version 1.0, effective date, owner (vCISO / CannaShield on behalf of client), review cadence (annual), classification.
- Map sections to **NIST CSF 2.0 GV.PO-01/02** and cite the relevant CSF Function each section supports.
- Plain, enforceable language. Define scope, roles, and exceptions. End with acknowledgment/signature block.

## ISP — Information Security Policy
Sections: Purpose & Scope · Roles & Responsibilities (GV.RR) · Acceptable Use ref · Access Control (PR.AA) · Data Classification & Handling (PR.DS) · Asset Management (ID.AM) · Vendor/Supply-Chain (GV.SC) · Vulnerability & Patch Mgmt · Logging & Monitoring (DE.CM) · Incident Reporting (RS.MA) · Awareness & Training (PR.AT) · Enforcement. Include a cannabis data clause covering METRC tokens, purchase-limit/PII data, and POS cardholder scope.

## AUP — Acceptable Use Policy
Sections: covered systems · acceptable/prohibited use · email & BEC awareness · POS terminal use rules (no personal browsing on POS VLAN) · password/MFA requirements · remote access · social media & customer data · monitoring consent · disciplinary actions. Keep readable by budtenders, not just IT.

## BCP — Business Continuity Plan
Sections: BIA summary (critical functions: POS uptime, METRC reporting, payment processing) · RTO/RPO targets per system · backup strategy (immutable/offline, ties to RC.RP-01 & PR.DS-11) · alternate process for POS/METRC outage (manual sale + reconciliation procedure that preserves purchase-limit compliance) · communications tree · recovery roles · test/exercise schedule.

## IRP — Incident Response Plan (NIST SP 800-61r2 lifecycle)
Sections: Preparation · Detection & Analysis (DE.AE, RS.AN) · Containment/Eradication/Recovery (RS.MI, RC.RP) · Post-Incident (RS.MA-05) · Severity matrix (SEV1–4) · escalation & legal/insurance notification triggers (confirmed exfil → notify counsel + carrier) · regulatory reporting (CT data-breach notification + cannabis regulator notice if license-relevant) · contact roster · ransomware & BEC quick-reference playbooks. Cross-reference the `/ir-ransomware-response` and `/ir-bec-response` commands.

## Rules
- Tailor to the client's actual stack from $ARGUMENTS (don't ship generic boilerplate — reference their real POS, identity provider, edge).
- Flag any section the client must fill in (e.g. specific RTO numbers) with a clearly marked `[CLIENT INPUT REQUIRED: …]`.
- Output clean Markdown that converts cleanly to a Word deliverable.
