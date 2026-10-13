# NIST Navigator 0.2.1

An independent, free publication finder using open-source components. Search by partial words, small typos, common security abbreviations, publication number, subject, author, series and publication year. Suggestions appear below the search box and can be selected with a mouse or Up/Down/Enter. Escape closes suggestions. The subject areas include Data centers & infrastructure and subjects beyond cybersecurity.

Not affiliated with or endorsed by NIST. This is document discovery, not an AI question-answering service or legal/compliance determination.

## Cost and sharing

No paid API, AI inference, analytics, account requirement, database service or monitoring subscription is built into the app. Only the owner-side XML import uses a third-party package: pinned MIT-licensed `sax` 1.6.1. The browser app has zero package dependencies. The published site consists entirely of static files; searching runs in each visitor's browser, with no shared search server and no visitor write endpoints. Classmates can use the public link independently. Host and Internet availability/quotas still apply; this does not promise unlimited free hosting or continuous uptime. No billing plan or paid resource was configured.

The Copy share link button copies the published URL. On localhost it explicitly warns that the address is not shareable to other computers. Source code changes and publication remain owner-controlled; public viewers do not receive editing rights.

## Verified catalog coverage

Official source: https://github.com/usnistgov/NIST-Tech-Pubs/releases

The first import contains **20,393 / 20,393 records** from the `Sept2026` NIST Research Library MODS release, published October 2, 2026. The 84,486,668-byte source was checked against the release SHA-256 `ac32062c7f70600185555ab520e0b6469e280bc70a876562df51ad035ec0b913` before publication. Original catalog subjects are retained (9,209 distinct labels); there are 44 normalized series. Topic grouping is inferred by transparent rules in `dist/search-core.mjs`, not official NIST classification.

**This does not meet an unqualified “every NIST publication ever” claim.** The official bulk export is a complete import of that source, but it does not establish coverage of all NIST-authored external journal papers, every CSRC draft, or every document elsewhere on nist.gov. Broader official searches are linked in About & coverage. Full-text PDF indexing is not implemented. The catalog contains historical and possibly withdrawn or superseded publications; the app does not label them current. Original records can contain metadata errors, including future publication years. Verify the current status and edition at the source DOI.

Record totals do not equal unique DOIs or publication families: separate versions and library records remain distinct. No sample/fabricated publications are supplied. No arbitrary history cap or search-result cap is used; results paginate 20 at a time.

## Run on Windows

Requires maintained Node.js 22.13+ and a modern browser. PowerShell, from this folder:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci --ignore-scripts
& 'C:\Program Files\nodejs\node.exe' scripts/sync-catalog.mjs
& 'C:\Program Files\nodejs\node.exe' scripts/serve.mjs 5180
```

Open http://127.0.0.1:5180/. The local server binds loopback only. It does not touch SignalWatch or port 5173. Do not bind this helper to a LAN interface or expose it through a tunnel. Publish the static `dist` directory for class sharing. No compiler or framework build is required.

## Refresh

Run `node scripts/sync-catalog.mjs`. It checks the latest official NIST release, skips an unchanged source hash, bounds the download and XML parse, validates every record and the complete source digest, and only then atomically replaces `dist/catalog.json`. A prior catalog is retained as `.runtime/catalog.previous.json` (outside public assets and excluded from Git). `--force` rebuilds unchanged source after importer/classification code changes. Failed imports preserve the prior catalog. An exclusive `.runtime/sync.lock` prevents concurrent writers; an interrupted lock requires inspection, not blind deletion.

The **source is a monthly published release**, not a real-time API. **Refresh catalog** reloads the latest published catalog without clearing your search, subject, series or area; it returns to page 1. It does not run an owner-side XML import or force NIST to publish newer records. A failed refresh keeps the previous in-memory search engine usable.

The free GitHub workflow in `.github/workflows/monthly-catalog.yml` checks the official source on the **10th of every month at 14:17 UTC (9:17 AM CDT / 8:17 AM CST)**. GitHub scheduling can be delayed. It can also be run manually from **Actions → Monthly NIST catalog update → Run workflow** on `main`. The workflow uses a standard public-repository runner, a locked parser, immutable action revisions, SHA-256/size verification, completeness checks, and the sequential tests before committing the public catalog and successful-check timestamp. It has no AI steps, paid APIs, paid runner, extra cache allocation, or externally stored token. The job's repository-scoped GitHub token exists only for that run; publishing accepts the expected repository, branch and schedule/manual events only. Failure prevents the publish step and preserves the last published catalog. Source check history is visible in Actions and `dist/update-status.json`.

The hosted app and local preview request the fixed public catalog at `https://raw.githubusercontent.com/brgoin82-bit/nist-navigator/main/dist/catalog.json` on load or Refresh. Searches remain local. The host's frontend therefore does not need republishing for monthly data changes. If the public catalog is unavailable at initial load, a **clearly labeled bundled fallback snapshot** is used; a manual-refresh failure never silently replaces a newer catalog with that fallback. Older-release refreshes are rejected. GitHub's CDN may briefly cache new files, even with a no-store browser request. GitHub can disable schedules after 60 days without repository activity; monthly successful-check commits provide real activity, but owners should still monitor Actions for suspension/failures. No AI automation is needed or created. Updating a local file alone does not publish it to the shared GitHub channel.

