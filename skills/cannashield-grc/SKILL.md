---
name: cannashield-grc
description: >-
  Generate a framework-mapped GRC engagement outline for a CannaShield cannabis client.
  Use this skill whenever the user wants to kick off, scope, or pre-populate a CannaShield
  GRC deliverable for a specific client and service/license type (LP-1, LP-2, IQ-1, dispensary,
  cultivator, micro, etc.) — including phrases like "spin up a GRC engagement for <client>",
  "scope a vCISO deliverable", "new CannaShield client", "build the assessment outline for
  <dispensary>", or "what controls apply to an LP-2". It produces a single engagement outline
  with the right sub-deliverables selected, NIST CSF 2.0 subcategories and MITRE ATT&CK
  techniques pre-populated, and a controls checklist tailored to the client's cannabis stack.
  Always use this for client GRC kickoff even if the user doesn't say "skill" — it is the
  force-multiplier that keeps solo-operator deliverables consistent and citation-credible.
---

# CannaShield GRC Engagement Builder

This skill turns two inputs — **client name** and **service/license type** — into a single,
consistent, framework-mapped GRC engagement outline that Alex (CannaShield vCISO) can execute
and hand to a client, their insurance broker, or their attorney.

It is the orchestration layer over the CannaShield GRC slash commands in `.claude/commands/`:
`/nist-csf-gap`, `/cannabis-pos-threat-model`, `/secpolicy-generator`, `/cyber-insurance-readiness`,
`/vendor-risk`, `/ct-cannabis-compliance`. The skill decides *which* of these apply for the service
type, then pre-populates the relevant controls so the engagement starts 80% scaffolded.

## Why it works this way
Solo-operator GRC lives or dies on consistency and credibility. Every deliverable must cite **real**
NIST CSF 2.0 subcategory IDs and **real** MITRE ATT&CK technique IDs — that's what makes the work
defensible to carriers and counsel. Hard-coding the right control set per service type removes the
two biggest solo risks: forgetting a sub-deliverable, and re-deriving the same control mappings from
scratch every engagement.

## Inputs
- **client** — the client/business name (required).
- **service_type** — one of the CannaShield service/license codes. Look it up in
  `references/service-types.md`. If the code isn't listed or its definition is uncertain, ask the
  user to confirm scope rather than guessing — these codes drive what gets billed and delivered.
- **stack** (optional but recommended) — the client's actual tech stack (POS, identity, edge, etc.).
  If omitted, assume the cannabis-SMB baseline in `references/control-library.md` and state the
  assumption at the top of the output.

## Workflow

1. **Resolve the service type.** Read `references/service-types.md` and find the row for `service_type`.
   That row gives you: the deliverable set (which sub-commands apply), the CSF Function emphasis, the
   ATT&CK weighting, and any cannabis-license-specific obligations. If the type is unknown, stop and
   confirm with the user.

2. **Pull the pre-populated control set.** Read `references/control-library.md`. Select the control
   rows relevant to the resolved deliverable set and the client's stack. These rows already carry the
   correct CSF subcategory IDs, mapped ATT&CK techniques, and the typical cannabis-stack control.

3. **Assemble the engagement outline** using the template in
   `assets/deliverable-outline-template.md`. Fill in client, service type, scope, the selected
   sub-deliverables, the pre-populated controls table, and the threat-model technique list.

4. **Tag follow-on commands.** For each sub-deliverable in scope, note the exact slash command that
   produces it (e.g. "→ run `/nist-csf-gap <client> | <stack>`") so the engagement is executable, not
   just descriptive.

5. **Write the deliverable** to `outputs/<client-slug>-grc-engagement-outline.md` (slugify the client
   name: lowercase, hyphens). Confirm the path back to the user. Never overwrite an existing client
   file without noting it.

## Output contract
The outline must be client-ready and include, in this order:
1. Engagement header (client, service type, date, scope, assumptions).
2. Selected sub-deliverables with their producing slash command.
3. Pre-populated controls table — columns `Domain | CSF Subcategory | Control | ATT&CK Technique | Status`.
4. Threat-model technique shortlist (real `Txxxx` IDs) relevant to the client's stack.
5. Insurance/regulatory crosswalk callouts.
6. Next actions (ordered command run list).

## Hard rules
- Cite only **real** CSF 2.0 subcategory IDs and MITRE ATT&CK technique IDs. If unsure an ID exists,
  flag it `[VERIFY]` rather than inventing one — a fabricated ID destroys credibility with a carrier.
- Statutory/regulatory references are drafting aids for Alex to verify, marked `[VERIFY]`; never
  present them to a client as legal conclusions.
- If `service_type` is ambiguous, ask before generating — wrong scope = wrong bill.
- Deliverables go to `outputs/`. The skill produces the *outline + pre-populated controls*; the
  individual slash commands produce the full deliverables.

## Reference files
- `references/service-types.md` — service/license code → deliverable set, CSF emphasis, ATT&CK weighting.
- `references/control-library.md` — pre-populated CSF 2.0 subcategories + ATT&CK + cannabis-stack controls.
- `assets/deliverable-outline-template.md` — the exact output template to fill in.
