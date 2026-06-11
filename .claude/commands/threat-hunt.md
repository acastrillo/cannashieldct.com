---
description: Run a hypothesis-driven threat hunt and produce queries + findings. Invoke for proactive hunts, post-incident sweeps, or testing detection coverage for a specific TTP.
argument-hint: <hunt focus: TTP, threat actor, asset, or "general sweep"> | <data sources available>
---

# Hypothesis-Driven Threat Hunt

> **Source:** wraps upstream `building-threat-hunt-hypothesis-framework` + `performing-threat-hunting-with-elastic-siem`. Structured on PEAK / TaHiTI. ATT&CK-anchored. CSF: DE.CM, DE.AE.

Hunt: **$ARGUMENTS**

## Workflow
1. **Form the hypothesis** — convert the focus into a testable statement: "If [actor/TTP] is present, then we'd observe [specific artifact] in [data source]." Ground it in an ATT&CK technique and the threat model (for cannabis clients, weight POS/identity/BEC; for the day job, follow the current threat intel).
2. **Define ABLE scope** — Actor, Behavior, Location (data sources/assets), Evidence. State which logs you have (EDR/Sysmon, Windows Security, M365 audit, DNS, proxy, firewall, cloud trail) and the time window.
3. **Build hunt queries** — for each hypothesis, write concrete detection logic. Provide both **Splunk SPL** and **KQL/Elastic** (and a Sigma rule when it generalizes). Examples of hunt themes and their techniques:
   - Anomalous PowerShell / encoded commands → `T1059.001`
   - LOLBins execution → `T1218`
   - Persistence: run keys / scheduled tasks / WMI subs → `T1547`, `T1053`, `T1546.003`
   - Lateral movement: WMI/DCOM/PsExec, NTLM relay → `T1021`
   - C2 beaconing (frequency analysis / long connections / rare ASN) → `T1071`, `T1571`
   - Data staging/exfil before encryption → `T1074`, `T1567`
   - Credential dumping → `T1003`
4. **Triage results** — for each hit: benign / suspicious / malicious, with the evidence. Pivot on confirmed-suspicious (host, user, time) to expand scope.
5. **Outcome** — findings, any incidents to escalate (→ `/ir-triage`), and **new detections to operationalize** (promote a successful hunt query to a standing alert; emit the Sigma rule).

## Output
- **Hunt plan**: hypothesis · ATT&CK technique(s) · data sources · time window.
- **Queries** (SPL + KQL, Sigma where applicable) — runnable, not pseudocode.
- **Findings table**: query · hits · verdict · evidence · pivot.
- **Recommendations**: escalations + detections to stand up + coverage gaps found (feeds `/mitre-map` coverage view).

Hypotheses must be falsifiable and ATT&CK-anchored. A hunt that finds nothing but yields a new detection is a success — capture it.
