# CannaShield Pre-Populated Control Library

Reusable control rows with **verified-format** NIST CSF 2.0 subcategory IDs and MITRE ATT&CK technique
IDs, mapped to typical cannabis-SMB controls. Select the rows relevant to the engagement's deliverable
set and the client's stack. These exist so every engagement starts from the same defensible mapping
instead of re-deriving IDs each time.

> CSF IDs below follow CSF 2.0 (Feb 2024): 6 Functions (GV, ID, PR, DE, RS, RC), 22 Categories.
> ATT&CK IDs are Enterprise techniques. Confirm any sub-technique `.xxx` form against ATT&CK before
> citing it in a final deliverable.

## Govern (GV)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| GV.OC-01 | Organizational mission & cannabis-license obligations documented | — |
| GV.RM-01 | Risk management strategy & risk appetite set | — |
| GV.RR-02 | Security roles/responsibilities assigned (even if outsourced to vCISO) | — |
| GV.PO-01 | Information security policy established & approved | — |
| GV.OV-01 | Governance oversight / annual review cadence | — |
| GV.SC-07 | Vendor/third-party security requirements & attestations tracked | T1195 (supply chain) |

## Identify (ID)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| ID.AM-01 | Hardware/POS terminal inventory | — |
| ID.AM-02 | Software/SaaS inventory (POS, METRC integrator, M365) | — |
| ID.AM-08 | No unsupported/EOL software in scope | T1190 |
| ID.RA-01 | Vulnerabilities identified & risk-rated | T1190, T1133 |

## Protect (PR)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| PR.AA-01 | MFA on email, remote, privileged access | T1078, T1556, T1621 |
| PR.AA-03 | Remote/VPN access authenticated & restricted | T1133, T1078 |
| PR.AA-05 | Least privilege; METRC/POS admin access restricted | T1078, T1098 |
| PR.AT-01 | Security awareness + phishing training (budtenders included) | T1566 |
| PR.DS-01 | Data-at-rest protection (customer PII, purchase-limit data) | T1005, T1530 |
| PR.DS-11 | Backups created, encrypted, immutable/offline | T1490, T1486 |
| PR.IR-01 | Network segmentation (POS VLAN isolated from guest/corp) | T1021, T1210 |
| PR.PS-05 | Patch & configuration management | T1190, T1203 |

## Detect (DE)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| DE.CM-01 | Endpoint + network monitoring (EDR, edge logs) | T1059, T1071 |
| DE.CM-09 | Identity/cloud audit logging (M365/Workspace) | T1114, T1098, T1564.008 |
| DE.AE-02 | Adverse events analyzed against threat intel | T1566, T1486 |
| DE.AE-06 | Event info shared / escalated to responders | — |

## Respond (RS)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| RS.MA-01 | Incident response plan executed | T1486, T1566 |
| RS.MA-05 | Post-incident lessons learned recorded | — |
| RS.AN-03 | Incident analyzed (root cause, scope) | — |
| RS.CO-02 | Incident reporting incl. breach-notice & regulator triggers | — |
| RS.MI-01/02 | Containment & mitigation executed | T1486, T1490 |

## Recover (RC)
| CSF Subcat | Control | ATT&CK relevance |
|---|---|---|
| RC.RP-01 | Recovery plan executed from known-good backups | T1486, T1490 |
| RC.RP-04 | Backup integrity validated before restore | T1490 |
| RC.CO-03 | Recovery status communicated to stakeholders | — |

## Cannabis-stack quick map (apply by component present)
| Component | Primary CSF subcats | Primary ATT&CK | Note |
|---|---|---|---|
| Dutchie/Treez/Flowhub POS | PR.IR-01, PR.DS-01, DE.CM-01 | T1078, T1539, T1005 | Isolate POS VLAN; protect purchase-limit/PII data |
| METRC integration | PR.AA-05, PR.DS-01, GV.SC-07 | T1078, T1098 | Token vaulting; reporting integrity = license risk |
| M365 / Google Workspace | PR.AA-01, DE.CM-09 | T1566, T1114, T1564.008 | MFA + conditional access + mailbox audit; BEC exposure |
| Cloudflare edge | PR.IR-01, DE.CM-01 | T1190, T1498 | WAF/bot evidence; edge logging |
| Cashless ATM / payments | PR.DS-01, ID.RA-01 | T1657 | Confirm PCI scope |
| Surveillance / IoT / OT (grow) | ID.AM-01, PR.IR-01 | T1200 | CT retention reqs; segment from corp/POS |
