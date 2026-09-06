import type { EditorialSource } from '@/lib/blog-editorial'

export type FaqItem = {
  question: string
  /** Answer body as HTML. Use <p>, <ul>/<li>, <strong> only. */
  answer: string
}

export type FaqRelatedLink = {
  label: string
  href: string
}

export type FaqPost = {
  slug: string
  title: string
  description: string
  category: string
  publishedDate: string
  reviewedDate: string
  readTime: string
  image: string
  imageAlt: string
  /** Two or three sentences that answer the title question directly. */
  answer: string
  takeaways: string[]
  faqs: FaqItem[]
  related: FaqRelatedLink[]
  sources: EditorialSource[]
}

const published = '2026-09-06'
const reviewed = '2026-09-06'

const scopeNote =
  'This page is practical cybersecurity and GRC guidance for licensed cannabis operators. It is not legal advice, and it does not claim that every recommended control is expressly required by a cannabis regulator. Confirm how each obligation applies to your business with counsel.'

export const FAQ_POSTS: FaqPost[] = [
  {
    slug: 'do-cannabis-companies-need-a-ciso',
    title: 'Do Cannabis Companies Need a CISO?',
    description:
      'Most licensed operators do not need a full-time CISO. They do need someone accountable for security decisions. Here is how to tell which one you are.',
    category: 'Security Leadership',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '7 min read',
    image: '/blog-assets/faq-do-cannabis-companies-need-a-ciso.png',
    imageAlt:
      'CannaShield answer page: do cannabis companies need a chief information security officer',
    answer:
      'Very few cannabis operators need a full-time CISO. Almost all of them need the CISO <em>function</em> — one named person who owns security decisions, vendor risk, incident escalation, and the evidence a regulator or underwriter will ask for. Below roughly $50M in revenue that role is usually filled by a fractional or virtual CISO rather than a salaried executive.',
    takeaways: [
      'The question is not "do we need a CISO." It is "who signs off when security and operations disagree."',
      'An MSP manages your IT. It does not own your risk decisions, and it will not sit across from your regulator.',
      'A full-time hire starts to make sense at multi-state scale, a large internal IT team, or investor and audit pressure that runs continuously rather than annually.',
    ],
    faqs: [
      {
        question: 'What does a CISO actually do that an IT provider does not?',
        answer: `<p>An MSP keeps systems running. A CISO decides what risk the business accepts, and documents why.</p>
<p>Those are different jobs, and the gap between them is where most operators get caught. Your MSP can tell you that MFA is enabled on 40 of 55 accounts. It cannot tell you whether the 15 without it are an acceptable risk given your license, your insurance policy language, and who those users are. It will not build the vendor register, run the tabletop, or decide the notification path when something goes wrong at 9pm on a Saturday.</p>
<p>The practical test: when your POS vendor emails to say they had a security incident, who reads it, decides what it means for you, and owns the response? If the honest answer is "we forward it to IT," you have an IT function and no security function.</p>`,
      },
      {
        question: 'At what size does a cannabis operator need dedicated security leadership?',
        answer: `<p>There is no revenue threshold in any regulation. There are practical trigger points, and most operators hit several at once:</p>
<ul>
<li>You hold retail customer data — names, dates of birth, ID scans, purchase history — in a system you do not directly control.</li>
<li>Your cyber insurance application started asking control-attestation questions you cannot answer from memory.</li>
<li>You are approaching license renewal, an expansion application, or investor diligence.</li>
<li>You run more than one location, or you have added a delivery, e-commerce, or loyalty platform.</li>
<li>Someone in finance can move money based on an email.</li>
</ul>
<p>Hit two of those and the informal arrangement is already failing. You just haven't been tested yet.</p>`,
      },
      {
        question: 'What is a virtual CISO (vCISO) and how is it different?',
        answer: `<p>A vCISO is the same accountability, bought by the month instead of by the salary. The person owns your security program, runs on a defined cadence, produces the written artifacts, and is the named contact when a regulator, broker, or counsel asks who is responsible.</p>
<p>What you give up is availability. A fractional engagement is a set number of hours, so the work is prioritized rather than infinite. What you gain is a practitioner who has handled incidents, at a fraction of the cost of a senior security hire — and no recruiting cycle for a role you would struggle to interview for.</p>`,
      },
      {
        question: 'Can our compliance officer just take on security?',
        answer: `<p>Partly, and it is often the right starting point — but understand the limits.</p>
<p>Your compliance officer already thinks in terms of evidence, retention, and regulator expectations. That is genuinely half the job, and it is the half most technical people are bad at. What they typically cannot do is evaluate whether a control works: whether the backup actually restores, whether the MFA method resists a real phishing kit, whether the vendor's SOC 2 covers the system you actually use.</p>
<p>The workable split is a compliance officer who owns the program internally, with outside technical judgment on call. What does not work is assigning the title and no time.</p>`,
      },
      {
        question: 'Does a cannabis regulator require us to name a security officer?',
        answer: `<p>Not as a universal rule, and you should be suspicious of anyone who tells you otherwise.</p>
<p>Connecticut's cannabis rules concentrate on physical security, inventory control, record integrity, and incident reporting. DCP policies treat certain security incidents as reportable events with tight clocks — a qualifying security breach must be reported no later than the next business day, and related record-loss or alteration events can carry immediate and 24-hour requirements. None of that names a CISO.</p>
<p>What it does is create obligations that need an owner. A next-business-day reporting duty is not something you can improvise. Somebody has to know it exists, know what triggers it, and be reachable.</p>`,
      },
      {
        question: 'How does this affect cyber insurance?',
        answer: `<p>Underwriters have gotten specific. Applications now ask whether MFA is enforced on email and remote access, whether endpoint detection is deployed, whether backups are tested and segregated, and whether there is a written incident response plan.</p>
<p>Those questions are warranties. An inaccurate answer can become a coverage argument at the worst possible moment — after a loss, when you need the policy to work. Someone has to be able to answer them accurately and produce the evidence behind each answer. That someone is functionally your CISO, whatever the business card says.</p>`,
      },
      {
        question: 'What does the CISO function cost at a small operator?',
        answer: `<p>A full-time security leader is a senior executive hire, plus recruiting, plus the tooling budget they will immediately ask for. That is not a realistic first move for a single-site dispensary or a small cultivator.</p>
<p>Fractional engagements are priced by scope and cadence rather than headcount. CannaShield publishes its own rates — a GRC Foundations retainer at $1,800/month, a one-week Cannabis Cyber Starter Assessment at $750 for operators who want a written picture before committing to anything ongoing. Those are our numbers, not an industry benchmark; use them as one reference point when you compare providers.</p>`,
      },
      {
        question: 'What is the smallest useful first step?',
        answer: `<p>Write down three things: who decides, what you would do in the first hour of an incident, and which vendors hold your data.</p>
<p>That is a single page. It will take an afternoon. It is also more security governance than most operators have, and it turns "we should look at security sometime" into a document someone can be handed. Everything else — framework alignment, control testing, evidence binders — builds on top of knowing who is accountable.</p>`,
      },
    ],
    related: [
      { label: 'License Protection: written security programs and audit-ready evidence', href: '/services/license-protection' },
      { label: 'What a GRC framework looks like for a cannabis company', href: '/blog/grc-framework-for-cannabis-companies' },
      { label: 'What a vCISO costs for a small cannabis business', href: '/blog/vciso-cost-for-a-small-cannabis-business' },
    ],
    sources: [
      {
        label: 'Cannabis policies and procedures guidance',
        publisher: 'Connecticut Department of Consumer Protection',
        url: 'https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures?language=en_US',
      },
      {
        label: 'NIST Cybersecurity Framework 2.0 (Govern function)',
        publisher: 'NIST',
        url: 'https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20',
      },
    ],
  },
  {
    slug: 'cybersecurity-requirements-for-dispensaries',
    title: 'What Are the Cybersecurity Requirements for a Dispensary?',
    description:
      'Dispensary cyber obligations come from three places at once — the cannabis regulator, general state data-protection law, and your own contracts. Here is how to tell them apart.',
    category: 'Compliance & Licensing',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-cybersecurity-requirements-for-dispensaries.png',
    imageAlt: 'CannaShield answer page: cybersecurity requirements for cannabis dispensaries',
    answer:
      'There is no single cannabis cybersecurity rulebook. A dispensary’s obligations stack from three independent sources: the cannabis regulator (physical security, record integrity, incident reporting), general state data-protection and breach-notification law, and private contracts — your payment processor, your insurer, your landlord, your investors. Most operators only look at the first one, which is why the other two produce the surprises.',
    takeaways: [
      'Cannabis regulations mostly govern records and incidents, not firewalls. The data-security duties usually come from general state law.',
      'Connecticut treats certain security incidents as reportable with a next-business-day clock — faster than most breach-notification statutes.',
      'Your contracts can impose stricter obligations than any regulator, and they are the ones with immediate financial teeth.',
    ],
    faqs: [
      {
        question: 'Does Connecticut have a cybersecurity rule specifically for cannabis licensees?',
        answer: `<p>Not a standalone cyber rule of the kind you would find in financial services. What Connecticut has is a set of obligations that add up to one.</p>
<p>DCP policies treat certain physical and cyber security incidents as reportable events. A qualifying security breach must be reported no later than the next business day, and related record-loss or alteration events can carry immediate and 24-hour requirements. Separately, the cannabis regulations govern the integrity and retention of licensee records and access to the state tracking system.</p>
<p>Read those together and you get a real requirement: you must be able to detect that something happened, determine whether it qualifies, and report inside a very short window. That is a security capability, even though the rule never uses the word.</p>`,
      },
      {
        question: 'Which general Connecticut laws apply to a dispensary?',
        answer: `<p>Three matter most, and none of them are cannabis-specific:</p>
<ul>
<li><strong>Conn. Gen. Stat. § 42-471</strong> requires any person in possession of another person's personal information to safeguard it from misuse. Broad, and it applies to you.</li>
<li><strong>Conn. Gen. Stat. § 36a-701b</strong> establishes breach-notification duties when covered personal information is involved, including notice to affected residents and to the Attorney General.</li>
<li><strong>The Connecticut Data Privacy Act</strong> adds controller-side privacy and security obligations — but only if you meet the applicability thresholds. Not every dispensary does. The July 1, 2026 expansion is worth a fresh look, because processing sensitive data outside payment-only transactions can pull a business into scope that previously sat outside it.</li>
</ul>`,
      },
      {
        question: 'Is a written information security program required?',
        answer: `<p>Connecticut does not impose a universal written-ISP mandate on cannabis licensees the way Massachusetts does under 201 CMR 17.00 for businesses handling Massachusetts residents' data.</p>
<p>That said, "reasonable safeguards" is the standard you will be measured against, and reasonableness is proved with documents. If you cannot show what you decided, when, and why, you are arguing from memory in a forum where memory carries no weight. A written program is how you make § 42-471 defensible rather than aspirational.</p>
<p>There is also a Connecticut-specific incentive: the state's cybersecurity safe harbor provisions can limit punitive damages for a qualifying business that maintained a written program conforming to a recognized framework. That is a legal analysis for counsel, not a checkbox — but it is a real reason the written program has value beyond tidiness.</p>`,
      },
      {
        question: 'Are NIST CSF or CIS Controls mandatory?',
        answer: `<p>No. Neither is a licensing requirement, and any consultant who tells you a framework is legally mandated for a cannabis license is selling something.</p>
<p>What they are is useful. NIST CSF 2.0 gives you a vocabulary and a structure — Govern, Identify, Protect, Detect, Respond, Recover — that maps cleanly onto the questions regulators and underwriters actually ask. CIS Controls v8.1 gives you a prioritized implementation order when you have limited hours and want to know what to do first. Alignment with a recognized framework also matters for the safe-harbor analysis mentioned above.</p>`,
      },
      {
        question: 'What about HIPAA for medical cannabis?',
        answer: `<p>Handling medical-cannabis patient information does not automatically make you a HIPAA covered entity. HIPAA status depends on whether you are a covered entity or business associate under federal law, which most retail dispensaries are not.</p>
<p>That is a narrower answer than most people expect, and it cuts both ways. You may not owe HIPAA duties — but Connecticut's own medical-cannabis record rules can still apply, and the data is exactly as sensitive either way. Patients do not care which statute protects their diagnosis. Neither will a plaintiff's attorney.</p>`,
      },
      {
        question: 'What do our contracts require that regulations do not?',
        answer: `<p>Usually more than the regulations, and with faster consequences.</p>
<ul>
<li><strong>Payment processing agreements</strong> obligate you to PCI DSS compliance if any card data touches your environment, and give the acquirer remedies including fees and termination.</li>
<li><strong>Cyber insurance applications</strong> contain control warranties. Answer "yes" to MFA everywhere when it is really MFA on most things, and you have created a coverage dispute for the day you need coverage.</li>
<li><strong>Vendor and franchise agreements</strong> frequently include security and notification clauses that flow down to you.</li>
</ul>
<p>A regulator might find you at renewal. A processor can terminate you next week.</p>`,
      },
      {
        question: 'What is the minimum control set for a single-site dispensary?',
        answer: `<p>Start with the eight controls that show up on nearly every insurance application and post-incident review:</p>
<ul>
<li>Phishing-resistant MFA on email and any remote access</li>
<li>MFA on POS and seed-to-sale system logins</li>
<li>Managed endpoint detection on every business computer, including the back office</li>
<li>A written information security program with a named owner</li>
<li>A vendor register listing who holds your data and what access they have</li>
<li>A documented incident response plan with the reporting clocks written into it</li>
<li>Annual role-based security awareness training, weighted toward whoever can move money</li>
<li>Encrypted backups, segregated from production, restore-tested in the last twelve months</li>
</ul>
<p>None of those is exotic. Together they cover most of what an underwriter asks and most of what actually goes wrong.</p>`,
      },
      {
        question: 'How do we prove any of this at renewal?',
        answer: `<p>Evidence, gathered as you go, in one place.</p>
<p>The failure pattern is predictable: the controls exist, but the proof is scattered across MSP tickets, vendor portals, and three people's inboxes. Then renewal lands and someone spends two weeks reconstructing a year of decisions.</p>
<p>Keep a running binder — policy documents with version dates, MFA and EDR coverage reports, backup restore-test results, the vendor register with review dates, training completion records, and a log of security decisions including the ones where you accepted a risk and said why. Accepted risks documented at the time read as governance. The same risks explained afterward read as negligence.</p>`,
      },
    ],
    related: [
      { label: 'Connecticut cannabis cybersecurity requirements: the full guide', href: '/resources/connecticut-cannabis-cybersecurity-requirements' },
      { label: 'Cannabis cybersecurity checklist for 2026', href: '/blog/cannabis-cybersecurity-checklist-2026' },
      { label: 'License Protection services', href: '/services/license-protection' },
    ],
    sources: [
      {
        label: 'Cannabis policies and procedures guidance',
        publisher: 'Connecticut Department of Consumer Protection',
        url: 'https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures?language=en_US',
      },
      {
        label: 'Conn. Gen. Stat. § 42-471, safeguarding personal information',
        publisher: 'Connecticut General Assembly',
        url: 'https://cga.ct.gov/current/pub/chap_747.htm',
      },
      {
        label: 'Conn. Gen. Stat. § 36a-701b, breach of security notification',
        publisher: 'Connecticut General Assembly',
        url: 'https://www.cga.ct.gov/current/pub/chap_669.htm',
      },
      {
        label: 'Connecticut cybersecurity safe harbor (Chapter 743jj)',
        publisher: 'Connecticut General Assembly',
        url: 'https://www.cga.ct.gov/2026/sup/chap_743jj.htm',
      },
      {
        label: 'The Connecticut Data Privacy Act',
        publisher: 'Connecticut Attorney General',
        url: 'https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act',
      },
    ],
  },
  {
    slug: 'how-cannabis-businesses-protect-customer-data',
    title: 'How Do Cannabis Businesses Protect Customer Data?',
    description:
      'Dispensary customer records combine government ID, date of birth, and purchase history in one place. Here is what protecting that actually requires.',
    category: 'Data Protection',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-how-cannabis-businesses-protect-customer-data.png',
    imageAlt: 'CannaShield answer page: how cannabis businesses protect customer data',
    answer:
      'The single highest-leverage move is collecting and keeping less. A dispensary that scans an ID to verify age and retains only the verification result has a far smaller problem than one storing ID images for years. After that: control who can reach the data, encrypt it, put MFA on every system that holds it, and know exactly which vendors have a copy.',
    takeaways: [
      'Cannabis retail data is unusually toxic — government ID, date of birth, medical status, and purchase history in a single record.',
      'The STIIIZY notice is the reference case: roughly 380,000 people notified, and the compromise ran through a point-of-sale vendor.',
      'Retention policy beats security tooling. Data you deleted cannot be stolen.',
    ],
    faqs: [
      {
        question: 'What customer data does a dispensary actually hold?',
        answer: `<p>More than most operators realize, because it accumulates across systems nobody audits together.</p>
<p>The STIIIZY breach notice is a useful inventory of what a cannabis retail record can contain: name, address, date of birth, age, driver's license number, passport number, photograph, signatures from government ID cards, medical cannabis cards, and transaction histories. Roughly 380,000 people were notified. The company said not all of that information was affected for every individual.</p>
<p>Read that list again and think about your own environment. Then add the loyalty platform, the delivery app, the SMS marketing tool, and the e-commerce menu. Each holds a slice.</p>`,
      },
      {
        question: 'Why is this data worse than typical retail data?',
        answer: `<p>Because of what it lets someone conclude, and because you cannot reissue it.</p>
<p>A stolen credit card gets cancelled in an afternoon. A driver's license number, date of birth, and ID photograph are useful to a fraudster for years. Combine those with purchase history at a cannabis retailer and you have a record that supports identity theft and, depending on the customer's employment, immigration status, custody situation, or professional licensing, real personal harm.</p>
<p>That combination is also what makes the litigation exposure disproportionate to the size of the business.</p>`,
      },
      {
        question: 'What does data minimization look like in practice?',
        answer: `<p>Four questions, asked about every field you collect:</p>
<ul>
<li>Do we need this to complete the sale or satisfy a regulation?</li>
<li>Do we need to <em>keep</em> it after the sale, or only to have checked it?</li>
<li>If we must keep it, for how long, and who enforces the deletion?</li>
<li>Does a second system get a copy, and does that copy expire too?</li>
</ul>
<p>The specific decision worth revisiting: ID scan images. Verifying age is required. Warehousing a photograph of every customer's license indefinitely usually is not, and it converts a routine compliance step into the most damaging thing in your environment. Confirm your state's retention requirements with counsel, then delete on schedule and make the deletion automatic rather than someone's quarterly chore.</p>`,
      },
      {
        question: 'Who inside the business should be able to see customer records?',
        answer: `<p>Far fewer people than currently can.</p>
<p>Most dispensary POS deployments start with a couple of role templates and drift. Budtenders end up with reporting access. A manager account gets shared during a busy weekend and never rotated. Former employees stay active for weeks because offboarding is a verbal process.</p>
<p>Fix the boring things first: named accounts for every person, no shared logins, roles that match what the job actually requires, MFA on every administrative account, and an offboarding checklist that includes POS, email, the seed-to-sale system, and every SaaS tool. Then review the access list quarterly and write down that you did.</p>`,
      },
      {
        question: 'How much of this depends on our vendors?',
        answer: `<p>Most of it, which is the uncomfortable part.</p>
<p>In the STIIIZY case, the compromise involved a vendor that provided point-of-sale processing services for certain retail locations. The operator's own controls were not the failure point, and the operator still owned the notification, the litigation, and the brand damage.</p>
<p>So the vendor register is not paperwork. For every service that touches customer data, record who owns the relationship, what data it holds, what access it has, when the contract renews, what security evidence you have seen and when, and what you would do if it went dark tomorrow. Prioritize anything connected to identity, POS, seed-to-sale, payments, or backups. CISA publishes a vendor risk template built for small and midsize businesses if you want a starting structure.</p>`,
      },
      {
        question: 'Is encryption enough?',
        answer: `<p>Encryption is necessary and frequently misunderstood.</p>
<p>Data encrypted at rest on a server does nothing if an attacker is logged in as a valid user — the application decrypts it for them, same as it does for you. Encryption defeats stolen disks and intercepted traffic. It does not defeat stolen credentials, which is how most of these incidents actually start.</p>
<p>Encryption does have one concrete legal effect worth knowing: under Connecticut's breach-notification analysis, whether covered data was encrypted can change the obligation. That is a reason to encrypt, not a reason to stop at encrypting.</p>`,
      },
      {
        question: 'What do we owe customers if their data is exposed?',
        answer: `<p>Under Conn. Gen. Stat. § 36a-701b, a breach involving covered personal information triggers notification duties to affected residents and to the Connecticut Attorney General, within statutory timeframes. The Attorney General's office publishes reporting guidance and a submission process.</p>
<p>Layered on top: DCP policies treat certain security incidents as separately reportable, potentially by the next business day. Those two clocks run independently. An operator who only knows about the breach-notification statute can be compliant with one obligation and late on the other.</p>`,
      },
      {
        question: 'Where should a small operator start this week?',
        answer: `<p>Two things, both of which take less than a day.</p>
<p>First, list every system that holds customer data — including the ones marketing set up without telling anyone. Second, find out how long your POS retains ID scans and whether you can shorten it.</p>
<p>That is not a security program. It is the first honest inventory most operators have ever had, and it usually surfaces at least one system nobody knew was still collecting.</p>`,
      },
    ],
    related: [
      { label: 'What happens when a cannabis company gets breached', href: '/blog/what-happens-when-a-cannabis-company-gets-breached' },
      { label: 'Protecting cannabis POS systems from attackers', href: '/blog/protecting-cannabis-pos-from-hackers' },
      { label: 'Run the free email security scorecard', href: '/cyber-check' },
    ],
    sources: [
      {
        label: 'STIIIZY notice of data breach',
        publisher: 'California Office of the Attorney General',
        url: 'https://oag.ca.gov/system/files/Stiiizy%20-%20Substitute%20Website%20Notice%20of%20Data%20Breach_Redacted.pdf',
      },
      {
        label: 'Reporting a data breach',
        publisher: 'Connecticut Attorney General',
        url: 'https://portal.ct.gov/ag/sections/privacy/reporting-a-data-breach',
      },
      {
        label: 'Vendor supply-chain risk template for SMBs',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/resources-tools/resources/operationalizing-vendor-scrm-template-smbs',
      },
    ],
  },
  {
    slug: 'pci-compliance-for-cannabis-dispensaries',
    title: 'Does PCI Compliance Apply to Cannabis Dispensaries?',
    description:
      'PCI DSS follows card data, not industries. Whether it applies to your dispensary depends on how you take payment — and the answer changes when a workaround disappears.',
    category: 'Payments & PCI',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-pci-compliance-for-cannabis-dispensaries.png',
    imageAlt: 'CannaShield answer page: PCI compliance for cannabis dispensaries',
    answer:
      'PCI DSS applies to any entity that stores, processes, or transmits cardholder data, or that could affect the security of the cardholder data environment. Industry is irrelevant. A cash-only dispensary is out of scope; the moment you run PIN debit, take cards for delivery or online orders, or accept them at an ancillary business, you are in — and your acquirer, not the PCI Council, decides how you have to prove it.',
    takeaways: [
      'Scope follows the card data. "We are cannabis so PCI does not apply" is not how the standard works.',
      'Validation requirements come from your acquirer or payment brand, not from PCI SSC.',
      'Payment workarounds are unstable. Mastercard halted cannabis debit purchases in 2023, and operators lost roughly 20% of in-store transactions overnight.',
    ],
    faqs: [
      {
        question: 'Who has to comply with PCI DSS?',
        answer: `<p>The PCI Security Standards Council's own language is the clearest test. PCI DSS applies to "entities that store, process, or transmit cardholder data and/or sensitive authentication data or could impact the security of the cardholder data environment," including merchants, processors, acquirers, issuers, and service providers.</p>
<p>There is no cannabis carve-out, because the standard was never written by industry. It follows the data.</p>`,
      },
      {
        question: 'Our dispensary is cash-only. Are we out of scope?',
        answer: `<p>For the retail floor, yes. For the business, check again before you answer.</p>
<p>Card data has a habit of appearing in places nobody mapped: a delivery service that takes payment online, an ancillary storefront selling non-cannabis goods, a ticketed event, an e-commerce site for merchandise, a phone order taken at the front desk and written on a sticky note. Any one of those brings a piece of your environment into scope.</p>
<p>Do the walk before you claim exemption. "Cash-only" is usually a description of the register, not of the company.</p>`,
      },
      {
        question: 'What about PIN debit and cashless ATM setups?',
        answer: `<p>Those are card transactions, and they carry card obligations.</p>
<p>They are also the least stable part of a dispensary's operation. When Mastercard moved in 2023 to halt cannabis purchases on its debit cards, retailers reported that Mastercard transactions had accounted for close to 20% of in-store volume, and they went back to directing customers to the ATM. More recent reporting describes the same pattern continuing as loosely coded merchant accounts get shut down without warning and funds are frozen while payroll waits.</p>
<p>The security lesson is a continuity lesson. If a payment method can disappear on a Tuesday, your cash-handling procedure, your queue plan, and your reconciliation process need to already exist.</p>`,
      },
      {
        question: 'Who decides what we have to do to prove compliance?',
        answer: `<p>Not the PCI Council. Its documentation is explicit: whether an entity must comply with or validate compliance to a PCI standard "is at the discretion of organizations that manage compliance programs, such as a payment brand, acquirer, or other entity."</p>
<p>In practice that means read your merchant agreement. It names your validation obligation — typically a Self-Assessment Questionnaire of a specific type, sometimes quarterly scanning by an approved vendor — and it sets the penalties. Two dispensaries with identical setups can owe different paperwork because they signed with different acquirers.</p>`,
      },
      {
        question: 'Which SAQ applies to us?',
        answer: `<p>It depends on how card data flows, and getting this wrong is the most common mistake.</p>
<p>The general shape: a merchant using a standalone, validated payment terminal with no electronic cardholder-data storage faces a much shorter questionnaire than one whose POS software touches card data or whose website accepts payment directly. Redirecting checkout to a hosted page reduces scope; embedding a payment form in your own page does not reduce it nearly as much as people assume.</p>
<p>Ask your acquirer to confirm the SAQ type in writing. Then have someone technical confirm the answer matches how your system actually works, because the sales engineer's diagram and the deployment are not always the same document.</p>`,
      },
      {
        question: 'What does PCI DSS v4.0.1 change for a small merchant?',
        answer: `<p>Version 4.x raised the floor in ways that reach small merchants, mostly around authentication and payment-page integrity.</p>
<p>The headline items: multi-factor authentication expectations for access into the cardholder data environment, stronger password requirements, and — for anyone with an e-commerce payment page — requirements to manage and monitor the scripts loaded on that page. That last one catches operators who never think of their website as in-scope, because a compromised marketing script on a checkout page is a card-skimming path.</p>`,
      },
      {
        question: 'What happens if we are non-compliant and something goes wrong?',
        answer: `<p>The consequences are contractual and they arrive faster than regulatory ones.</p>
<p>Depending on the agreement, an acquirer can impose fines, pass through forensic investigation costs, raise your rates, or terminate processing. For a cannabis operator, termination is the one that hurts, because replacing a processor in this industry is not a same-week exercise. There is also the state-law layer: a card-data compromise involving Connecticut residents triggers the breach-notification analysis under § 36a-701b independently of anything PCI-related.</p>`,
      },
      {
        question: 'What should we do first?',
        answer: `<p>Three steps, in order.</p>
<ul>
<li><strong>Map the flow.</strong> Draw every path a card number could travel through your business, including the ones that only happen occasionally. Most operators find at least one they forgot.</li>
<li><strong>Reduce it.</strong> Every system you can remove from that path is scope you never have to assess again. Point-to-point encrypted terminals and hosted checkout pages exist for this reason.</li>
<li><strong>Get the requirement in writing.</strong> Email your acquirer, ask which SAQ applies and what scanning is required, and file the reply where your renewal evidence lives.</li>
</ul>`,
      },
    ],
    related: [
      { label: 'Protecting cannabis POS systems from attackers', href: '/blog/protecting-cannabis-pos-from-hackers' },
      { label: 'Cybersecurity requirements for dispensaries', href: '/blog/cybersecurity-requirements-for-dispensaries' },
      { label: 'Downtime Prevention: incident response and resilience', href: '/services/downtime-prevention' },
    ],
    sources: [
      {
        label: 'PCI Data Security Standard overview and applicability',
        publisher: 'PCI Security Standards Council',
        url: 'https://www.pcisecuritystandards.org/standards/pci-dss/',
      },
      {
        label: 'More cash, more headaches for marijuana retailers after Mastercard ban',
        publisher: 'MJBizDaily',
        url: 'https://mjbizdaily.com/news/more-cash-more-headaches-for-marijuana-retailers-after-mastercard-ban/374700/',
      },
      {
        label: 'Conn. Gen. Stat. § 36a-701b, breach of security notification',
        publisher: 'Connecticut General Assembly',
        url: 'https://www.cga.ct.gov/current/pub/chap_669.htm',
      },
    ],
  },
  {
    slug: 'protecting-cannabis-pos-from-hackers',
    title: 'How Do You Protect a Cannabis POS System From Attackers?',
    description:
      'Your point-of-sale system is the one machine that can stop lawful sales, expose customer records, and break your state reporting at the same time. Here is how to defend it.',
    category: 'POS & Operational Technology',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-protecting-cannabis-pos-from-hackers.png',
    imageAlt: 'CannaShield answer page: protecting cannabis point-of-sale systems from hackers',
    answer:
      'Treat the POS as license-critical infrastructure, not as a cash register. That means MFA on every account that can reach it, a dedicated network segment, no general web browsing on POS hardware, disciplined patching of the terminals and the tablets, and a written manual-sales procedure for the day it is unavailable. Most POS compromises in this industry arrive through the vendor or through stolen credentials, not through the terminal itself.',
    takeaways: [
      'The POS holds customer identity data, drives your state reporting, and gates lawful sales. Few systems in any industry carry all three.',
      'A tracking-system outage in Pennsylvania forced dispensaries to turn away patients and close early — no attacker required.',
      'Segmentation and MFA do more for POS security than any product you can buy this quarter.',
    ],
    faqs: [
      {
        question: 'Why is a dispensary POS a bigger deal than a normal retail POS?',
        answer: `<p>Because it sits on three fault lines at once.</p>
<p>It holds identity data — the ID scan, the date of birth, sometimes the medical card. It feeds the state tracking system that makes each sale lawful and reportable. And it is the only way product legally moves out the door. A grocery store with a POS outage runs a manual line and reconciles later. A dispensary with a tracking outage may not be able to sell at all.</p>`,
      },
      {
        question: 'How do these systems actually get compromised?',
        answer: `<p>Rarely by someone attacking the terminal directly. The realistic paths, roughly in order:</p>
<ul>
<li><strong>The vendor.</strong> The STIIIZY notice describes a compromise involving a vendor that provided point-of-sale processing for certain retail locations — accounts at that organization were compromised by an organized cybercrime group. Roughly 380,000 people were notified.</li>
<li><strong>Stolen or shared credentials.</strong> A manager login that three people know, no MFA, reused elsewhere and already in a credential dump.</li>
<li><strong>The back-office computer.</strong> Same network, general web and email use, one malicious download away from being a foothold.</li>
<li><strong>Remote access left open.</strong> Support tooling installed during onboarding, never removed, never monitored.</li>
</ul>`,
      },
      {
        question: 'What does network segmentation mean for a dispensary?',
        answer: `<p>Keeping the machines that matter away from the machines that browse the internet.</p>
<p>Practically: POS terminals and payment devices on their own network segment. Guest and customer Wi-Fi completely separate, with no route to anything operational. Cameras, badge readers, and environmental controls on a third segment, because those devices are frequently unpatched and rarely monitored. The back-office computer that handles email and vendor invoices should not be able to reach a POS terminal at all.</p>
<p>This is a configuration change on equipment you already own. It costs an afternoon of your MSP's time and it is the highest-value thing on this page.</p>`,
      },
      {
        question: 'Does MFA on POS actually matter?',
        answer: `<p>Yes, and specifically on the accounts that can do damage — administrative logins, reporting access, anything that can modify inventory or export customer records.</p>
<p>Requiring a second factor on every budtender's shift login is friction with limited payoff. Requiring it on the manager account that can pull a customer list is where the value is. If your POS platform does not support MFA on administrative accounts, that is a real finding, and it belongs in your vendor review and your next contract conversation.</p>`,
      },
      {
        question: 'How do we handle patching on POS hardware and tablets?',
        answer: `<p>Deliberately, on a schedule, with an owner.</p>
<p>Dispensary floors run on tablets — and tablets are the devices most likely to be quietly running an OS version that stopped receiving security updates eighteen months ago. Inventory every device by model, OS version, and owner. Confirm which ones are still supported. Set a patch window that does not collide with your busiest hours, and get written confirmation from your POS vendor about which OS versions they support, because that constraint often drives the whole plan.</p>`,
      },
      {
        question: 'What is the plan when the POS or tracking system goes down?',
        answer: `<p>Written, printed, and rehearsed — because this happens without any attacker involved.</p>
<p>When MJ Freeway's Leaf Data Systems failed during a software update in Pennsylvania, dispensary staff could not enter received shipments, one retailer turned away hundreds of patients, cultivators could not create manifests, and stores closed early with significant lost sales. The company put the outage at about an hour and a half of sporadic downtime; the Philadelphia Inquirer reported dispensaries unable to sell for hours.</p>
<p>Your plan should answer: who declares the outage, what is the manual sales procedure and is it lawful in your state, who contacts the regulator and when, how transactions get reconciled into the tracking system afterward, and who tells customers. Print it. A plan stored only in the system that is down is not a plan.</p>`,
      },
      {
        question: 'How much of this can our POS vendor answer for us?',
        answer: `<p>Some of it, if you ask precisely.</p>
<p>Useful questions to send in writing: Does your platform support MFA on administrative accounts? Where is our data stored and who at your company can access it? What is your notification commitment to us after a security incident, in hours? What current security assurance can you provide, and what does its scope actually cover? Can we export our data if we leave?</p>
<p>File the answers. Vague replies are themselves an answer, and they belong in your vendor register with a review date.</p>`,
      },
      {
        question: 'What should we fix first?',
        answer: `<p>Segment the network, then turn on MFA for every administrative account, then write the outage procedure.</p>
<p>Those three take days rather than months, need no new budget in most cases, and address the paths that incidents actually take. Everything more sophisticated — monitoring, detection tuning, threat hunting — assumes these are already done.</p>`,
      },
    ],
    related: [
      { label: 'Does PCI compliance apply to your dispensary?', href: '/blog/pci-compliance-for-cannabis-dispensaries' },
      { label: 'What happens when a cannabis company gets breached', href: '/blog/what-happens-when-a-cannabis-company-gets-breached' },
      { label: 'Downtime Prevention: ransomware resilience and IR retainers', href: '/services/downtime-prevention' },
    ],
    sources: [
      {
        label: 'STIIIZY notice of data breach',
        publisher: 'California Office of the Attorney General',
        url: 'https://oag.ca.gov/system/files/Stiiizy%20-%20Substitute%20Website%20Notice%20of%20Data%20Breach_Redacted.pdf',
      },
      {
        label: 'MJ Freeway marijuana tracking software crashes in Pennsylvania',
        publisher: 'MJBizDaily',
        url: 'https://mjbizdaily.com/news/mj-freeway-marijuana-tracking-software-crashes-in-pennsylvania/163323/',
      },
      {
        label: 'CIS Critical Security Controls v8.1',
        publisher: 'Center for Internet Security',
        url: 'https://www.cisecurity.org/controls/v8-1',
      },
    ],
  },
  {
    slug: 'what-happens-when-a-cannabis-company-gets-breached',
    title: 'What Happens When a Cannabis Company Gets Breached?',
    description:
      'A walk through the first hour, the first week, and the year that follows — including the two Connecticut reporting clocks that run at the same time.',
    category: 'Incident Response',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '9 min read',
    image: '/blog-assets/faq-what-happens-when-a-cannabis-company-gets-breached.png',
    imageAlt: 'CannaShield answer page: what happens when a cannabis company gets breached',
    answer:
      'Two clocks start at once. Connecticut DCP policies can require a qualifying security breach to be reported by the next business day, while Conn. Gen. Stat. § 36a-701b drives notice to affected residents and the Attorney General on its own schedule. Meanwhile you are trying to keep selling. Operators who have not decided in advance who declares an incident and who calls counsel lose the first day to that question alone.',
    takeaways: [
      'The regulatory clock and the breach-notification clock are separate obligations with separate triggers.',
      'Call counsel before the forensic firm. Privilege is easier to establish at the start than to reconstruct later.',
      'MariMed disclosed a $646,000 loss from a single forged email with false banking instructions — no malware required.',
    ],
    faqs: [
      {
        question: 'What counts as a breach?',
        answer: `<p>Two different definitions apply to you, and they do not overlap neatly.</p>
<p>For state cannabis purposes, DCP policies treat certain physical and cyber security incidents as reportable events — a category that can include things that never touched personal data at all, such as loss or alteration of licensee records.</p>
<p>For breach-notification purposes, § 36a-701b turns on unauthorized access to covered personal information about Connecticut residents, with encryption status factoring into the analysis.</p>
<p>An event can trigger one, both, or neither. Deciding which is a legal determination, which is why counsel gets involved early rather than after you have already filed something.</p>`,
      },
      {
        question: 'What should happen in the first hour?',
        answer: `<p>Five things, and the order matters:</p>
<ul>
<li><strong>Someone declares it.</strong> A named person with the authority to say "this is an incident" and start the process. Without this, everyone waits for someone else.</li>
<li><strong>Preserve, don't wipe.</strong> The instinct to reimage the machine destroys the evidence you will need to determine what was accessed — which is the fact that drives every notification decision.</li>
<li><strong>Contain what you can safely contain.</strong> Disable compromised accounts, revoke sessions, isolate affected devices from the network.</li>
<li><strong>Call counsel.</strong> Before the forensic firm, so that the investigation can be structured appropriately from the start.</li>
<li><strong>Start the log.</strong> Times, decisions, who was told what. You will be asked to reconstruct this later, under pressure, by people with subpoena power.</li>
</ul>`,
      },
      {
        question: 'Do we have to tell the regulator before we know what happened?',
        answer: `<p>Often, yes — and this is the part that catches operators off guard.</p>
<p>A next-business-day reporting duty does not wait for your forensic report. You may be reporting that an incident occurred while the investigation is still in its first day. That is normal, and it is why the initial report should be accurate about what you know and honest about what you do not.</p>
<p>The failure mode is speculation. Reporting a preliminary scope that later turns out to be wrong in either direction creates its own problems. "We are investigating unauthorized access to X system and will supplement" is a complete and defensible report.</p>`,
      },
      {
        question: 'When do customers have to be notified?',
        answer: `<p>When the breach-notification analysis says so, on the statutory timeline in § 36a-701b, with notice also going to the Connecticut Attorney General. The Attorney General's office publishes reporting guidance and a submission process.</p>
<p>The practical bottleneck is almost never the drafting. It is determining <em>who</em> to notify — which requires knowing exactly which records were accessed, which requires forensics, which requires the evidence you preserved in hour one. Operators who reimaged the machine spend weeks trying to answer a question they made unanswerable.</p>`,
      },
      {
        question: 'What does business email compromise look like here?',
        answer: `<p>It looks like an ordinary Tuesday, which is the problem.</p>
<p>MariMed disclosed in a quarterly filing that it lost $646,000 after receiving a forged email containing false banking instructions — a Chase account number supplied for what appeared to be a legitimate term-loan payment. The company described it as "a very sophisticated, global fraud that we believe took months of planning," said it initially caught the problem, and reported that the bank later confirmed the funds had reached the fraudulent recipient's account.</p>
<p>No ransomware. No breached server. One email, one wire, and a public company disclosure. This is the most likely six-figure cyber loss a cannabis operator will experience, and the control that stops it is a callback procedure to a known-good phone number for every banking-detail change — not a security product.</p>`,
      },
      {
        question: 'Can a breach cost us our license?',
        answer: `<p>Be careful with this claim, including when you hear it from a vendor.</p>
<p>A data breach is not automatically a licensing violation. What creates licensing exposure is the surrounding conduct: failing to report a reportable incident inside the required window, being unable to produce required records, or an inability to demonstrate the controls your own policies say you maintain.</p>
<p>Framed correctly: the breach is a bad day. The unreported breach, or the breach you cannot explain because you have no records, is the license problem. That distinction should shape where you spend your preparation effort.</p>`,
      },
      {
        question: 'What does the year after look like?',
        answer: `<p>Longer and more expensive than the incident itself.</p>
<p>Expect some combination of: forensic and legal costs, notification and credit monitoring for affected individuals, regulator follow-up, insurance claim administration, class action exposure, and remediation work that got deferred for years and now has a deadline. The STIIIZY incident produced consumer class litigation in federal court following its January 2025 notifications.</p>
<p>Underwriters will also want to know what changed. A renewal after an incident goes better when you can show a remediation plan with dates and owners rather than a promise to do better.</p>`,
      },
      {
        question: 'What should we have ready before any of this happens?',
        answer: `<p>A one-page card, printed, in the manager's office and in your own wallet:</p>
<ul>
<li>Who declares an incident, and their mobile number</li>
<li>Counsel's after-hours number</li>
<li>Your cyber insurance carrier's incident hotline and the policy number — most policies require prompt notice and may require you to use panel vendors</li>
<li>Your IT or MSP escalation path</li>
<li>The DCP reporting contact and the next-business-day requirement, written out</li>
<li>Your POS and seed-to-sale vendor support lines</li>
</ul>
<p>Every item on that list is knowable today and unknowable at 11pm on a holiday weekend. CISA's ransomware guidance is a good structure for the fuller plan that sits behind the card.</p>`,
      },
    ],
    related: [
      { label: 'Connecticut cannabis cybersecurity requirements', href: '/resources/connecticut-cannabis-cybersecurity-requirements' },
      { label: 'How cannabis businesses protect customer data', href: '/blog/how-cannabis-businesses-protect-customer-data' },
      { label: 'Downtime Prevention: incident response retainers and BEC defense', href: '/services/downtime-prevention' },
    ],
    sources: [
      {
        label: 'Cannabis policies and procedures guidance',
        publisher: 'Connecticut Department of Consumer Protection',
        url: 'https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures?language=en_US',
      },
      {
        label: 'Reporting a data breach',
        publisher: 'Connecticut Attorney General',
        url: 'https://portal.ct.gov/ag/sections/privacy/reporting-a-data-breach',
      },
      {
        label: 'Marijuana MSO MariMed lost $646,000 in email fraud',
        publisher: 'MJBizDaily',
        url: 'https://mjbizdaily.com/marijuana-mso-marimed-lost-646000-in-email-fraud/',
      },
      {
        label: '#StopRansomware Guide',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/stopransomware/ransomware-guide',
      },
    ],
  },
  {
    slug: 'grc-framework-for-cannabis-companies',
    title: 'What GRC Framework Should a Cannabis Company Use?',
    description:
      'NIST CSF 2.0 for structure, CIS Controls v8.1 for sequencing. Here is how to combine them without turning your security program into a documentation project.',
    category: 'GRC & Frameworks',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-grc-framework-for-cannabis-companies.png',
    imageAlt: 'CannaShield answer page: GRC framework for cannabis companies',
    answer:
      'Use NIST CSF 2.0 as the organizing structure and CIS Controls v8.1 to decide what to do first. Neither is required for a cannabis license. What a framework buys you is a defensible way to show that your safeguards were chosen deliberately rather than assembled by whoever set up the network — which is the standard you will actually be judged against.',
    takeaways: [
      'No framework is mandated by a cannabis regulator. Adopting one is a business decision, not a compliance requirement.',
      'CSF 2.0 added Govern as a function, which is the part most small operators are missing entirely.',
      'Connecticut’s safe harbor provisions give framework alignment potential legal weight — worth a conversation with counsel.',
    ],
    faqs: [
      {
        question: 'What is GRC in plain terms?',
        answer: `<p>Governance is who decides. Risk is what you chose to accept and why. Compliance is what you can prove.</p>
<p>Most cannabis operators are reasonably good at compliance, because the industry trains you to document inventory and physical security. They are weak at governance and risk, because nobody ever assigned those. That imbalance is why an operator can have a thick binder and still be unable to answer "who approved letting the delivery vendor access customer records."</p>`,
      },
      {
        question: 'Why NIST CSF 2.0?',
        answer: `<p>Because it is free, well understood by insurers and counsel, and structured around six functions that map onto real questions: Govern, Identify, Protect, Detect, Respond, Recover.</p>
<p>The 2.0 revision added Govern as a top-level function, and that is the addition that matters most for a small operator. It covers roles and responsibilities, risk-management strategy, policy, and — importantly — supply chain risk management, which is where cannabis operators are most exposed. If your program has no Govern content, you have a set of tools rather than a program.</p>`,
      },
      {
        question: 'Where do CIS Controls fit?',
        answer: `<p>CSF tells you what categories of thing to have. CIS tells you what to do on Monday.</p>
<p>CIS Controls v8.1 is organized into Implementation Groups, with IG1 defined as basic cyber hygiene for organizations with limited resources and expertise. That is most cannabis operators, and IG1 is a realistic first-year target: asset and software inventory, secure configuration, account and access management, malware defenses, data recovery, and awareness training.</p>
<p>Run CSF as your reporting structure and CIS IG1 as your work queue. They coexist without conflict.</p>`,
      },
      {
        question: 'Do we need SOC 2 or ISO 27001?',
        answer: `<p>Almost certainly not, and pursuing one early is a common expensive mistake.</p>
<p>SOC 2 exists to give <em>your customers</em> assurance about controls at a service organization. If you are a dispensary, your customers are consumers who will never ask for a SOC 2 report. If you are a cannabis technology vendor selling to operators, the calculus flips — your buyers will ask, and it becomes a revenue question.</p>
<p>ISO 27001 is similar: valuable when a counterparty requires it, expensive theater when nobody does. Decide based on who is asking, not on which certificate looks most impressive.</p>`,
      },
      {
        question: 'How does framework alignment interact with Connecticut law?',
        answer: `<p>Connecticut's cybersecurity safe harbor provisions can limit punitive damages in certain tort actions for a business that created, maintained, and complied with a written cybersecurity program conforming to a recognized framework.</p>
<p>Whether your business qualifies, and whether your program actually conforms, is a legal analysis — one for counsel, not for a consultant and not for a vendor's marketing page. But it does mean framework alignment is not purely a best practice in Connecticut. There is a potential legal benefit attached, which changes the cost-benefit conversation.</p>`,
      },
      {
        question: 'How long does it take to stand up a program?',
        answer: `<p>A workable first pass takes about a quarter if someone owns it. Maturity takes longer, and honestly never quite finishes.</p>
<p>A realistic sequence: weeks one through three for scoping — asset inventory, data inventory, vendor register, and a current-state assessment against your chosen framework. Weeks four through eight for the written program, policies that reflect what you actually do, and the incident response plan with the reporting clocks written in. Weeks nine through twelve for the gaps that turned up, with owners and dates.</p>
<p>Then it becomes a cadence: quarterly access reviews, annual policy review, annual restore test, tabletop exercises, and vendor reviews on renewal.</p>`,
      },
      {
        question: 'How do we avoid ending up with a policy binder nobody follows?',
        answer: `<p>Write policies that describe what you do, then change what you do — not the reverse.</p>
<p>Downloaded templates fail because they describe a company you are not. A policy stating that access reviews occur monthly, when they have never occurred, is worse than no policy: it is a documented gap between your stated controls and your actual ones, and it will be read aloud to you at the worst possible time.</p>
<p>Start with an accurate description of current practice, including the parts you are not proud of. Then improve one thing per quarter and update the document when it changes. Short and true beats comprehensive and fictional.</p>`,
      },
      {
        question: 'What evidence should the program produce?',
        answer: `<p>Artifacts with dates on them, filed where you can find them under pressure:</p>
<ul>
<li>Current-state assessment against the framework, with the assessment date</li>
<li>Written information security program and policies, versioned</li>
<li>Asset, data, and vendor inventories with review dates</li>
<li>MFA and endpoint coverage reports</li>
<li>Backup restore-test results, not just backup success logs</li>
<li>Training completion records</li>
<li>Incident response plan plus notes from at least one tabletop</li>
<li>A risk register, including accepted risks with the name of who accepted them</li>
</ul>
<p>That last item does the most work. A documented, deliberately accepted risk reads as governance. The same risk explained after an incident reads as something else entirely.</p>`,
      },
    ],
    related: [
      { label: 'Do cannabis companies need a CISO?', href: '/blog/do-cannabis-companies-need-a-ciso' },
      { label: 'Cannabis cybersecurity checklist for 2026', href: '/blog/cannabis-cybersecurity-checklist-2026' },
      { label: 'License Protection: GRC foundations and audit evidence', href: '/services/license-protection' },
    ],
    sources: [
      {
        label: 'NIST Cybersecurity Framework 2.0',
        publisher: 'NIST',
        url: 'https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20',
      },
      {
        label: 'CIS Critical Security Controls v8.1',
        publisher: 'Center for Internet Security',
        url: 'https://www.cisecurity.org/controls/v8-1',
      },
      {
        label: 'Connecticut cybersecurity safe harbor (Chapter 743jj)',
        publisher: 'Connecticut General Assembly',
        url: 'https://www.cga.ct.gov/2026/sup/chap_743jj.htm',
      },
    ],
  },
  {
    slug: 'cannabis-cybersecurity-checklist-2026',
    title: 'Cannabis Cybersecurity Checklist for 2026',
    description:
      'Twelve controls, ordered by what actually prevents loss, with the evidence each one should produce. Built for operators who have limited hours and need to spend them well.',
    category: 'GRC & Frameworks',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '9 min read',
    image: '/blog-assets/faq-cannabis-cybersecurity-checklist-2026.png',
    imageAlt: 'CannaShield answer page: cannabis cybersecurity checklist for 2026',
    answer:
      'If you do nothing else this year: enforce phishing-resistant MFA on email and remote access, put a callback procedure on every banking-detail change, segment the POS network, and test a restore. Those four address the losses that actually happen to cannabis operators. The rest of this checklist is the program you build around them.',
    takeaways: [
      'Ordered by expected loss prevented per hour spent, not by framework numbering.',
      'Every item names the evidence it should produce — because the control and the proof are different deliverables.',
      'Items 1 through 4 are a weekend. Items 5 through 12 are the rest of the year.',
    ],
    faqs: [
      {
        question: '1. Phishing-resistant MFA on email and remote access',
        answer: `<p>Email is where the money is lost. Enforce MFA on every mailbox, with no exceptions for executives — the exception list is the target list.</p>
<p>Prefer app-based or hardware authenticators over SMS. Modern phishing kits proxy one-time codes in real time, so a text message is meaningfully weaker than a passkey or security key. Do not forget service accounts, shared mailboxes, and the VPN.</p>
<p><strong>Evidence:</strong> a coverage report showing enrolled accounts versus total accounts, dated, with any exceptions named and justified.</p>`,
      },
      {
        question: '2. A callback rule for every banking-detail change',
        answer: `<p>The single highest-value procedural control in this industry, and it costs nothing.</p>
<p>Any request to change payment instructions — vendor, payroll, loan, anything — gets verified by phone to a number already on file, never a number in the email. Two-person approval above a dollar threshold you set. Write it down, train finance on it, and make it acceptable to slow a payment down.</p>
<p>MariMed disclosed a $646,000 loss to a forged email containing false banking instructions. A callback would likely have caught it.</p>
<p><strong>Evidence:</strong> the written procedure, training records for anyone who can initiate payments, and a log of verifications performed.</p>`,
      },
      {
        question: '3. Network segmentation for POS and operational technology',
        answer: `<p>POS and payment devices on their own segment. Guest Wi-Fi fully isolated. Cameras, badge readers, and environmental controls separated from both. The back-office computer that reads email should not be able to reach a POS terminal.</p>
<p>This is configuration work on hardware you already own, and it limits how far any single compromise can travel.</p>
<p><strong>Evidence:</strong> a current network diagram with segments labeled, plus firewall rules reviewed and dated.</p>`,
      },
      {
        question: '4. Backups that have actually been restored',
        answer: `<p>A backup job that reports success is not a tested backup. Restore something real — a POS database, a file share, a mailbox — and time it.</p>
<p>Backups need to be encrypted, segregated from production, and protected against deletion by whoever compromises production. Backup administration should use separate credentials with strong MFA, because attackers go for the recovery path first.</p>
<p><strong>Evidence:</strong> a restore test record with date, what was restored, elapsed time, and problems encountered.</p>`,
      },
      {
        question: '5. Endpoint detection on every business computer',
        answer: `<p>Managed EDR on every machine, including the back-office desktop everyone forgets and the manager's laptop that goes home.</p>
<p>Consumer antivirus is not the same product category, and underwriters increasingly know the difference. Someone also has to be responsible for looking at the alerts — a tool nobody monitors is a subscription, not a control.</p>
<p><strong>Evidence:</strong> device coverage report against your asset inventory, with the gap explained.</p>`,
      },
      {
        question: '6. An asset and data inventory that reflects reality',
        answer: `<p>You cannot protect what nobody has listed. Two inventories: devices, and the systems holding customer or regulated data.</p>
<p>The second one always surprises people. The loyalty platform, the SMS marketing tool, the delivery app, the abandoned e-commerce menu still collecting form submissions — each holds a slice of customer data, and at least one of them was set up by someone who has since left.</p>
<p><strong>Evidence:</strong> both inventories, with an owner and a last-reviewed date.</p>`,
      },
      {
        question: '7. A vendor register with security evidence attached',
        answer: `<p>For every vendor touching regulated, personal, financial, or operational data: owner, data handled, access level, contract renewal date, security evidence reviewed and when, and the recovery dependency if they go dark.</p>
<p>Prioritize identity, POS, seed-to-sale, payments, and backups. The STIIIZY incident ran through a point-of-sale vendor, and the operator still owned the notification and the litigation. CISA publishes a template built for small and midsize businesses.</p>
<p><strong>Evidence:</strong> the register itself, plus dated review notes.</p>`,
      },
      {
        question: '8. Access reviews and real offboarding',
        answer: `<p>Named accounts for everyone. No shared manager logins. A quarterly review of who can reach POS, seed-to-sale, email, banking, and administrative consoles.</p>
<p>Offboarding needs to be a checklist, not a conversation — POS, email, tracking system, every SaaS tool, VPN, and physical access, same day. The gap between "left the company" and "account disabled" is measured in weeks at most operators.</p>
<p><strong>Evidence:</strong> quarterly access review records and completed offboarding checklists.</p>`,
      },
      {
        question: '9. A written information security program',
        answer: `<p>Short and accurate beats long and aspirational. Describe what you actually do, name owners, and version it.</p>
<p>In Connecticut this has a second dimension: the state's safe harbor provisions can limit punitive damages for a qualifying business maintaining a written program conforming to a recognized framework. Whether you qualify is a question for counsel — but it changes the value of writing the thing down.</p>
<p><strong>Evidence:</strong> the program document with a version history and an annual review date.</p>`,
      },
      {
        question: '10. An incident response plan with the reporting clocks in it',
        answer: `<p>Not a generic template. Yours, naming your people, with Connecticut's clocks written into the text: DCP policies can require reporting a qualifying security breach by the next business day, with immediate and 24-hour requirements attached to certain record-loss events, while § 36a-701b drives resident and Attorney General notice separately.</p>
<p>Print the one-page contact card. Run one tabletop a year — two hours, around a conference table, no technology required.</p>
<p><strong>Evidence:</strong> the plan, the printed card, and tabletop notes with the gaps it revealed.</p>`,
      },
      {
        question: '11. Role-based security awareness training',
        answer: `<p>Annual training for everyone, weighted heavily toward whoever can move money or access customer records. Budtenders need a different twenty minutes than the controller does.</p>
<p>Phishing simulation is useful if you use it to find where you need better procedures rather than to punish individuals. A high click rate on a wire-fraud lure is a finance-process finding, not a personnel one.</p>
<p><strong>Evidence:</strong> completion records by role and date.</p>`,
      },
      {
        question: '12. Patch discipline, including the tablets',
        answer: `<p>Inventory every device by model and OS version. Confirm what is still supported. Set patch windows around your busiest hours and document exceptions with a reason and a review date.</p>
<p>Dispensary floor tablets are the usual weak point — frequently running an OS version that stopped getting security updates, frequently constrained by what the POS vendor supports. Get the vendor's supported-version statement in writing so the constraint is documented rather than assumed.</p>
<p><strong>Evidence:</strong> a device inventory with OS versions and a patch exception log.</p>`,
      },
      {
        question: 'What if we can only do four of these?',
        answer: `<p>Do items 1, 2, 3, and 4, in that order.</p>
<p>MFA and the callback rule address the two ways cannabis operators most often lose real money. Segmentation limits the blast radius of everything else. A tested restore is the difference between a bad week and a closed business. Together they are perhaps a weekend of work plus a conversation with your MSP.</p>
<p>The other eight are how you turn four controls into something you can prove at renewal — but they are worth less than nothing if the first four are missing.</p>`,
      },
    ],
    related: [
      { label: 'What GRC framework should a cannabis company use?', href: '/blog/grc-framework-for-cannabis-companies' },
      { label: 'Cybersecurity requirements for dispensaries', href: '/blog/cybersecurity-requirements-for-dispensaries' },
      { label: 'Run the free email security scorecard', href: '/cyber-check' },
    ],
    sources: [
      {
        label: 'CIS Critical Security Controls v8.1',
        publisher: 'Center for Internet Security',
        url: 'https://www.cisecurity.org/controls/v8-1',
      },
      {
        label: '#StopRansomware Guide',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/stopransomware/ransomware-guide',
      },
      {
        label: 'Vendor supply-chain risk template for SMBs',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/resources-tools/resources/operationalizing-vendor-scrm-template-smbs',
      },
      {
        label: 'Marijuana MSO MariMed lost $646,000 in email fraud',
        publisher: 'MJBizDaily',
        url: 'https://mjbizdaily.com/marijuana-mso-marimed-lost-646000-in-email-fraud/',
      },
    ],
  },
  {
    slug: 'state-cannabis-data-privacy-requirements-by-state',
    title: 'Cannabis Data Privacy Requirements by State',
    description:
      'A method for reading any state’s obligations, plus what applies in Connecticut, New York, Massachusetts, New Jersey, and Illinois. Verify the details with counsel before you rely on them.',
    category: 'Compliance & Licensing',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '9 min read',
    image: '/blog-assets/faq-state-cannabis-data-privacy-requirements-by-state.png',
    imageAlt: 'CannaShield answer page: state cannabis data privacy requirements by state',
    answer:
      'Every state stacks three layers: what the cannabis regulator requires, what general state data-security and breach-notification law requires, and whether a comprehensive consumer privacy statute applies to you. The cannabis layer is usually the thinnest of the three on data security. Operators who read only their license conditions miss most of their actual obligations.',
    takeaways: [
      'Read three layers per state, in this order: cannabis regulator, general data-security and breach law, consumer privacy statute.',
      'Massachusetts and Illinois are the outliers — 201 CMR 17.00 and BIPA both create obligations well beyond the norm.',
      'CannaShield practices in Connecticut. Treat the other state summaries here as orientation and confirm specifics with local counsel.',
    ],
    faqs: [
      {
        question: 'Why is there no single cannabis privacy standard?',
        answer: `<p>Because cannabis is regulated state by state, and data privacy is regulated state by state, and the two systems were built by different people for different reasons.</p>
<p>Cannabis regulators came out of the alcohol and pharmacy tradition. Their rules are about product diversion, physical premises, inventory reconciliation, and record retention. Data security shows up mostly as record integrity and incident reporting. Meanwhile the consumer-privacy statutes were written for adtech and data brokers, and apply to you only if you cross their thresholds.</p>
<p>Nobody harmonized them. So you read both.</p>`,
      },
      {
        question: 'What are the three layers, exactly?',
        answer: `<ul>
<li><strong>Layer one — the cannabis regulator.</strong> Record integrity and retention, tracking-system access controls, incident reporting duties and their deadlines, and any conditions written into your specific license.</li>
<li><strong>Layer two — general data-security and breach law.</strong> The duty to safeguard personal information, and the duty to notify when it is compromised. This applies to you as a business, not as a cannabis business, and it is where most real obligation lives.</li>
<li><strong>Layer three — comprehensive consumer privacy statutes.</strong> Applicability thresholds based on the number of consumers whose data you process, or on revenue from selling data. Many single-site operators fall outside; multi-state operators frequently do not.</li>
</ul>
<p>Then add the contractual layer — processor agreements, insurance warranties — which is not law but binds you just as tightly.</p>`,
      },
      {
        question: 'Connecticut',
        answer: `<p><strong>Cannabis layer:</strong> DCP policies treat certain physical and cyber security incidents as reportable events, with a qualifying security breach reportable no later than the next business day and immediate or 24-hour requirements attached to certain record-loss or alteration events. Licensee record integrity and retention rules sit in the RCSA cannabis regulations.</p>
<p><strong>General law:</strong> Conn. Gen. Stat. § 42-471 requires safeguarding personal information in your possession. Section 36a-701b establishes breach-notification duties, including notice to the Attorney General.</p>
<p><strong>Privacy statute:</strong> the CTDPA applies based on statutory thresholds — not every dispensary is in scope. The July 1, 2026 expansion is worth re-checking, because processing sensitive data outside payment-only transactions can bring a business into scope.</p>
<p><strong>Distinctive:</strong> Connecticut's cybersecurity safe harbor can limit punitive damages for a qualifying business with a written program conforming to a recognized framework.</p>`,
      },
      {
        question: 'New York',
        answer: `<p><strong>Cannabis layer:</strong> the Marihuana Regulation and Taxation Act and Office of Cannabis Management licensing conditions.</p>
<p><strong>General law:</strong> the SHIELD Act, N.Y. Gen. Bus. Law § 899-bb, requires businesses holding private information of New York residents to maintain reasonable administrative, technical, and physical safeguards — with the statute describing what "reasonable" can look like and scaling expectations to the size and complexity of the business. Section 899-aa carries the breach-notification duty.</p>
<p><strong>Privacy statute:</strong> New York has no comprehensive consumer privacy law of the CTDPA type as of this review date. The SHIELD Act does most of the work.</p>
<p><strong>Practical read:</strong> a New York operator can generally satisfy the reasonable-safeguards standard by implementing and documenting the same control set described in our checklist — the statute is unusually explicit about what it expects.</p>`,
      },
      {
        question: 'Massachusetts',
        answer: `<p><strong>Cannabis layer:</strong> Cannabis Control Commission licensing and operational requirements.</p>
<p><strong>General law:</strong> 201 CMR 17.00 is the outlier. It requires a comprehensive <em>written</em> information security program for any business that owns or licenses personal information about a Massachusetts resident, with specific elements — a designated program coordinator, risk assessment, employee training, third-party service provider oversight with contractual security requirements, and encryption of personal information on portable devices and transmitted across public networks. M.G.L. c. 93H governs breach notice.</p>
<p><strong>Why it matters beyond Massachusetts:</strong> the standard follows the resident, not the business location. A Connecticut dispensary near the border with Massachusetts customers in its loyalty database should look at this carefully.</p>`,
      },
      {
        question: 'New Jersey',
        answer: `<p><strong>Cannabis layer:</strong> Cannabis Regulatory Commission rules and license conditions.</p>
<p><strong>General law:</strong> New Jersey's breach-notification statute requires disclosure to affected customers and notification to the State Police before customer notice — an unusual sequencing requirement that catches out-of-state counsel.</p>
<p><strong>Privacy statute:</strong> the New Jersey Data Privacy Act took effect January 15, 2025, adding controller obligations for businesses meeting its thresholds, including data protection assessments for higher-risk processing. The Division of Consumer Affairs publishes an FAQ.</p>`,
      },
      {
        question: 'Illinois',
        answer: `<p><strong>Cannabis layer:</strong> the Cannabis Regulation and Tax Act, administered across IDFPR and the Department of Agriculture depending on license type.</p>
<p><strong>General law:</strong> the Personal Information Protection Act, 815 ILCS 530, covers data security and breach notice.</p>
<p><strong>The one that matters most:</strong> the Biometric Information Privacy Act, 740 ILCS 14. BIPA requires written notice and written consent before collecting biometric identifiers, a published retention and destruction schedule, and it carries a private right of action. For dispensaries this reaches employee fingerprint timeclocks and, depending on the technology and how it is deployed, certain ID-verification systems. It has produced substantial litigation.</p>
<p><strong>Practical read:</strong> if you operate in Illinois, get a legal opinion on every system that processes a face, fingerprint, or scan before you deploy it — not after.</p>`,
      },
      {
        question: 'How should a multi-state operator handle this?',
        answer: `<p>Build to the strictest standard you touch, then document the state-specific deltas.</p>
<p>Running five different security programs across five states is how MSOs end up with five different sets of gaps. Instead: one program built to satisfy the toughest applicable requirement — in practice usually Massachusetts on written-program elements and Illinois on biometrics — plus a short appendix per state covering reporting deadlines, notification contacts, and any license-specific conditions.</p>
<p>The appendix is what your incident responder reads at 2am. Keep it to a page per state.</p>`,
      },
      {
        question: 'How current is this, and what should we verify?',
        answer: `<p>This page was reviewed on the date shown at the top, and state privacy law changes faster than almost any other area of regulation. Amendments, new effective dates, and regulator guidance all land regularly.</p>
<p>Verify with counsel licensed in each state before relying on any of it — particularly applicability thresholds, notification deadlines, and anything in Illinois involving biometrics. CannaShield practices in Connecticut; the other summaries here are orientation for operators deciding where to focus legal spend, not a substitute for that spend.</p>`,
      },
    ],
    related: [
      { label: 'Connecticut cannabis cybersecurity requirements: the full guide', href: '/resources/connecticut-cannabis-cybersecurity-requirements' },
      { label: 'How cannabis businesses protect customer data', href: '/blog/how-cannabis-businesses-protect-customer-data' },
      { label: 'License Protection services', href: '/services/license-protection' },
    ],
    sources: [
      {
        label: 'Conn. Gen. Stat. § 42-471, safeguarding personal information',
        publisher: 'Connecticut General Assembly',
        url: 'https://cga.ct.gov/current/pub/chap_747.htm',
      },
      {
        label: 'The Connecticut Data Privacy Act',
        publisher: 'Connecticut Attorney General',
        url: 'https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act',
      },
      {
        label: 'SHIELD Act guidance',
        publisher: 'New York Attorney General',
        url: 'https://ag.ny.gov/resources/organizations/data-breach-reporting/shield-act',
      },
      {
        label: '201 CMR 17.00: Standards for the protection of personal information',
        publisher: 'Commonwealth of Massachusetts',
        url: 'https://www.mass.gov/regulations/201-CMR-1700-standards-for-the-protection-of-personal-information-of-residents-of-the-commonwealth',
      },
      {
        label: 'New Jersey Data Privacy Law FAQs',
        publisher: 'New Jersey Division of Consumer Affairs',
        url: 'https://www.njconsumeraffairs.gov/ocp/Pages/NJ-Data-Privacy-Law-FAQ.aspx',
      },
      {
        label: 'N.J.S.A. 56:8-163, disclosure of breach of security to customers',
        publisher: 'New Jersey Revised Statutes',
        url: 'https://law.justia.com/codes/new-jersey/title-56/section-56-8-163/',
      },
      {
        label: 'Biometric Information Privacy Act, 740 ILCS 14',
        publisher: 'Illinois General Assembly',
        url: 'https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3004&ChapterID=57',
      },
    ],
  },
  {
    slug: 'vciso-cost-for-a-small-cannabis-business',
    title: 'What Does a vCISO Cost for a Small Cannabis Business?',
    description:
      'What drives the price, which engagement models exist, what should be included, and how to tell a real vCISO engagement from a policy-template subscription.',
    category: 'Security Leadership',
    publishedDate: published,
    reviewedDate: reviewed,
    readTime: '8 min read',
    image: '/blog-assets/faq-vciso-cost-for-a-small-cannabis-business.png',
    imageAlt: 'CannaShield answer page: what a vCISO costs for a small cannabis business',
    answer:
      'Fractional security leadership is priced by scope and cadence, not headcount, and it splits into three shapes: a fixed-scope assessment, a monthly retainer, and project work priced per deliverable. CannaShield publishes its own rates — $750 for a one-week starter assessment, $1,800/month for a GRC retainer, $2,500–$4,500 for a state compliance audit. Those are our numbers, not an industry survey. Use them as one reference point when you compare.',
    takeaways: [
      'Scope drivers: number of locations, systems in play, whether an audit or renewal is imminent, and how much documentation already exists.',
      'The comparison that matters is not vCISO versus nothing. It is vCISO versus a senior security hire, versus your MSP’s security add-on, versus the cost of the incident.',
      'A retainer that produces no artifacts you can hand to an underwriter is a subscription, not a security program.',
    ],
    faqs: [
      {
        question: 'What are the engagement models?',
        answer: `<p>Three, and they serve different moments.</p>
<ul>
<li><strong>Fixed-scope assessment.</strong> A defined piece of work with a written deliverable — current-state assessment, gap report, prioritized roadmap. Good first move when you do not yet know what you need. CannaShield's Cannabis Cyber Starter Assessment is one week at $750; the deeper State Cannabis Cyber Compliance Audit runs three weeks at $2,500–$4,500.</li>
<li><strong>Monthly retainer.</strong> Ongoing ownership at a set cadence — policy maintenance, vendor reviews, access review oversight, incident escalation, and someone to call. Our GRC Foundations retainer is $1,800/month.</li>
<li><strong>Project work.</strong> Priced per deliverable: a cyber insurance readiness package, a BEC defense sprint, a ransomware resilience audit. Useful when there is a specific forcing event.</li>
</ul>`,
      },
      {
        question: 'What actually drives the price?',
        answer: `<p>Five things, and none of them is your revenue:</p>
<ul>
<li><strong>Locations and entities.</strong> Each site adds network, staff, and access review surface. Each legal entity adds documentation.</li>
<li><strong>Systems in scope.</strong> A cash-only single-site dispensary is a smaller problem than an operator running e-commerce, delivery, a loyalty platform, and a cultivation facility with environmental controls.</li>
<li><strong>Deadline pressure.</strong> A renewal or underwriting deadline in six weeks compresses the work and raises the price. Starting nine months out is cheaper.</li>
<li><strong>What already exists.</strong> If you have current inventories and any written policy, a large chunk of discovery is already done.</li>
<li><strong>Regulatory footprint.</strong> One state is one appendix. Five states is five sets of deadlines and notification contacts.</li>
</ul>`,
      },
      {
        question: 'How does it compare to hiring someone?',
        answer: `<p>A full-time security leader is a senior executive salary plus benefits and payroll costs, plus recruiting, plus the tooling budget they will ask for in month two. For a single-site dispensary or a small cultivator, that is not a proportionate spend, and it is a role most operators cannot interview for competently.</p>
<p>What you give up with fractional is availability — a set number of hours per month, so work gets prioritized rather than done on demand. What you gain is judgment from someone who has handled incidents, without a hiring cycle.</p>
<p>There is a real crossover point. Multi-state operations, an internal IT team of any size, or continuous audit and investor pressure eventually justify a permanent hire. Below that, fractional is usually the better use of the money.</p>`,
      },
      {
        question: 'Is this different from what our MSP already charges for security?',
        answer: `<p>Usually, yes — and the distinction is worth understanding before you pay for both.</p>
<p>An MSP security add-on typically means tooling and monitoring: endpoint protection, patching, maybe email filtering, sometimes a dashboard. Real value, and you should have it.</p>
<p>What it generally does not include is risk ownership: deciding what to accept, writing the program, running vendor reviews, preparing renewal evidence, or being the accountable name when a regulator asks. There is also a structural issue — asking your MSP to independently assess the environment your MSP built puts them in an awkward position, and good MSPs will say so.</p>
<p>The two are complements. Your MSP runs the controls; the vCISO decides which controls, proves they work, and owns the answer.</p>`,
      },
      {
        question: 'What should be included, and what usually is not?',
        answer: `<p>Ask for the deliverables list in writing before signing. A serious engagement should produce most of these:</p>
<ul>
<li>Current-state assessment against a named framework, dated</li>
<li>Written information security program and policies that reflect your actual operations</li>
<li>Asset, data, and vendor inventories</li>
<li>An incident response plan with your state's reporting clocks written into it</li>
<li>A risk register including accepted risks and who accepted them</li>
<li>Insurance and renewal evidence, assembled rather than scattered</li>
<li>A defined escalation path when something happens</li>
</ul>
<p>Commonly excluded and worth clarifying: incident response labor during an actual incident (often a separate retainer plus hourly — ours is $1,200/month plus $275/hour), penetration testing, tool licensing, and remediation implementation as opposed to remediation planning.</p>`,
      },
      {
        question: 'How do we tell a real engagement from a template subscription?',
        answer: `<p>Ask four questions and listen carefully.</p>
<p><strong>"Can I see a redacted deliverable?"</strong> If the sample is a generic policy pack with a logo swapped in, you are buying templates.</p>
<p><strong>"Who is doing the work, and what have they responded to?"</strong> Cannabis security advice from someone who has never worked an incident tends to be theoretically complete and practically useless.</p>
<p><strong>"What happens at 9pm on a Saturday?"</strong> The answer should be specific, and it should include what is and is not covered.</p>
<p><strong>"Show me how you'd handle a next-business-day reporting obligation."</strong> If they do not know Connecticut has one, they do not know Connecticut.</p>
<p>One more red flag: anyone who tells you a framework certification is legally required for your cannabis license. It is not, and the claim is a reliable signal about everything else they will tell you.</p>`,
      },
      {
        question: 'How should we think about the return?',
        answer: `<p>Be honest that security spend is insurance against events with uncertain probability. Anyone quoting you a precise ROI figure is making it up.</p>
<p>What you can reason about are the concrete costs that are avoided or reduced. MariMed disclosed a $646,000 loss from a single forged email — a callback procedure costs nothing and addresses that class of loss directly. An operator who cannot answer underwriting questions accurately risks a coverage dispute after a claim. Renewal preparation done continuously costs less than two weeks of scramble. And an unreported reportable incident is a licensing problem in a way the incident itself may not be.</p>
<p>Those are the four buckets. None of them produces a clean multiple, but together they usually justify a modest monthly number for an operator whose license is the whole business.</p>`,
      },
      {
        question: 'What is a sensible first engagement?',
        answer: `<p>Buy the assessment before you buy the retainer.</p>
<p>A fixed-scope assessment gives you a written picture of where you stand, a prioritized list, and — just as usefully — a low-cost trial of how the provider actually works. You find out whether their questions are sharp, whether the deliverable is specific to you, and whether you want them on the phone during a bad week.</p>
<p>If the assessment is generic, you have spent a small amount to learn something important. If it is good, the retainer conversation gets much easier, and it starts from a real roadmap instead of a proposal.</p>`,
      },
    ],
    related: [
      { label: 'Do cannabis companies need a CISO?', href: '/blog/do-cannabis-companies-need-a-ciso' },
      { label: 'What GRC framework should a cannabis company use?', href: '/blog/grc-framework-for-cannabis-companies' },
      { label: 'Cyber Insurance Qualification services', href: '/services/insurance-qualification' },
    ],
    sources: [
      {
        label: 'Marijuana MSO MariMed lost $646,000 in email fraud',
        publisher: 'MJBizDaily',
        url: 'https://mjbizdaily.com/marijuana-mso-marimed-lost-646000-in-email-fraud/',
      },
      {
        label: 'NIST Cybersecurity Framework 2.0 (Govern function)',
        publisher: 'NIST',
        url: 'https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20',
      },
      {
        label: 'Cannabis policies and procedures guidance',
        publisher: 'Connecticut Department of Consumer Protection',
        url: 'https://portal.ct.gov/cannabis/knowledge-base/articles/policies-and-procedures?language=en_US',
      },
    ],
  },
]

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Strips tags from an answer so it can be used as plain text inside
 * schema.org FAQPage `acceptedAnswer`.
 */
export function faqAnswerText(answer: string) {
  return answer
    .replace(/<li>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function renderFaqContent(post: FaqPost) {
  const takeaways = post.takeaways.map((item) => `<li>${item}</li>`).join('')
  const questions = post.faqs
    .map((faq) => `<h2>${faq.question}</h2>${faq.answer}`)
    .join('')
  const related = post.related
    .map(
      (link) =>
        `<li><a href="${escapeHtmlAttribute(link.href)}">${link.label}</a></li>`,
    )
    .join('')

  return [
    `<p class="lead">${post.answer}</p>`,
    `<div class="highlight-box"><p><strong>The short version</strong></p><ul>${takeaways}</ul></div>`,
    questions,
    '<h2>Where to go next</h2>',
    `<ul>${related}</ul>`,
    `<div class="highlight-box"><strong>Scope note:</strong> ${scopeNote}</div>`,
  ].join('')
}

export function getFaqPost(slug: string) {
  return FAQ_POSTS.find((post) => post.slug === slug)
}
