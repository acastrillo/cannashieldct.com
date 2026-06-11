---
description: Drive containment/eradication/recovery for a confirmed incident with concrete actions. Invoke after triage confirms a SEV1/SEV2, or when you need a containment plan for a specific incident type.
argument-hint: <incident type + affected systems/accounts>
---

# Incident Containment, Eradication & Recovery

> **Source:** wraps upstream `performing-cloud-incident-containment-procedures` + `building-incident-response-playbook`. NIST SP 800-61r2 lifecycle. CSF: RS.MI-01/02, RC.RP-01.

Contain and remediate: **$ARGUMENTS**

## Workflow (decision-driven, least-disruption-first)
1. **Scope the blast radius** — affected hosts, accounts, data, and lateral-movement paths. State what's confirmed vs. suspected. Identify whether the threat is still active.
2. **Short-term containment** — concrete, ordered actions for THIS incident type and stack:
   - Identity: disable/force-reset compromised accounts, revoke sessions/tokens/OAuth grants, kill refresh tokens (Entra/Okta/Google).
   - Endpoint: EDR network-isolate the host (preserve for forensics — don't wipe yet).
   - Network: block C2 IOCs at firewall/proxy/DNS, segment the affected VLAN.
   - Cloud/M365: revoke API keys, remove malicious inbox rules/forwarding, rotate secrets.
   For each action note the **side effect** (e.g. isolating POS terminal halts sales — coordinate timing).
3. **Evidence preservation** — capture before changing: memory/disk image, relevant logs, mailbox audit export. Note chain-of-custody. (Hand to `/forensic-timeline` for reconstruction.)
4. **Eradication** — remove persistence (scheduled tasks, run keys, WMI subs, rogue accounts/app registrations), patch the exploited vuln, validate the root cause is closed.
5. **Recovery** — restore from known-good/immutable backup, rebuild rather than clean where integrity is uncertain, monitor for re-infection, staged return to production with heightened monitoring (`DE.CM-01`).
6. **Verification & exit criteria** — explicit conditions to declare the incident contained/closed.

## Output
- **Containment action plan** — numbered, each with owner, side-effect, and rollback note.
- **Eradication checklist** — persistence + root-cause items to clear.
- **Recovery plan** — restore steps, validation, monitoring.
- **Exit criteria** + recommended post-incident review (feed `/secpolicy-generator` IRP lessons-learned).
- **ATT&CK + CSF tags** on key actions.

Map each containment step to the technique it neutralizes. Preserve evidence before eradicating. Call out business-disruptive actions (POS/payment outages) so the call is made deliberately.
