# U.S. payment processing and data center compliance register

Research baseline · October 13, 2026 · Version 0.2.0

## Scope and how to use this

Assumed business: a U.S. card-payment processor handling cardholder data, potentially operating or replacing a data center or constructing a new facility. No particular legal entity, financial charter, license, city/state, transaction model, customer geography or building design has been supplied.

This is a broad **applicability-screening register**, not a declaration that every listed requirement applies. It cannot truthfully be called a complete 50-state, every-country legal opinion or a permit-ready engineering specification. Requirements change; competent counsel, a qualified PCI assessor, and the facility's authority having jurisdiction (AHJ) must resolve the actual obligations. Do not process real cardholder data based solely on this educational app or document.

Classifications below mean:

- **Law/regulation:** mandatory when the legal scope and conditions are met.
- **Contract/industry standard:** mandatory through relevant card-network, bank, client or supplier agreements; sometimes also incorporated into law.
- **Guidance/framework:** generally voluntary unless adopted by a rule, contract, regulator or organizational policy.
- **Local/adopted code:** enforceable edition/amendments depend on the facility's jurisdiction and permit authority.
- **Conditional/watchlist:** investigate the role, threshold, jurisdiction and current effective status before applying it.

An organization can satisfy a useful framework and still violate a law. Passing PCI DSS does not automatically satisfy GLBA, privacy, building codes or all customer contracts. Having a written policy is not evidence that the controls actually operate.

## 1. Payment-card and payment-system obligations

| Requirement | Basis / trigger | Implementation evidence to collect |
| --- | --- | --- |
| PCI DSS v4.0.1 | Card-industry baseline for entities storing, processing or transmitting account data, or able to affect its security; processor/service-provider validation depends on network/acquirer requirements | Documented cardholder-data environment (CDE), data flows, segmentation, applicable assessment/report, vulnerability/testing evidence and responsibility matrix |
| Card-brand/acquirer rules | Visa, Mastercard, American Express, Discover and other supported network agreements; processor registration, validation, breach response and reporting differ | Current contracts, registration, required reports, notification contacts and service-provider obligations |
| PCI PIN / PTS HSM / PTS POI | PIN processing, cryptographic infrastructure, terminals and device roles | Approved devices, key ceremonies, dual control and split knowledge where required; device lifecycle and key-management evidence |
| PCI P2PE / token-service requirements | Providing a validated P2PE solution or qualifying token service—not merely using the word encryption/tokenization | Assessed solution/service scope, device chain of custody, key and decryption boundaries |
| PCI Secure Software / Secure SLC | Payment-software product/development-program role and customer/network requirements | Applicable product/lifecycle assessment and secure development evidence |
| PCI 3DS / mobile acceptance / card production standards | Operating relevant 3-D Secure components, mobile acceptance solutions or card production/personalization | Exact role-to-standard applicability and assessment records; not automatically every processor |
| PCI key-management standards | Particular payment key-management services/operations | Confirm the current PCI standard and network scope, key owners, custody, backup, compromise and destruction procedures |
| Nacha Operating Rules | ACH origination/processing roles, including third-party sender/service-provider arrangements | Bank agreement, risk assessment, authorization, fraud monitoring and applicable audit requirements; these are not a general federal statute |

