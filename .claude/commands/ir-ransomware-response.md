---
description: Drive ransomware incident response using the CISA #StopRansomware framework. Invoke for active encryption, ransom note discovery, or suspected pre-encryption staging.
argument-hint: <what was observed + affected systems>
---

# Ransomware Response (CISA #StopRansomware)

> **Source:** wraps upstream `performing-ransomware-response` + `building-ransomware-playbook-with-cisa-framework`. ATT&CK: T1486 (Data Encrypted for Impact), T1490 (Inhibit System Recovery), T1489 (Service Stop), T1567/T1041 (exfil for double-extortion), T1078. CSF: RS.MI, RC.RP.

Respond to: **$ARGUMENTS**

## Workflow
1. **Confirm & classify stage** — pre-encryption staging vs. active encryption vs. post-encryption. Identify the variant from the ransom note / file extension / leak-site claim if possible. Determine if it's **double extortion** (data exfiltrated before encryption — check for large outbound transfers, `rclone`/`mega`/cloud uploads → `T1567`).
2. **Contain FAST (active encryption = SEV1)** — isolate affected hosts via EDR (network-contain, don't power off if memory evidence matters — but stopping spread wins over forensics if encryption is live), disable affected accounts, block lateral paths (SMB, RDP, admin shares), segment networks, **protect backups** (verify immutability/offline copies are untouched — attackers target backups first, `T1490`).
3. **Preserve evidence** — capture a ransom note copy, sample encrypted files, memory image of one host, relevant logs, before remediation. Identify patient-zero and initial access (phish? exposed RDP/VPN? `T1133`?).
4. **Assess recovery options** — inventory clean/immutable backups, validate RPO, identify what can be restored vs. rebuilt. **Do not advise paying** — present it as a business/legal/insurance decision involving counsel + carrier + possible OFAC sanctions risk; CannaShield does not facilitate payment.
5. **Eradicate** — remove the actor's persistence and tooling, reset all credentials (assume domain-wide compromise), close the initial-access vector, patch.
6. **Recover** — staged restore from known-good backups into a clean/segmented environment, heightened monitoring (`DE.CM-01`), watch for re-encryption.
7. **Notifications** — IR lead + management; **cyber insurer + breach counsel early** (they often mandate their own IR firm); CT data-breach notification if PII exfiltrated; report to CISA/FBI IC3; for a licensed cannabis operator, assess DCP/license-impact notice if operations/reporting halted.

## Output
- **Situation report** — stage, variant, double-extortion Y/N, affected scope, ATT&CK IDs, initial-access hypothesis.
- **Immediate containment checklist** (with backup-protection step first-class).
- **Recovery plan** — backup inventory, restore order, validation, exit criteria.
- **Notification & legal/insurance checklist.**
- **Root-cause + hardening** to prevent recurrence (MFA, EDR, segmentation, immutable backups, patch).

Encryption-in-progress → containment outranks tidy forensics. Never recommend paying ransom; route that decision to counsel + carrier. Confirm backup integrity before declaring recoverable.
