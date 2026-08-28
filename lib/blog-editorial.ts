export type EditorialSource = {
  label: string
  publisher: string
  url: string
}

export type EditorialPost = {
  title: string
  description: string
  category: string
  reviewedDate: string
  intro: string
  verified: string
  relevance: string
  actions: string[]
  sources: EditorialSource[]
}

const reviewedDate = '2026-08-28'

export const BLOG_EDITORIAL: Record<string, EditorialPost> = {
  'reynolds-ransomware-when-the-attackers-use-your-own-keys': {
    title: 'When Ransomware Uses a Trusted Driver Against You',
    description:
      'Why vulnerable signed drivers can disable security tools, and what Connecticut cannabis operators should ask their IT providers to verify.',
    category: 'Ransomware & Recovery',
    reviewedDate,
    intro:
      'Some ransomware crews abuse legitimate but vulnerable Windows drivers to reach the operating-system kernel and interfere with security software. The practical lesson is broader than any single ransomware family: trusted code can still create a high-impact path for attackers.',
    verified:
      'Microsoft documents that attackers exploit vulnerabilities in signed kernel drivers and recommends its vulnerable-driver blocklist, application control, and the attack-surface-reduction rule that blocks abuse of exploited signed drivers. Microsoft also warns that driver blocking should be tested because compatibility problems are possible.',
    relevance:
      'A disabled endpoint tool can delay detection while malware reaches POS workstations, shared files, identity systems, or backups. That is an operational-continuity problem—not proof of a licensing violation by itself.',
    actions: [
      'Ask your MSP whether the Microsoft vulnerable-driver blocklist and relevant attack-surface-reduction rules are enforced.',
      'Test policy changes in audit mode before broad deployment.',
      'Limit local administrator rights and investigate attempts to disable security tooling.',
      'Keep protected backups and rehearse restoration of the systems that keep the operation open.',
    ],
    sources: [
      {
        label: 'Microsoft recommended driver block rules',
        publisher: 'Microsoft',
        url: 'https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/microsoft-recommended-driver-block-rules',
      },
      {
        label: '#StopRansomware Guide',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/stopransomware/ransomware-guide',
      },
    ],
  },
  'the-invisible-breach-when-cloud-worms-target-your-supply-chain': {
    title: 'Your Cloud Vendors Are Part of Your Security Boundary',
    description:
      'A practical vendor-risk checklist for the cloud services that support sales, inventory, collaboration, and compliance workflows.',
    category: 'Vendor & Supply Chain',
    reviewedDate,
    intro:
      'Cannabis operators depend on cloud services for email, file sharing, inventory, payments, marketing, and vendor coordination. An incident at one provider can create downstream exposure even when the operator did not cause the original compromise.',
    verified:
      'CISA supply-chain guidance recommends identifying critical suppliers, understanding which systems and data they can access, setting security expectations, and monitoring supplier assurance over time. CISA also provides a vendor-assessment template designed for small and midsize businesses.',
    relevance:
      'The useful question is not whether a vendor claims to be secure. It is whether the operator knows what the vendor touches, what evidence supports the claim, and how the business will continue if that service is unavailable.',
    actions: [
      'Maintain a vendor register with service owner, data handled, access level, renewal date, and recovery dependency.',
      'Prioritize vendors connected to identity, POS, seed-to-sale, payments, and backups.',
      'Request current assurance evidence and document exceptions instead of relying on sales language.',
      'Record an alternate process for every vendor whose outage would stop sales or required reporting.',
    ],
    sources: [
      {
        label: 'Vendor supply-chain risk template for SMBs',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/resources-tools/resources/operationalizing-vendor-scrm-template-smbs',
      },
      {
        label: 'Securing the Software Supply Chain: Customer Guidance',
        publisher: 'CISA, NSA, and ODNI',
        url: 'https://www.cisa.gov/sites/default/files/2023-12/ESF_SECURING_THE_SOFTWARE_SUPPLY_CHAIN_CUSTOMER.pdf',
      },
    ],
  },
  'the-trojan-horse-in-your-slack-channel-when-remote-it-is-a-state-sponsored-attac': {
    title: 'Remote IT Hiring Needs Identity Verification, Not Just Interviews',
    description:
      'FBI-backed steps for reducing the risk of fraudulent remote IT workers and unauthorized remote access.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'Remote technical hiring can create privileged access before an employer has established that the worker, device, and physical location are genuine. This is a documented business risk, not a hypothetical scenario.',
    verified:
      'The FBI warns that North Korean IT workers have used false or stolen identities, U.S.-based facilitators, company devices, and unauthorized remote-access software to obtain work and reach company networks. The advisory recommends stronger identity verification, device controls, and monitoring for unusual access patterns.',
    relevance:
      'A systems administrator, developer, or outsourced support worker may reach email, cloud administration, POS integrations, or sensitive vendor data. Hiring and access decisions therefore belong in the security program, not only in HR.',
    actions: [
      'Verify identity with live, repeatable checks and compare employment, payment, tax, and shipping details for inconsistencies.',
      'Ship managed devices only to verified individuals and investigate unexplained device-forwarding arrangements.',
      'Prohibit unapproved remote-access tools and alert on their installation.',
      'Grant the minimum access required and review privileged activity during onboarding.',
    ],
    sources: [
      {
        label: 'North Korean IT Worker Threats to U.S. Businesses',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/investigate/cyber/alerts/2025/north-korean-it-worker-threats-to-u-s-businesses',
      },
    ],
  },
  'the-hidden-vector-when-your-marketing-team-becomes-a-security-risk-20260212031800': {
    title: 'Creative Software Belongs in the Patch Program',
    description:
      'Why marketing workstations and creative applications need the same inventory, patching, and access controls as operational systems.',
    category: 'Endpoint & Browser Security',
    reviewedDate,
    intro:
      'Creative teams routinely exchange large files and use applications with extensive local access. Those workstations are part of the business attack surface even when they never touch a POS terminal.',
    verified:
      'Adobe publishes product-specific security bulletins and recommends updating affected software to fixed versions. Its July 2026 Creative Cloud Desktop bulletin, for example, addressed critical privilege-escalation vulnerabilities and identified the affected and corrected Windows versions. Adobe said it was not aware of exploitation in the wild for those issues.',
    relevance:
      'The defensible conclusion is that creative software needs disciplined inventory and patching. A bulletin alone does not prove that a cannabis operator was targeted or that every affected workstation creates a regulatory violation.',
    actions: [
      'Inventory Adobe and other creative applications, including version and device owner.',
      'Set patch deadlines based on severity and exposure, with documented exceptions.',
      'Keep marketing users out of local-administrator roles when practical.',
      'Separate shared creative storage from systems that hold customer, financial, or regulated operational data.',
    ],
    sources: [
      {
        label: 'Adobe Creative Cloud Desktop security bulletin APSB26-77',
        publisher: 'Adobe',
        url: 'https://helpx.adobe.com/security/products/creative-cloud/apsb26-77.html',
      },
    ],
  },
  'zerodayrat-when-your-pocket-device-becomes-an-insider-threat-20260218003317': {
    title: 'Secure the Phones That Can Approve Business-Critical Actions',
    description:
      'A mobile-security baseline for owners and managers who use phones for email, payments, cloud access, and operational approvals.',
    category: 'Endpoint & Browser Security',
    reviewedDate,
    intro:
      'A phone becomes a business-critical endpoint when it can reset passwords, approve payments, read executive email, or administer cloud services. Mobile risk should be based on those capabilities—not on sensational claims about a particular malware family.',
    verified:
      'CISA mobile guidance recommends inventorying valuable accounts, using FIDO-based phishing-resistant authentication where feasible, moving away from SMS-based MFA, keeping operating systems updated, and limiting sensitive communications on unmanaged devices.',
    relevance:
      'For a Connecticut cannabis operator, loss of a privileged phone can disrupt decisions and expose business data. The appropriate response is a documented mobile-access standard and a tested process for revoking a lost device.',
    actions: [
      'Identify which mobile accounts can approve money, reset credentials, or administer business systems.',
      'Use managed devices for privileged roles and enforce screen lock, encryption, and supported operating-system versions.',
      'Move high-value accounts toward passkeys or hardware-backed FIDO authentication.',
      'Test remote revocation and account recovery before a device is lost.',
    ],
    sources: [
      {
        label: 'Mobile Communications Best Practice Guidance',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/sites/default/files/2024-12/guidance-mobile-communications-best-practices.pdf',
      },
    ],
  },
  'chrome-zero-day-when-your-browser-becomes-a-liability-20260219003253': {
    title: 'Browser Patching Is an Operations Control',
    description:
      'How to turn urgent browser security updates into a repeatable, verifiable process across managed endpoints.',
    category: 'Endpoint & Browser Security',
    reviewedDate,
    intro:
      'Browsers connect employees to email, payroll, banking, vendor portals, and cloud administration. A browser update process is therefore part of operational security, not routine housekeeping.',
    verified:
      'Google reported that CVE-2026-2441, a high-severity use-after-free vulnerability in CSS, was fixed in Chrome 144.0.7559.177 and that an exploit existed in the wild. Google also noted that deployment would roll out over time, which makes version verification more reliable than assuming automatic updates have completed.',
    relevance:
      'The event supports a narrow conclusion: organizations should know which browsers they manage and verify fixed versions after urgent releases. It does not establish that cannabis businesses were uniquely targeted.',
    actions: [
      'Standardize supported browsers and remove unmanaged alternatives where practical.',
      'Set an emergency deployment window for exploited vulnerabilities.',
      'Verify installed versions after rollout and report devices that remain behind.',
      'Limit browser extensions and review those with access to business data.',
    ],
    sources: [
      {
        label: 'Chrome Extended Stable update, February 13, 2026',
        publisher: 'Google Chrome Releases',
        url: 'https://chromereleases.googleblog.com/2026/02/extended-stable-updates-for-desktop_13.html',
      },
    ],
  },
  'the-trojan-horse-in-your-inbox-when-hiring-talent-costs-you-the-licens-20260218140346': {
    title: 'Treat Technical Hiring as a Privileged-Access Decision',
    description:
      'A security checklist for coding tests, contractor onboarding, identity verification, and initial access.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'Developers, administrators, and technical contractors may receive access to source code, cloud services, integrations, and credentials. The hiring process should account for that access before a candidate opens a coding test or receives a company device.',
    verified:
      'The FBI has documented fraudulent remote IT-worker schemes involving false identities, device-forwarding arrangements, unauthorized remote-access tools, and access to U.S. company networks. Those facts justify stronger onboarding controls without assuming that every remote candidate is suspicious.',
    relevance:
      'Smaller operators often combine hiring, IT, and access approval informally. A simple separation of duties can prevent one person from both validating an identity and granting powerful access.',
    actions: [
      'Run coding exercises only in an isolated environment with no production credentials.',
      'Verify identity and work location before shipping a managed device.',
      'Require a second approver for privileged roles and third-party administrative access.',
      'Use time-limited onboarding access and review it after the first week and first month.',
    ],
    sources: [
      {
        label: 'North Korean IT Worker Threats to U.S. Businesses',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/investigate/cyber/alerts/2025/north-korean-it-worker-threats-to-u-s-businesses',
      },
    ],
  },
  'the-trojan-horse-in-your-tech-stack-why-supply-chain-security-matters-20260218170851': {
    title: 'A Practical Software Supply-Chain Checklist for Operators',
    description:
      'What to document before a POS, payroll, ecommerce, or seed-to-sale vendor becomes an incident dependency.',
    category: 'Vendor & Supply Chain',
    reviewedDate,
    intro:
      'Software risk is not limited to code an operator writes. It includes the products, updates, integrations, and managed services the business buys and trusts.',
    verified:
      'Joint CISA, NSA, and ODNI guidance for software customers recommends maintaining baselines, testing updates, monitoring software versions and update sources, managing credentials and rights, and preparing incident reporting and response processes.',
    relevance:
      'A vendor questionnaire is useful only when it leads to ownership and action. Operators need to know which vendor can stop sales, alter regulated data, expose customer information, or delay recovery.',
    actions: [
      'List critical software and record the business process, data, owner, and integration attached to each product.',
      'Document how updates are delivered and how urgent vendor notices reach the right person.',
      'Review service accounts and integration tokens at least quarterly.',
      'Add notification, evidence, access-removal, and data-return terms to material vendor contracts.',
    ],
    sources: [
      {
        label: 'Securing the Software Supply Chain: Customer Guidance',
        publisher: 'CISA, NSA, and ODNI',
        url: 'https://www.cisa.gov/sites/default/files/2023-12/ESF_SECURING_THE_SOFTWARE_SUPPLY_CHAIN_CUSTOMER.pdf',
      },
    ],
  },
  'the-clickfix-trap-when-a-quick-fix-kills-your-compliance-20260219181527': {
    title: 'ClickFix Turns “Troubleshooting” Into Code Execution',
    description:
      'How fake CAPTCHAs and meeting errors persuade users to run attacker-provided commands—and how to interrupt the pattern.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'ClickFix is a social-engineering pattern: a page claims something is broken and instructs the user to paste or run a command as the fix. The user becomes the execution path.',
    verified:
      'A joint CISA advisory on Interlock ransomware describes ClickFix as a technique that uses fake CAPTCHA prompts to trick users into executing malicious PowerShell. That evidence supports training and execution-control recommendations; it does not mean every browser error or CAPTCHA is malicious.',
    relevance:
      'Fast-moving retail and operations teams are conditioned to resolve interruptions quickly. A clear rule—never paste a command from a webpage into a terminal or Run dialog—gives employees a useful stop signal.',
    actions: [
      'Teach the exact behavior: no legitimate CAPTCHA or meeting page should require a pasted system command.',
      'Restrict script interpreters and command execution for users who do not need them.',
      'Log suspicious PowerShell activity and preserve the URL, screenshot, and command when reporting an event.',
      'Give employees a fast support channel so stopping to verify is easier than improvising a fix.',
    ],
    sources: [
      {
        label: 'Interlock ransomware joint cybersecurity advisory',
        publisher: 'CISA and partners',
        url: 'https://www.cisa.gov/sites/default/files/2025-07/aa25-203a-stopransomware-interlock-072225.pdf',
      },
    ],
  },
  'trusted-senders-false-invoices-the-dkim-replay-threat-20260219173723': {
    title: 'Email Authentication Does Not Replace Payment Verification',
    description:
      'Why SPF, DKIM, and DMARC reduce spoofing risk but cannot make an invoice or payment request trustworthy by themselves.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'Email authentication helps receiving systems evaluate whether a message is authorized for a domain. It does not prove that the person asking for money is honest, that an account was not compromised, or that changed bank details are legitimate.',
    verified:
      'CISA states that DMARC protects a domain from direct spoofing but does not protect a recipient from every spoofed message. The FBI describes business email compromise as a financially damaging crime and recommends verifying payment or account changes through a separate, trusted channel.',
    relevance:
      'Cannabis operators manage vendor payments in a banking-constrained environment where urgency and changing instructions may already feel normal. Payment verification must be a business process, not an email judgment.',
    actions: [
      'Publish and monitor SPF, DKIM, and DMARC, progressing toward enforcement after legitimate senders are accounted for.',
      'Require out-of-band verification for new bank details and high-risk payments.',
      'Use a known phone number or existing vendor contact—not the contact information in the request.',
      'Define who can change vendor payment records and require a second approver.',
    ],
    sources: [
      {
        label: '#StopRansomware Guide—email security guidance',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/stopransomware/ransomware-guide',
      },
      {
        label: 'Business Email Compromise',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise',
      },
    ],
  },
  'the-cash-trap-why-atm-jackpotting-is-the-new-physical-threat-to-dispen-20260221215452': {
    title: 'ATM Jackpotting Is Both a Physical and Cyber Risk',
    description:
      'What the FBI’s 2026 warning means for cannabis retailers that host or operate ATMs.',
    category: 'Security Operations',
    reviewedDate,
    intro:
      'ATM jackpotting combines physical access, software abuse, and cash theft. Retailers that host an ATM should know who owns it, who services it, and who receives an alert when its enclosure or software changes.',
    verified:
      'The FBI reported 1,900 ATM jackpotting incidents since 2020, including more than 700 incidents and over $20 million in losses during 2025. Its February 2026 FLASH explains that actors exploit physical and software vulnerabilities and deploy malware that forces machines to dispense cash.',
    relevance:
      'The FBI figures describe U.S. ATM incidents generally, not cannabis dispensaries specifically. The relevant operator action is to manage the ATM as a third-party technology and cash-handling risk.',
    actions: [
      'Record ATM owner, model, software support status, service vendor, and emergency contact.',
      'Restrict and monitor physical access to ports, cabinets, and service areas.',
      'Require service visits to be scheduled and verified with the vendor.',
      'Preserve camera footage and device logs and contact law enforcement promptly after suspicious activity.',
    ],
    sources: [
      {
        label: 'Increase in Malware-Enabled ATM Jackpotting Incidents',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/file-repository/increase-in-malware-enabled-atm-jackpotting-incidents-across-united-states-021926.pdf',
      },
    ],
  },
  'the-device-in-your-pocket-is-the-biggest-threat-to-your-grow-20260222193030': {
    title: 'Define What Mobile Devices May Do Before One Is Lost',
    description:
      'A role-based approach to mobile access for owners, managers, finance staff, and cultivation teams.',
    category: 'Endpoint & Browser Security',
    reviewedDate,
    intro:
      'The useful mobile-security question is not whether phones are “the biggest threat.” It is which business actions a phone can perform and how quickly those permissions can be revoked.',
    verified:
      'CISA recommends identifying high-value mobile accounts, using phishing-resistant authentication, moving away from SMS-based MFA, applying software updates, and protecting sensitive communications. Those controls can be translated into a small-business mobile-access standard.',
    relevance:
      'Owners and managers may approve payments, access email, or manage environmental and vendor systems from personal devices. The organization should make that access explicit instead of inheriting whatever settings the user chose.',
    actions: [
      'Create mobile-access tiers based on role and the sensitivity of available actions.',
      'Require managed devices for privileged, finance, and administrative access.',
      'Separate personal and business accounts and remove access immediately at offboarding.',
      'Test lost-device reporting, remote revocation, and recovery of critical accounts.',
    ],
    sources: [
      {
        label: 'Mobile Communications Best Practice Guidance',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/sites/default/files/2024-12/guidance-mobile-communications-best-practices.pdf',
      },
    ],
  },
  'the-invisible-open-door-why-your-smart-grow-is-your-biggest-liability-20260223184330': {
    title: 'Keep Grow Technology Separate From Everyday Business Traffic',
    description:
      'Why connected environmental controls and IoT devices need inventory, segmentation, and a recovery plan.',
    category: 'Security Operations',
    reviewedDate,
    intro:
      'Connected sensors, controllers, cameras, and environmental systems can be difficult to patch and may remain in service for years. Treating them like ordinary laptops creates unnecessary paths between operational technology and business systems.',
    verified:
      'NIST guidance for small-business IoT environments recommends network segmentation where possible and keeping devices with known security risks separate from everyday computing devices that receive regular updates and endpoint protection.',
    relevance:
      'Segmentation does not make a device safe, and it is not a substitute for vendor support. It limits which systems an exploited device can reach and can reduce the operational impact of a compromise.',
    actions: [
      'Inventory connected operational devices with model, owner, vendor, network, and support status.',
      'Place IoT and environmental systems on restricted network segments.',
      'Allow only the communications each device needs and block unnecessary internet exposure.',
      'Document manual operating limits and escalation steps for loss of remote control.',
    ],
    sources: [
      {
        label: 'Securing Small-Business and Home IoT Devices',
        publisher: 'NIST',
        url: 'https://www.nist.gov/publications/securing-small-business-and-home-internet-things-iot-devices-mitigating-network-based',
      },
    ],
  },
  'the-ai-illusion-why-your-ceo-just-ordered-a-wire-transfer-20260226170304': {
    title: 'A Familiar Voice Is Not Payment Authorization',
    description:
      'How to design payment controls that survive executive impersonation, compromised email, and synthetic audio.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'A voice note, video call, or urgent executive message can be persuasive without being authentic. Payment control should rely on a known process that remains valid when the message itself cannot be trusted.',
    verified:
      'The FBI documents business email compromise schemes that impersonate executives and vendors. It has also described fraudsters using still images and deepfake audio in virtual meetings to direct wire transfers. The FBI recommends verifying requests through a separate communication channel.',
    relevance:
      'The risk is highest when urgency can bypass normal approval. A written payment-change process protects finance staff by making verification mandatory rather than discretionary.',
    actions: [
      'Require two approvals for high-risk payments and all bank-detail changes.',
      'Verify requests using a known number or in-person channel independent of the message.',
      'Create a pause-and-escalate rule for secrecy, urgency, or pressure to bypass process.',
      'If fraud occurs, contact the financial institution immediately and report to the FBI’s IC3.',
    ],
    sources: [
      {
        label: 'Business Email Compromise',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise',
      },
      {
        label: 'FBI Congressional Report on BEC and Real Estate Wire Fraud',
        publisher: 'FBI',
        url: 'https://www.fbi.gov/file-repository/reports-and-publications/fy-2022-fbi-congressional-report-business-email-compromise-and-real-estate-wire-fraud-111422.pdf',
      },
    ],
  },
  'your-mfa-can-be-bypassed-here-is-the-starkiller-defense-strategy-20260304141154': {
    title: 'MFA Is Essential, but the Method Matters',
    description:
      'Why passkeys and security keys resist phishing better than codes and approval prompts.',
    category: 'Identity & Fraud',
    reviewedDate,
    intro:
      'MFA materially improves account security, but not every factor resists the same attacks. Codes and push approvals can still be captured, relayed, or approved under pressure.',
    verified:
      'CISA recommends phishing-resistant MFA and identifies FIDO/WebAuthn as the widely available phishing-resistant option. CISA advises using number matching as an interim improvement when FIDO cannot yet be deployed and treating SMS as a last resort.',
    relevance:
      'The practical priority is to protect email, remote access, finance, and administrative accounts first. An organization should not describe itself as “MFA complete” without knowing which methods are actually in use.',
    actions: [
      'Inventory MFA methods for email, VPN, finance, POS administration, and cloud administrators.',
      'Move privileged and high-value accounts to passkeys or hardware security keys.',
      'Use number matching while migrating away from simple push approval.',
      'Alert on denied prompts, new factor enrollment, and changes to recovery methods.',
    ],
    sources: [
      {
        label: 'Require Multifactor Authentication',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/require-multifactor-authentication',
      },
      {
        label: 'More Than a Password',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/ncas/tips/st05-012',
      },
    ],
  },
  'the-call-is-coming-from-inside-the-house-malicious-outlook-add-ins-20260225223855': {
    title: 'Manage Outlook Add-Ins Like Connected Applications',
    description:
      'Why Microsoft 365 add-ins need an owner, a business purpose, permission review, and centralized deployment.',
    category: 'Vendor & Supply Chain',
    reviewedDate,
    intro:
      'An Outlook add-in is software connected to a high-value communications system. Even legitimate add-ins may read or write business data depending on the permissions and design, so installation should not be an unmanaged end-user decision.',
    verified:
      'Microsoft documents a permissions model for Office add-ins and recommends centralized deployment through the Microsoft 365 admin center. Microsoft notes that administrators can assign add-ins to specific users or groups and that an add-in’s hosted web application can change over time.',
    relevance:
      'The defensible control is application governance: know what is installed, who approved it, what it can access, and how it will be removed. This article does not claim that all add-ins are dangerous.',
    actions: [
      'Inventory deployed add-ins and record owner, purpose, users, permissions, and review date.',
      'Use centralized deployment and group-based assignment instead of unmanaged installation.',
      'Remove unused add-ins and reassess those with access to mail or documents.',
      'Include add-ins and connected applications in offboarding and incident-response procedures.',
    ],
    sources: [
      {
        label: 'Deploy Office Add-ins in the Microsoft 365 admin center',
        publisher: 'Microsoft',
        url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-deployment-of-add-ins?view=o365-worldwide',
      },
      {
        label: 'Privacy and security for Office Add-ins',
        publisher: 'Microsoft',
        url: 'https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/privacy-and-security',
      },
    ],
  },
  'your-safety-net-just-became-a-trap-dell-s-zero-day-and-your-recovery-p-20260224012947': {
    title: 'A Backup Is Only Useful If the Recovery Path Is Protected',
    description:
      'How to verify that ransomware cannot erase both production systems and the recovery mechanisms meant to restore them.',
    category: 'Ransomware & Recovery',
    reviewedDate,
    intro:
      'Recovery infrastructure is a high-value target because defeating it increases pressure on the victim. A backup program should be evaluated as a complete recovery path, not as a successful nightly job.',
    verified:
      'CISA’s ransomware guidance recommends identifying critical systems and dependencies, protecting storage against deletion or overwrite, maintaining offline or otherwise protected backups, and testing restoration. These are resilience practices, not a guarantee that every incident can be recovered instantly.',
    relevance:
      'Operators should define which systems must return first to restore safe, lawful business operations. Recovery priorities may include identity, POS, inventory workflows, communications, and the evidence needed to coordinate with vendors and counsel.',
    actions: [
      'Document recovery order, owners, dependencies, and acceptable outage for critical services.',
      'Protect backup administration with separate credentials and strong MFA.',
      'Use deletion protection, object lock, offline copies, or equivalent controls appropriate to the platform.',
      'Run restoration exercises and record the time, problems, and remediation owner.',
    ],
    sources: [
      {
        label: '#StopRansomware Guide',
        publisher: 'CISA',
        url: 'https://www.cisa.gov/stopransomware/ransomware-guide',
      },
    ],
  },
}

export function renderEditorialContent(post: EditorialPost) {
  const actions = post.actions.map((action) => `<li>${action}</li>`).join('')

  return [
    `<p class="lead">${post.intro}</p>`,
    '<h2>What the evidence supports</h2>',
    `<p>${post.verified}</p>`,
    '<h2>Why it matters to a Connecticut operator</h2>',
    `<p>${post.relevance}</p>`,
    '<h2>Operator checklist</h2>',
    `<ul>${actions}</ul>`,
    '<div class="highlight-box"><strong>Scope note:</strong> This briefing separates documented facts from practical recommendations. It is cybersecurity guidance, not legal advice or a statement that every recommended control is expressly required by Connecticut cannabis regulations.</div>',
  ].join('')
}