Primary sources: [PCI DSS scope](https://www.pcisecuritystandards.org/standards/pci-dss/), [PCI standards library](https://www.pcisecuritystandards.org/document_library/), [Nacha regulatory guidance](https://www.nacha.org/content/regulatory-guidance). Read the actual supported-network agreements; this register does not substitute for their current terms. Never retain prohibited sensitive authentication data simply because it is encrypted; obtain PCI-specific scope guidance for issuer/issuing-support exceptions.

## 2. Federal financial-data, privacy and consumer obligations

| Law / rule | Applicability question | Policy/control consequence |
| --- | --- | --- |
| GLBA security safeguards | Which regulator has authority over the actual financial activity? The FTC rule is not the banking agencies' rule | Written risk-based information security program, accountable leadership, access/MFA/encryption, testing, provider oversight and incident procedures; certain small-institution exceptions affect only particular provisions |
| GLBA privacy / Regulation P | Are you a covered institution, service provider or recipient of nonpublic personal financial information? | Required notices/opt-outs where applicable, sharing and reuse restrictions, processing exceptions, contractual limits; an exception is not unrestricted secondary-use permission |
| FTC Act Section 5 / applicable consumer-finance prohibitions | Are security/privacy promises misleading or practices unfair/deceptive? Are you a covered consumer-finance entity/service provider? | Accurate notices, reasonable safeguards, complaint handling and evidence supporting claims |
| Bank Service Company Act / bank third-party oversight | Are services provided to a supervised bank within the statutory/contractual scope? | Examination access, oversight, contracts, continuity, due diligence and prompt bank communication |
| BSA / FinCEN money-services rules | Are funds accepted/transmitted in a regulated capacity, or does a specific exemption apply? | If covered, required registration and AML program/reporting/recordkeeping for the actual MSB activity. Do not assume every processor has identical bank-level CIP/CDD duties |
| OFAC sanctions | Do transactions/persons fall under U.S. sanctions jurisdiction? | Risk-appropriate screening, escalation, blocking/rejection/reporting and records as applicable; management, assessment, controls, testing and training support compliance |
| FCRA / FACTA | Are consumer reports obtained, used, furnished or disposed of? Are receipt/creditor/covered-account provisions implicated? | Permissible purpose, accuracy/disputes, notices, secure disposal, applicable identity-theft program and receipt truncation controls |
| EFTA / Regulation E | Consumer EFT, debit/prepaid or service-provider role | Applicable authorization, disclosures, error resolution, liability, records and other role-specific requirements |
| TILA / Regulation Z | Issuing, servicing, extending or otherwise participating in covered consumer credit activities | Relevant credit disclosures, billing/error handling and recordkeeping—not an automatic duty for every back-end processor |
| DOJ Data Security Program, 28 CFR Part 202 | Covered transactions involving bulk U.S. sensitive personal or government-related data and countries/persons of concern; exemptions/thresholds matter | Transaction screening, prohibited/restricted-transfer controls and applicable diligence/security/compliance records |
| COPPA | Child-directed online service or actual knowledge of collecting personal data from children under 13 | Applicable parental notice/consent, minimization, retention, security and vendor controls. Ordinary adult card processing alone does not establish this trigger |
| HIPAA / HITECH | Are you a covered entity or doing business-associate work beyond ordinary payment transfer? | PHI safeguards, agreements and breach duties if covered; ordinary consumer-conducted payment transfer is treated differently from expanded PHI/billing services |
| SEC issuer / regulated-financial-entity requirements | Public-company reporting or a separately regulated securities business? | Applicable cybersecurity governance/disclosures; SOX internal-control evidence or securities privacy/safeguard rules require separate role analysis |
| Federal contracting / government information | Does a contract require FCI, CUI, federal-system or cloud-service safeguards? | Applicable FAR/DFARS, FISMA-related contract requirements, NIST 800-171/172, FedRAMP, CMMC or agency clauses; read the actual contract/current rules |

Primary sources: [FTC Safeguards guide](https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know), [Regulation P scope](https://www.consumerfinance.gov/rules-policy/regulations/1016/1/), [FinCEN processor exemption ruling](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/application-money-services-business), [OFAC compliance framework](https://ofac.treasury.gov/system/files/126/framework_ofac_cc.pdf), [FTC FCRA resources](https://www.ftc.gov/business-guidance/privacy-security/credit-reporting), [Regulation E](https://www.consumerfinance.gov/rules-policy/regulations/1005/), [Regulation Z](https://www.consumerfinance.gov/rules-policy/regulations/1026/), [DOJ program](https://www.justice.gov/nsd/data-security), [COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [HHS business-associate scope](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html), [SEC cyber disclosures](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/cybersecurity-risk-management-strategy-governance-incident-disclosure), [FAR basic safeguarding](https://www.acquisition.gov/far/52.204-21), [DoD CMMC](https://dodcio.defense.gov/cmmc/About/).

FinCEN's payment-processor exemption is fact-specific, including the goods/services purpose, qualifying settlement system and formal seller/creditor agreement. It does not automatically create an exemption from state money-transmitter licensing. A payment gateway, processor, acquirer, issuer, wallet, lender and money transmitter are not interchangeable legal roles.

## 3. State requirements and personal-data collection

Do a jurisdiction-by-jurisdiction analysis based on both the company/facility location and the affected people's residence—not just the incorporation state.

| State-level subject | What must be checked |
| --- | --- |
| Comprehensive consumer privacy | Applicable state statutes/regulations, thresholds, sensitive-data requirements, consumer rights, opt-outs, processor contracts and assessments. GLBA exemptions differ: covered data and covered entities are not the same thing |
| California CCPA/CPRA | Business thresholds, employee/B2B data, service-provider/contractor restrictions, notice, rights and relevant exemptions; financial-data exemptions are not a universal permission to ignore unrelated personal data |
| Financial licensing/security | Money-transmitter/processor exemptions, license conditions, bank partnership and state financial privacy; state adoption of model laws varies |
| New York DFS Part 500 | Covered DFS-authorized/required-authorized entity and available exemptions; having a New York customer alone does not establish direct coverage. Bank/client contracts may impose related duties |
| Massachusetts 201 CMR 17 | Covered Massachusetts-resident personal information and applicable written security program/safeguards; verify the current text and jurisdiction |
| Breach-notification statutes | Each affected state's definitions, covered information, recipients, triggers, deadlines, exceptions, regulator notices and consumer/credit-bureau notices |
| Biometrics, health/location and surveillance | Applicable biometric consent/retention laws (for example Illinois BIPA), consumer-health laws, precise location protections and workplace/CCTV requirements; definitions and GLBA exemptions vary |
| Data brokers, marketing and communications | Whether registration, sale/sharing opt-out, advertising, cookies, telephone/text/email marketing or state-specific duties apply to the actual practices |
| Retention and records | Required financial/tax/employment/transaction records, legal holds, breach evidence and secure destruction; reconcile these with minimization/deletion duties |

Starting authorities: [California privacy regulator/AG guidance](https://oag.ca.gov/privacy/ccpa), [NYDFS cybersecurity](https://www.dfs.ny.gov/cybersecurity), [Massachusetts security regulation](https://www.mass.gov/regulations/201-CMR-1700-standards-for-the-protection-of-personal-information-of-ma-residents), [Illinois BIPA text](https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3004&ChapterID=57), [CSBS money-transmission modernization](https://www.csbs.org/csbs-money-transmission-modernization-act-mtma). Massachusetts page access was blocked during one verification attempt; its current text and applicability still require direct review. This is not a completed 50-state statutory matrix.

## 4. Incident notification: do not use one universal clock

| Potential duty | Important distinction |
| --- | --- |
| FTC Safeguards notification | Covered notification events involving at least 500 consumers' unencrypted information: as soon as possible, no later than 30 days after discovery. Compromised keys can change encryption treatment; consult the precise trigger |
| Banking-organization notification | Covered banking organizations: as soon as possible, no later than 36 hours after the specified determination—not a universal processor deadline |
| Bank service-provider notification | Notify affected bank customers as soon as possible for qualifying disruption/degradation lasting, or reasonably likely to last, four or more hours. **Four hours is a disruption threshold, not permission to wait four hours before notifying** |
| SEC public-company disclosure | Generally four business days after determining an incident is material, subject to applicable rules/exceptions; not four days after every alert |
| State, foreign and contractual duties | Separate thresholds, timing, recipients and evidence; maintain a counsel-approved notification matrix |
| CIRCIA | Watchlist: assess covered-entity scope and the actual effective implementing rule. This research did not verify a currently effective final rule; do not present proposed reporting clocks or an agenda target date as already binding |

Sources: [FTC guide](https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know), [bank incident rule](https://www.fdic.gov/news/financial-institution-letters/2021/fil21074.html), [FDIC service-provider explanation](https://www.fdic.gov/news/speeches/2021/spnov1821.html), [SEC disclosure guidance](https://www.sec.gov/rules-regulations/staff-guidance/compliance-disclosure-interpretations/exchange-act-form-8-k). Do not treat this table as incident-specific legal advice.

## 5. Frameworks and standards to screen

These overlap; adopting all of them is not a sensible universal requirement. Select a primary control system, map obligations into it, and retain evidence instead of maintaining duplicate programs.

| Framework / standard family | Why it may be useful | Typical status |
| --- | --- | --- |
| NIST CSF 2.0 | Govern, Identify, Protect, Detect, Respond, Recover; organizational profiles and risk communication | Generally voluntary; can be contractually/regulatorily incorporated |
| NIST RMF / SP 800-37 | System-life-cycle risk management and authorization | Federal/contract scope or voluntary structured risk management |
| SP 800-53 / 53A / 53B | Control catalog, assessment procedures and baselines | Federal/contract scope or voluntary control mapping |
| NIST SP 800-30 / 39 / 55 | Risk assessment, organization-wide risk and measurement | Supporting guidance |
| NIST IR 8286 series | Cybersecurity and enterprise risk/governance integration | GRC guidance |
| NIST Privacy Framework / SP 800-122 | Privacy-risk management and PII safeguards | Guidance, not a substitute for privacy law |
| SP 800-34 / 61 / 63 / 88 / 115 / 137 | Continuity, incident response, identity, sanitization, technical testing and monitoring | Supporting publications; verify each current revision |
| SP 800-161 / 171 / 172 / 190 / 207 / 218 | Supply chain, CUI, containers, zero trust and secure development | Guidance or government/customer contract requirements |
| NIST AI RMF / generative-AI profile | AI risks in fraud, underwriting, customer support and internal tools | Generally voluntary; other laws can still govern the use |
| ISO/IEC 27001 / 27002 / 27005 | Information security management, controls and risk | Voluntary/contractual; 27001 certification is a separate assessed claim |
| ISO/IEC 27701 / 27017 / 27018 / 27035 / 27036 | Privacy management, cloud, PII, incidents and supplier relationships | Voluntary/contractual; select relevant editions/scope |
| ISO 22301 / 31000 / ISO/IEC 20000-1 / 42001 | Business continuity, risk, service management and AI management | Voluntary/contractual management guidance/standards |
| SOC 1 / SOC 2 | Financial-reporting controls or trust-services attestation | Customer/contract assurance; **SOC 2 is an attestation, not a government certification** |
| CIS Controls / Benchmarks | Prioritized controls and configuration hardening | Voluntary or contractually adopted technical baseline |
| COBIT | Governance and management of enterprise IT | Governance framework |
| CSA Cloud Controls Matrix / STAR | Cloud controls and assurance mapping | Voluntary/customer assurance |
| OWASP ASVS / SAMM / Top 10 | Application verification, maturity and risk awareness | Engineering guidance; Top 10 alone is not a full security assessment |
| PCI standard families | Payment-specific controls and validation | Contract/industry obligations; role-dependent |
| FFIEC examination guidance | Architecture/infrastructure/operations, continuity, third parties and other supervised-bank expectations | Supervisory guidance and bank-client expectations; not automatic direct law for all vendors |
| FISMA / FedRAMP / CMMC / DISA STIGs | Federal systems, cloud authorization, defense contracts and configuration baselines | Conditional government/contract scope; check current program status and exact clauses |
| SWIFT CSP / ISO 20022 | SWIFT customer security program or payment message interoperability | Only if operating in those ecosystems; ISO 20022 is not a general security framework |
| IEC 62443 / ISO/IEC 22237 / ISO/IEC 30134 | Building/industrial-control security, facility infrastructure and data-center performance metrics | Conditional facility/OT/contract relevance |
| FAIR | Quantitative information-risk analysis | Optional risk-analysis method |

Authorities: [NIST CSF](https://www.nist.gov/cyberframework), [RMF](https://csrc.nist.gov/projects/risk-management), [NIST publications](https://csrc.nist.gov/publications), [NIST privacy](https://www.nist.gov/privacy-framework), [ISO standards](https://www.iso.org/standards.html), [AICPA SOC](https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services), [CIS](https://www.cisecurity.org/controls), [COBIT](https://www.isaca.org/resources/cobit), [CSA CCM](https://cloudsecurityalliance.org/artifacts/cloud-controls-matrix-v4-1), [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [FFIEC resources](https://www.ffiec.gov/resources/cybersecurity-awareness). Some normative standards, formal assessments and certifications cost money; this free app does not buy or certify them. Framework inclusion is an applicability prompt, not a claim of certification or exhaustive standards review.

## 6. Data-center new construction and replacement

There is no single U.S.-wide NIST data-center building permit standard. NIST research/control guidance supports design and operations; enforceable construction requirements come from the actual laws, adopted codes, amendments, permits and project conditions.

| Area | Baseline to investigate | New vs. replacement considerations |
| --- | --- | --- |
| Site and planning | Zoning, land use, access, easements, floodplain, geotechnical/seismic/wind/snow conditions and utility capacity | New sites need site approval; replacement/additions can change approved use/load/footprint |
| Building/structural | Locally adopted IBC and applicable existing-building code; referenced engineering standards and licensed design requirements | New buildings vs. alteration, change of occupancy, structural upgrade and demolition triggers |
| Fire/life safety | Adopted fire code, occupancy, egress, detection/suppression, emergency access and hazardous-material limits | Coordinate phased work with active fire protection and occupancy approvals |
| Electrical and backup power | Adopted NEC, permits/inspection, grounding/bonding, fault protection, standby systems and safe work | New UPS/generator/transfer equipment can require new studies, permits and outage procedures |
| Mechanical/plumbing/cooling | Adopted mechanical/plumbing/energy codes, cooling, water, refrigerants, ventilation and heat rejection | Verify replacement capacity, changed refrigerant/fuel/hazard and energy-code alteration triggers |
| Battery/fuel hazards | Adopted fire/electrical provisions; applicable NFPA 855, 110/111 and hazardous-material/storage rules | Chemistry, stored energy and fuel quantities drive scope; not all batteries are treated alike |
| Accessibility | ADA requirements for covered new construction/alteration and applicable local accessibility provisions | Replacement work can trigger accessibility obligations; do not assume staff-only spaces are automatically excluded |
| Worker safety | OSHA construction rules and general-industry operations rules; state-plan differences | Construction safety plus operational electrical, lockout/tagout, confined-space, lifting, chemical and emergency procedures as applicable |
| Air/environment | Generator air permits/emissions, construction stormwater, fuel/oil spill controls and applicable waste/refrigerant/demolition requirements | Temporary generators and replacement engines can still require permits; evaluate asbestos/lead for older structures |
| Commissioning/handover | Required inspections, acceptance tests, authority approvals and contractual commissioning | Verify integrated power/cooling/fire failure scenarios and safe transition before production cutover |

Authorities: [ICC building codes](https://www.iccsafe.org/ibc/), [ADA design standards](https://www.ada.gov/law-and-regs/design-standards/), [OSHA construction](https://www.osha.gov/laws-regs/regulations/standardnumber/1926/), [OSHA operations](https://www.osha.gov/laws-regs/regulations/standardnumber/1910), [EPA data-center air requirements](https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers), [EPA construction stormwater](https://www.epa.gov/npdes/construction-general-permit-cgp-frequent-questions), [EPA spill prevention](https://www.epa.gov/oil-spills-prevention-and-preparedness-regulations/overview-spill-prevention-control-and).

Potentially useful design/operation references include ANSI/TIA-942-C, Uptime Institute topology and operational sustainability guidance, ASHRAE thermal guidance and Standard 90.4, ISO/IEC 22237, relevant BICSI standards and NFPA 70/70E/72/75/76/110/111/855/13/2001. Each addresses a different purpose; not every document is mandatory for every facility. Local adoption, contract and engineering design determine relevance and edition. A Tier rating or TIA certification does not replace a certificate of occupancy, legal compliance or operational controls, and does not guarantee zero downtime.

Sources: [TIA-942](https://tiaonline.org/standard/tia-942/), [Uptime tiers](https://uptimeinstitute.com/tiers), [ASHRAE free read-only standards](https://www.ashrae.org/technical-resources/standards-and-guidelines/read-only-versions-of-ashrae-standards), [NFPA standards](https://www.nfpa.org/codes-and-standards). Some standards/certifications are paid; no purchase is required merely to use this app.

For a replacement/cutover project, document parallel capacity, backups and restoration evidence, migration rehearsal, rollback criteria, maintenance windows, change approvals, contractor access, temporary fire/power/cooling arrangements, secure equipment disposal, as-built drawings and post-cutover acceptance. Do not retire the old environment until the approved acceptance/recovery criteria are met.

## 7. International screening

International requirements depend on establishment, customers, people/data, services and contracts—not merely whether a website is accessible overseas.

- **EU/EEA:** assess GDPR territorial/role scope, lawful processing, controller/processor contracts, data rights, security, transfers and notification. DORA applies to covered financial entities; ICT-provider contracts and designated-critical-provider oversight are distinct paths. NIS2 and national implementations may also need sector/size/scope analysis. [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [DORA authority](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora).
- **United Kingdom:** UK GDPR/Data Protection Act, applicable financial-services/payment-services and operational-resilience rules require local scope review. [ICO organizational guidance](https://ico.org.uk/for-organisations/).
- **Other markets:** create a specific country review before expansion, including privacy, payment licensing, data localization/transfers, incident reporting, financial-sector outsourcing, consumer rules and national cybersecurity obligations. Canada, Brazil, Australia, Singapore, India and other countries cannot be collapsed into one universal international checklist. This register has not completed those jurisdiction-specific assessments.

## 8. Policy and evidence inventory

This is a consolidated implementation inventory. Some laws expressly require written policies; other entries are practical ways to implement obligations. **Do not label every row a government-mandated standalone document.** Map each row to the specific applicable rule, contract/control, owner, scope, approval date, review frequency and evidence.

| Policy / procedure family | What it should cover | Likely mapping to assess |
| --- | --- | --- |
| Governance and information-security program | Ownership, board/senior reporting, scope, authority, exceptions and review | GLBA, PCI, NYDFS if covered, CSF Govern |
| Risk and compliance management | Asset/data risk, legal register, risk acceptance, controls, assessments and remediation tracking | Applicable laws/contracts, RMF, ERM |
| Data inventory/classification | PAN, authentication data, financial NPI, PII, health/biometric data, flows and processors | PCI, financial/privacy duties |
| Collection and privacy notices | Purpose, notice, lawful authority/consent where needed, data minimization, rights and sharing | GLBA privacy, state/foreign rules |
| Retention, legal holds and destruction | Per-record retention schedule, deletion requests, holds, secure media disposal and backups | Financial records, privacy, PCI and applicable disposal rules |
| Identity/access/PAM | Least privilege, MFA, onboarding/offboarding, service accounts and reviews | PCI/security programs, NIST controls |
| Cryptography and payment keys | Encryption, HSMs, key custody, rotation, ceremonies, compromise and destruction | PCI/payment scope and applicable security rules |
| Account-data handling | PAN display/storage, prohibited authentication data, tokenization and secure transfer | PCI and network rules |
| Networks and secure configuration | CDE scope, segmentation, firewalls, remote access, baselines and infrastructure management | PCI, CIS/NIST and customer controls |
| Vulnerability and testing | Inventory, patching, scans, penetration tests, remediation deadlines and evidence | Applicable rules/contracts; preserve each distinct required cadence |
| Secure development/change | Threat review, coding/testing, dependency provenance, approvals, rollback and release integrity | PCI software scope, SSDF, security program |
| Logging and monitoring | Access/event records, integrity, alert triage, retention and privacy boundaries | PCI and covered financial/security obligations |
| Incident response and notification | Triage, decision authority, evidence, containment, recovery and jurisdiction/contract reporting matrix | Relevant breach and contract duties |
| Third-party/cloud/outsourcing | Diligence, contractual controls, subprocessors, access, monitoring and exit | GLBA providers, bank contracts, privacy/PCI shared responsibility |
| Continuity, backups and recovery | Dependencies, impact analysis, recovery objectives, independent backups, restore/DR tests | Contracts/regulators, NIST continuity, ISO 22301 |
| Physical security and visitors | Zones, access, escorts, logs, cameras, personnel and equipment movement | PCI, NIST PE, local privacy and safety |
| Facility operations | SOPs, methods of procedure, emergency operating procedures, maintenance, spares, training and escalation | Operations contracts, resilience/safety controls |
| Construction/replacement management | Permits, qualified design, work safety, contractor access, temporary safeguards, commissioning and cutover/rollback | Local adopted codes, OSHA, project contracts |
| Environmental and emergency safety | Applicable emissions/stormwater/spill controls, electrical safe work, lockout/tagout and evacuation | EPA/state/local and OSHA scope |
| Personnel and awareness | Appropriate screening, confidentiality, acceptable use, role training and sanctions | PCI, applicable program/contract requirements |
| AML/sanctions/fraud/customer disputes | Role-specific screening, reports, authorizations, fraud escalation and complaints | Actual BSA/OFAC/consumer/payment role |
| AI/model governance | Approved uses, data inputs, oversight, evaluation, bias/error monitoring and vendors | Applicable law/contracts; AI RMF as supporting guidance |
| Assurance and records | Control evidence, audit response, assessment results, corrective actions and management reporting | All applicable obligations and assurance commitments |

Avoid one generic retention period or one incident deadline across all records and jurisdictions. Keep sensitive card/financial/personal data out of public GitHub repositories, app previews and classroom demonstrations.

## 9. Inputs still required for a final company/facility determination

1. Legal entities, charters, licenses, regulators and bank/network contracts.
2. Whether the company acts as gateway, processor, acquirer, issuer, wallet, credit provider, ACH sender or money transmitter; exact movement/control of funds.
3. Data categories, where they are processed/stored, cloud/vendors, CDE boundaries, PIN/key/token roles and supported card networks.
4. U.S. states and foreign markets served; residence of affected people and whether consumer, employee, child, health or biometric information is involved.
5. Public-company and federal/defense/critical-infrastructure contractual status.
6. Facility city/county/state, new/replacement/alteration scope, adopted code editions/amendments, occupancy, utility capacity, generator/fuel/battery details and AHJs.
7. Existing evidence, assessments and exceptions—not only the names of policies.

This document is dated research, not an automatic legal-update feed. The monthly NIST workflow updates publication metadata only. Source links support further verification; unresolved jurisdictions and watchlist items remain explicit rather than being described as completed compliance work.
