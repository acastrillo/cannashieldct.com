# CannaShield Service / License Types

Maps a service/license code to its deliverable set and framework emphasis. The `LP-*` and `IQ-*`
codes are CannaShield **service packages**; the named codes (dispensary, cultivator, micro) are CT
**license types**. Definitions marked `[CONFIRM]` should be reconciled with Alex's actual SOW
language before billing — the scoping below is a sensible default, not gospel.

## Service packages

| Code | Name (working) | Deliverable set (sub-commands) | CSF emphasis | ATT&CK weighting |
|---|---|---|---|---|
| **LP-1** | Launch Package – Foundational `[CONFIRM]` | `/nist-csf-gap` (baseline), `/secpolicy-generator ISP+AUP` | GV, ID, PR | Identity/phishing: T1078, T1566 |
| **LP-2** | Launch Package – Full `[CONFIRM]` | `/nist-csf-gap`, `/secpolicy-generator ALL`, `/cannabis-pos-threat-model`, `/vendor-risk` | GV, ID, PR, DE, RS, RC | T1078, T1566, T1486, T1539, T1114 |
| **IQ-1** | Insurance Qualification `[CONFIRM]` | `/cyber-insurance-readiness`, `/nist-csf-gap` (control-mapped subset), `/secpolicy-generator IRP` | PR.AA, DE.CM, RS.MA, RC.RP | T1486, T1566, T1078 |

> If a client buys multiple packages, union the deliverable sets and dedupe.

## CT license types (drive regulatory scope via `/ct-cannabis-compliance`)

| Code | Scope notes | Adds to deliverable set | Cannabis-specific obligations |
|---|---|---|---|
| **dispensary** / **retailer** | Retail POS + customer PII + purchase-limit enforcement | `/cannabis-pos-threat-model`, `/ct-cannabis-compliance` | POS/METRC integrity, surveillance retention, purchase-limit controls |
| **cultivator** | Grow ops + METRC seed-to-sale + OT/IoT (environmental controls) | `/cannabis-pos-threat-model` (METRC focus), `/ct-cannabis-compliance` | METRC reporting integrity, physical/OT security, surveillance |
| **micro** (micro-cultivator) | Smaller footprint, same reporting duties | baseline + `/ct-cannabis-compliance` | METRC integrity, proportionate physical security |
| **producer** / **hybrid** | Combined cultivation + retail | union of dispensary + cultivator | Broadest scope: POS + OT + METRC + surveillance |

## How to use
1. Resolve the `service_type` to a row (package and/or license type — a client often has both, e.g.
   "LP-2 dispensary").
2. Union the deliverable sets.
3. Carry the CSF emphasis + ATT&CK weighting into `control-library.md` selection.
4. If the code isn't here, ask Alex to confirm scope before generating.
