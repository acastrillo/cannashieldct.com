# CannaShield — Founder / About copy pack

Built 2026-09-06 for Notion task **🛡️ [CS] Write About page with Alex's IR background + credentials** (P0).
Voice checked against 📋 CannaShield Brand & Positioning (rev. Aug 29, 2026) and 🎙️ CannaShield Voice Examples.
Channel = website, so explicit cannabis language is used deliberately.

Decisions locked with Alex before drafting: employer named by industry, not by name · both the homepage
section and a standalone `/about` route · all three claim-policy violations fixed in this pass ·
in-progress certifications shown and labeled.

---

## 1. Homepage — replacement for `#why-cannashield`

**Eyebrow:** WHY CANNASHIELD

**Headline:** Built by someone who does this work on a weekday.

**Body:**

> Alex Castrillo runs incident response in-house for a national identity and security company in New York City. Since 2023 that's meant live alerts, real evidence questions, and the part nobody puts in a brochure: deciding what actually happened and who needs to be told.
>
> CannaShield is that same discipline, sized for a licensed operator. A written security program. Evidence you can hand to a regulator, an underwriter, or an acquirer without a scramble. A decision path for the day the POS stops syncing and nobody's sure whether customer data moved.
>
> He hasn't worked a cannabis breach from the inside, and he won't claim otherwise. What he's done is read the STIIIZY notices the way an analyst reads them — vendor-caused, 380,000 people, identity documents in scope — and build the controls and evidence that make that kind of failure survivable here.

**Credential row (badges):**
`SSCP (ISC2)` · `Tines Expert Builder` · `NIST CSF 2.0 mapped` · `AWS Security Specialty — in progress` · `Connecticut-based`

**Founder card:**

> **Founder**
> **Alex Castrillo**
> Cyber incident response analyst · vCISO for Connecticut cannabis operators
>
> - Incident response analyst II, national identity & security company (NYC)
> - Responding to live security incidents since 2023
> - SSCP (ISC2) and Tines Expert Builder certified
> - AWS Security Specialty in progress
> - Builds NIST CSF 2.0 mapped programs for single-site and multi-site operators
> - Connecticut-based, remote-friendly

**CTA:** Read the full background → `/about`

---

## 2. `/about` — full page copy

**Page title (`<title>`):** About CannaShield — Alex Castrillo, Cannabis vCISO in Connecticut
**Meta description:** CannaShield is run by Alex Castrillo, a working cyber incident response analyst who builds security programs, control evidence, and incident readiness for licensed Connecticut cannabis operators.

---

### H1 — Who's actually doing the work

CannaShield is a practice, not a rebranded IT shop. One person's name is on it, and that's deliberate: the work is judgment work. Deciding what a finding means for your license, your renewal, and your Tuesday morning isn't something you can put in a ticket queue.

### H2 — Alex Castrillo, Founder

I do incident response for a living. In-house, for a national identity and security company in New York City, on a team that gets the alert before anyone outside the building knows there was one. Since 2023 that's been the job: figure out what happened, find out what evidence exists, decide who needs to be told, and do it while the clock is running.

Then I come home to Connecticut, where the operators I work with have the same exposure and almost none of the same resources.

That gap is the whole reason CannaShield exists. Nearly every licensed operator in this state has an MSP, and most of them are fine at what they're hired to do. What's missing is someone who owns the layer above it — what controls are expected, which ones are actually running, where the proof lives, which vendor owns each gap, and what leadership can truthfully say to DCP, an underwriter, or counsel when they ask.

### H2 — Credentials

**Certifications**

- **SSCP** — ISC2 Systems Security Certified Practitioner
- **Tines Expert Builder** — security automation and response workflow design
- **AWS Security Specialty** — in progress

**Practice areas**

- **SIEM and detection engineering** — writing, tuning, and triaging the rules that decide what gets escalated
- **Vulnerability management** — finding, prioritizing, and tracking exposure to closure rather than to a report
- **Incident response** — live investigation, evidence handling, and the reporting decision that follows
- **Cloud security** — posture, identity, and workload exposure in AWS environments
- **NIST CSF 2.0 program design** — the framework behind every program CannaShield builds and maps evidence to

Working practitioner since 2023. That's why CannaShield findings name the control and the system rather than stopping at "improve your security posture."

### H2 — What I don't claim

This section exists because the cannabis security market is full of people who will tell you anything. Here's the boundary:

- **I wasn't inside the STIIIZY breach.** I read the attorney general notices, the same as anyone can. What I bring is knowing how to read them.
- **I can't guarantee your license, your coverage, or your premium.** Nobody can. What I can build is the evidence that makes those conversations go better.
- **I'm not your lawyer, your broker, or your regulator.** When a question belongs to one of them, I'll say so and help you frame it.
- **I'm not replacing your MSP.** They own systems, uptime, and support. I own the program, the evidence, and the decisions.
- **No framework is required to hold a cannabis license in Connecticut.** Anyone telling you NIST or SOC 2 is mandated for licensure is selling you something. The obligations that do exist are narrower, and worth knowing exactly.

### H2 — Why a practitioner instead of a firm

Enterprise vCISO firms are real, and for a 400-person MSO they may be the right call. For a single-site or growing multi-site operator, they tend to arrive with a maturity model, leave a document set, and bill for the meetings in between.