The **Governance, Risk & Compliance** area groups risk management, governance, controls, assessments and compliance-related catalog records. `grc` is a supported search abbreviation. Its official starting-point links include CSF 2.0, RMF, SP 800-53, risk assessments and the Privacy Framework, including resources not proven present in the bulk export. These are guidance links, not a declaration of legal applicability. Groupings are recalculated from each validated catalog with the current client rules. The initial GRC classification contains 300 records; future source metadata may change this count.

## Architecture

```text
lib/catalog.mjs             Bounded MODS XML parsing and official-link validation
scripts/sync-catalog.mjs    Owner-side HTTPS import, SHA-256 and atomic replacement
scripts/serve.mjs           Fixed-file loopback preview server
dist/index.html/styles.css Accessible responsive interface
dist/app.mjs               UI, suggestions, filtering and keyboard behavior
dist/search-core.mjs       Pure matching, synonyms, fuzzy edit distance, area rules
dist/search-worker.mjs     Browser-isolated indexing and search worker
dist/catalog-loader.mjs    Fixed public update channel and explicit snapshot fallback
dist/catalog.json          Public, generated, verified metadata snapshot
dist/update-status.json    Successful source-check date and verified release hash
scripts/record-update.mjs  Record a completed source check after tests
scripts/publish-catalog.mjs Restricted GitHub runner publication; not a local command
.github/workflows/         Free monthly scheduled source check and publication
tests/app.test.mjs          Deterministic and actual-catalog checks
```

Search uses a browser worker so indexing does not block the interface. Exact tokens, prefixes, punctuation-normalized IDs, limited typo distance and a small explicit synonym dictionary contribute to ranking. If no record matches all meaningful words, related matches are visibly labeled. This is not unrestricted semantic understanding: not every synonym, language, question or misspelling is recognized. Facet counts show the whole catalog; result totals reflect combined filters. Reset filters restores the full search scope.

## Security Controls

- Browser searches remain local; no search text, telemetry, credentials or student data are sent to an AI service or backend. Normal static hosting receives file requests/IP metadata; opening a source link contacts the linked provider.
- No public write API, database credentials, account sessions or administrative UI exist in the app. Hosting-account permissions are a separate platform boundary.
- Browser output is built with DOM nodes and `textContent`, not HTML interpolation. Publication links allow only HTTPS NIST, DOI and NIST library destinations with no embedded credentials or custom port.
- Catalog JSON is validated before indexing; browser downloads are bounded to 40 MB and 45 seconds, with no credentials or redirects. XML rejects DTDs, excessive nesting, fields and record counts. Source download is limited to 110 MB and 180 seconds, and the exact GitHub release checksum and size must match. No downloaded code or PDF is executed. The XML checksum verifies the import source, not a separate digital signature on browser JSON; the GitHub account, HTTPS and publisher pipeline remain trust boundaries.
- Import URLs/redirects are restricted to the official GitHub repository endpoint and reviewed GitHub asset hosts. TLS verification is never disabled.
- Local HTTP allows fixed public files only, rejects cross-site Origin, forged Host, non-read methods and traversal, and adds CSP/nosniff/referrer headers. Production meta CSP is present; `_headers` is included for hosts that support it. Host-specific header enforcement requires checking after deployment.
- Installation uses `--ignore-scripts`; import dependency is pinned and locked. `npm install` on October 13, 2026 reported zero advisories in the two-package graph. This is not a complete security assessment.

## Threat model and Residual Risk

