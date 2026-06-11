---
description: Respond to a Business Email Compromise / phishing account-takeover in M365 or Google Workspace. Invoke for suspected mailbox compromise, fraudulent wire/invoice, or malicious inbox rules.
argument-hint: <victim account + what was observed (rule, login, wire, phish)>
---

# BEC / Email Account Compromise Response

> **Source:** wraps upstream `detecting-business-email-compromise`, `conducting-phishing-incident-response`, `analyzing-office365-audit-logs-for-compromise`. ATT&CK: T1566 (Phishing), T1078 (Valid Accounts), T1114 (Email Collection), T1564.008 (inbox rules), T1539 (session cookie theft). CSF: RS.MA, RS.MI, RS.AN.

Respond to: **$ARGUMENTS**

## Workflow
1. **Confirm compromise** — pull from M365 Unified Audit Log / Google Admin audit:
   - Sign-in logs: impossible-travel, new ASN/country, legacy-auth, MFA-fatigue/`T1621`, token-replay.
   - Mailbox audit: `New-InboxRule`/`Set-InboxRule` (forwarding, auto-delete to RSS/Archive), `UpdateInboxRules`, `Add-MailboxPermission`, mass reads (`MailItemsAccessed` → `T1114`).
   - OAuth: newly consented enterprise apps / illicit consent grant (`T1528`).
   List the specific audit operations to query.
2. **Immediate containment** — reset password + **revoke all sessions/refresh tokens**; re-register MFA; remove malicious inbox rules & forwarding; revoke illicit OAuth grants; block the sender/IOCs; quarantine the phish org-wide (search & purge). Note: revoke sessions or the attacker keeps a live token despite the password reset.
3. **Scope the fraud** — was there a wire/invoice/payroll-change request? Identify financial exposure, who acted on it, and whether funds moved (advise client to contact bank for recall + file IC3 if so). Check for sent-items the attacker mailed from the account (further phishing of contacts).
4. **Hunt for spread** — same phish to other users? Mailbox rules across tenant? Reused creds elsewhere (SSO)? Pull conditional-access gaps that allowed it.
5. **Eradicate & harden** — enforce phishing-resistant MFA, block legacy auth, tighten OAuth app consent, enable mailbox auditing, DMARC/SPF/DKIM (`/cyber-insurance-readiness` control #4).

## Output
- **Incident summary** — account, confirmation evidence, ATT&CK IDs, financial exposure.
- **Containment actions taken/needed** (ordered, with the exact admin action).
- **Audit-log query list** — specific operations/fields to pull (M365 + Google).
- **Hunt findings + scope.**
- **Hardening recommendations** + client-facing notification guidance (CT breach-notice consideration if PII exposed → see `/ct-cannabis-compliance`).

Distinguish confirmed from suspected. Always revoke tokens, not just reset passwords. For a cannabis client, check whether the compromised account had METRC/POS admin access.