What a working analyst brings is different. I've watched enough real incidents to know which findings actually change an outcome and which ones just fill a report. That shows up as shorter deliverables, fewer recommendations, and a roadmap you can finish.

It also means direct access. You get me, not a delivery pod.

### H2 — Where CannaShield works

Connecticut, primarily. The state's Department of Consumer Protection lists cyber events — including security and information breaches — among reportable events for licensed establishments, and CT-specific delivery is where the work is validated.

Operators in other states can still get value from an assessment, but out-of-state regulatory content is orientation, not a legal mapping, and I'll flag where local counsel needs to weigh in.

### H2 — Start somewhere small

The Cannabis Cyber Starter Assessment ($750) is a written exposure snapshot and a prioritized next step. Not a certification, not a retainer commitment — a clear picture of what's exposed and what to do first.

**[ Book the starter assessment ]** · **[ See all nine services ]**

---

## 3. JSON-LD for `/about`

Emit alongside the existing `BreadcrumbList`. Uses `ProfilePage` + `Person`, which is the structure AI assistants and Google both read for entity/authorship signals.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://cannashieldct.com/about#alex-castrillo",
    "name": "Alex Castrillo",
    "givenName": "Alex",
    "familyName": "Castrillo",
    "jobTitle": "Founder and Virtual Chief Information Security Officer",
    "description": "Working cyber incident response analyst and founder of CannaShield, building security programs, control evidence, and incident readiness for licensed Connecticut cannabis operators.",
    "url": "https://cannashieldct.com/about",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://cannashieldct.com/#organization",
      "name": "CannaShield",
      "url": "https://cannashieldct.com"
    },
    "knowsAbout": [
      "Cannabis cybersecurity",
      "Governance, risk, and compliance",
      "Incident response",
      "Security information and event management",
      "Detection engineering",
      "Vulnerability management",
      "Cloud security",
      "NIST Cybersecurity Framework 2.0",
      "Vendor risk management",
      "Cyber insurance readiness",
      "Connecticut cannabis regulation"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "Systems Security Certified Practitioner (SSCP)",
        "recognizedBy": { "@type": "Organization", "name": "ISC2" }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "Tines Expert Builder",
        "recognizedBy": { "@type": "Organization", "name": "Tines" }
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "CT",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.linkedin.com/in/acastrillo87"
    ]
  }
}
```

**Note:** `AWS Security Specialty (in progress)` is deliberately left out of `hasCredential`. Schema shouldn't assert a credential that isn't earned — keep it in the visible page copy only.

---

## 4. `/llms.txt` addition

Add under a new heading so assistants can resolve "who runs CannaShield" without crawling the homepage:

```
## About
- [About CannaShield — Alex Castrillo](https://cannashieldct.com/about): Founder background — working cyber incident response analyst since 2023, SSCP and Tines Expert Builder certified, builds NIST CSF 2.0 mapped programs for licensed Connecticut cannabis operators. Includes an explicit statement of what CannaShield does not claim.
```

---

## 5. Claim fixes — live copy that conflicts with your own policy

| Live copy | Problem | Replace with |
|---|---|---|
| "He's spent years inside breaches like the one that hit STIIIZY" | Reads as personal involvement in a named third-party incident. Brand doc: *never invent a personal experience.* Also unsupported by a 2023 start. **Highest exposure on the page.** | The homepage body in §1, which states the boundary outright. |
| "the same caliber of security leadership that Fortune 500s have" | Brand doc, §6: *do not claim Fortune 500 equivalence; sell relevance, clarity, and accountability.* | "Built for what a licensed operator actually has to answer for" — or the §1 body, which already carries this. |
| "Your MSP isn't watching for this. We are." | On the do-not-publish-without-precise-support list. Contradicts *partnership over antagonism.* | "Your MSP owns the systems. Someone still has to own the decisions." |

Two smaller ones while you're in there:

- **"Named. Dated. Documented."** — good line, keep it, but audit what sits under it. Per the answer library, Trulieve ransomware shouldn't be cited without a primary source, and MariMed is **$646,000, disclosed Nov 2023** (not 2024).
- **STIIIZY figure** — anywhere on the site still showing 420,000 should read **380,000 notified**, the company-reported figure.

---

## 6. Open items for Alex

All four resolved Sept 8, 2026. Copy is final.

1. ~~Employer phrasing~~ — **kept:** "a national identity and security company in New York City."
2. ~~LinkedIn slug~~ — **resolved:** `acastrillo87`, profile public. Live in the JSON-LD `sameAs`.
3. ~~RIT~~ — **removed entirely.** Coursework was not completed, so no education claim appears anywhere: the credentials list drops the line and the JSON-LD drops `alumniOf`. **Correct this on LinkedIn too if the profile still implies a completed degree** — a schema/profile mismatch is exactly what an entity resolver flags, and it's the same claim-policy exposure as the STIIIZY line.
4. ~~Named tooling~~ — **resolved:** framed as practice areas (SIEM and detection engineering, vulnerability management, incident response, cloud security), not vendor names. Keeps the credibility signal for the IT/MSP validator without publishing the employer's stack.
5. ~~AWS AI Practitioner~~ — **left off.** One in-progress cert reads as trajectory; two read as a study plan.