Assets are the app source, verified catalog and owner hosting access. Trust boundaries are NIST/GitHub metadata into the importer, the generated catalog into the browser, and the published static host into a visitor's browser. Malicious markup, unsafe URLs, XML entities, accidental incomplete imports and traversal are mitigated as above. Compromised owner accounts, compromised upstream releases, malicious browser extensions, denial of service at the host, disk loss, misinformation in source metadata and public-link redistribution are not eliminated. Same-disk prior catalogs are not disaster-recovery backups. Full publication/PDF content and live status are not verified by the checksum.

## Testing and accessibility

```powershell
& 'C:\Program Files\nodejs\node.exe' --test --test-concurrency=1 tests/*.test.mjs
```

24 checks passed on October 13, 2026 after Data centers/DOI normalization changes, including actual catalog completeness, fuzzy search, synonyms, ID searches, suggestions, filters, sorting, pagination, dangerous links, DTDs, malformed XML, traversal and Host/Origin controls. Actual browser verification covered catalog load, autocomplete subjects/publications, Up/Down/Enter selection, misspelled cybersecurity search (211 results), Data centers area (88 results), and next-page navigation. No claim is made that these tests cover every possible interaction or guarantee uptime. Screen-reader testing and prolonged load/outage testing have not been performed.

Controls have visible labels, focus outlines, semantic results, live status, native selects, keyboard autocomplete and a closable native dialog. The layout supports narrow screens, with horizontally scrollable subject areas. Source subject labels are numerous; type in the main search to get subject suggestions instead of scrolling thousands of options. Loading failures are explicit; a missing catalog is not shown as a healthy empty library.

## Security review status

- Last Security Review Date: October 13, 2026.
- Last Architecture Review Date: October 13, 2026.
- Standards/Guidance Reviewed: OWASP DOM-based XSS prevention; NIST official metadata repository and technical publication guidance; SAX maintainer documentation; Sites static publishing/identity instructions.
- Dependencies Reviewed: sax 1.6.1 and generated lockfile; zero install-time reported advisories.
- Known Vulnerabilities Found: none identified in this bounded implementation review; no full security scan performed.
- Remediation Status: importer whitespace retention and ambiguous catalog DOI links corrected before release.
- Residual Risks: upstream/host compromise, availability, scope gaps and source metadata inaccuracies as above.
- Next Recommended Review: before extending ingestion, enabling full-text search, changing hosting/access or upgrading dependencies.

References: https://github.com/usnistgov/NIST-Tech-Pubs ; https://www.nist.gov/nist-research-library/nist-publications ; https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html ; https://github.com/isaacs/sax-js

## Documentation

Version 0.2.1 repairs the **Accent** picker. Its in-app panel provides named presets, native keyboard/mouse Hue/Saturation/Lightness sliders, a validated six-digit hex field and a live applied-color preview. The platform color popup is no longer used. Updates are coalesced with requestAnimationFrame, active sliders are never rewritten by their input handlers, and browser storage is written only on commit/Done/theme changes—not on every drag movement. Both input and change paths are handled. Contrast correction uses a bounded binary search instead of coarse 1% jumps. Brightness is adjusted to maintain at least 4.5:1 text contrast against defined main surfaces; filled buttons use readable black/white text. The selected theme/color remains browser-local, with blocked/corrupt-storage fallback. No search, personal information or shared account profile is persisted. The current sequential suite has **39 passing checks**, including a 120-event/one-paint batching check and 432 sampled color/theme combinations. This is not exhaustive accessibility/security verification.

- [User guide](docs/USER-GUIDE.md): plain-language walkthrough, GRC, search, filters, refresh and sharing.
- [Operations and recovery](docs/OPERATIONS.md): monthly updates, manual runs, failure recovery, rollback and zero-cost limits.
- [Architecture and security](docs/ARCHITECTURE.md): trust boundaries, data integrity and residual risks.
- [Test evidence](docs/TESTING.md): exact checks, observed results and unverified cases.
- [Payment processor and data center applicability register](docs/COMPLIANCE-REGISTER.md): U.S. baseline, conditional international requirements, frameworks and policy inventory. This research document is not part of NIST's publication catalog and is not automatically updated by the catalog workflow.
- [Changelog](CHANGELOG.md): release history and scope.

Current public source: https://github.com/brgoin82-bit/nist-navigator . App: https://nist-navigator.brgoin82.chatgpt.site . NIST source metadata and quoted document titles retain their original attribution. The independent application source is licensed under MIT; third-party NIST material is not relicensed by that license.
