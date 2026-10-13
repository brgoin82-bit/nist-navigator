# Architecture and security

Version 0.2.1 · reviewed October 13, 2026

## Why a static app

A static frontend with browser-local search avoids a shared search service, visitor accounts, public write APIs, database hosting and paid AI inference. It fits a free classroom document-finder. A scheduled owner-controlled importer is separate from the read-only visitor interface.

Data flow: official NIST MODS release → validated bounded importer → sequential tests → committed public JSON → browser validation → worker search index → text-only result cards → original NIST/DOI links.

The hosting platform controls publication/access; GitHub controls source and scheduled publishing. Anonymous visitors do not receive either platform's credentials. The public app loads JSON, not executable code, from GitHub. All frontend modules come from its own website origin.

## Important components

| Component | Responsibility |
| --- | --- |
| `lib/catalog.mjs` | Strict streaming XML parser, normalized metadata and official links |
| `scripts/sync-catalog.mjs` | Fixed official release acquisition, source digest/size, completeness, lock and atomic replacement |
| `dist/search-core.mjs` | Pure search, fuzzy matching, synonyms, area inference and schema checks |
| `dist/catalog-loader.mjs` | Fixed public data channel, bounded fetch, no credentials/redirects, explicit startup fallback and older-release rejection |
| `dist/search-worker.mjs` | Isolated indexing/search and atomic in-memory engine replacement |
| `dist/app.mjs` | Accessible controls, status, result cards and preserved refresh filters |
| `dist/appearance.mjs` / `appearance.css` | Validated light/dark preferences, custom accent contrast adjustment and local-only storage |
| `scripts/serve.mjs` | Loopback-only, fixed-file local preview |
| `.github/workflows/monthly-catalog.yml` | Monthly/manual trusted-branch import, test and publish |
| `scripts/publish-catalog.mjs` | Expected-repository/branch/event checks and catalog-only Git publication |

## Security controls

- Untrusted titles/subjects/notes render through text nodes, not HTML strings or `eval`.
- Publication destinations allow only HTTPS NIST, DOI and NIST library hosts, without credentials or unexpected ports.
- XML DTDs, malformed documents, excessive depth/fields/records and duplicate IDs are rejected. Incomplete records stop the import rather than silently disappear.
- Source acquisition limits bytes, time and redirects, restricts asset hosts, and verifies the official release digest/size. Unexpected shrinkage fails closed.
- JSON acquisition is bounded to 40 MB/45 seconds. Required metadata, record count, IDs and destination links are validated before search indexing.
- A replacement search engine becomes active only after validation and indexing succeed. A failed manual refresh leaves the prior engine usable and reports failure.
- Static source modules and restrictive CSP reduce script injection. CSP permits the reviewed GitHub raw-data host for data only. Production header enforcement is host-dependent; the HTML also carries a meta CSP.
- Local preview binds only loopback; fixed file allowlists, Host/Origin checks and read-only methods protect the helper. Runtime, Git metadata, secrets and backups are not served.
- The GitHub workflow has no untrusted pull-request trigger, no saved personal token and no paid AI calls. Publication accepts only the expected public repository, `main`, and schedule/manual events. Tokens are not printed or put in command arguments/configuration files; an ephemeral process environment supplies the Git authorization header.
- Workflow actions use immutable official commits and the parser uses an exact version/lockfile. Lifecycle install scripts are disabled. These pins require future maintenance.

## Trust boundaries and residual risks

Appearance is the only browser-local persisted setting: a validated light/dark choice and six-digit hex accent. No search data is saved. Local-storage failures are caught so privacy settings do not break startup. The in-app panel uses native range controls, bounded HSL conversion and hex validation; no user string is inserted as CSS or HTML. Paints are batched by animation frame and storage is written only on commit. Active slider values are not reset during input. Contrast correction uses a bounded binary search; chosen accents are adjusted to 4.5:1 against defined main surfaces, with black/white filled-button text chosen by contrast. This is not certification of all page elements or assistive-technology behavior.

The official XML release checksum detects incomplete/changed download bytes, not false statements in NIST metadata. Browser JSON is trusted through HTTPS and the owner's controlled GitHub publishing pipeline; it is not separately digitally signed. A compromised owner/upstream account can corrupt that chain of trust. A browser schema check does not establish that every title is factually correct.

Classification is approximate, not official NIST tagging. Original subject labels are preserved separately. Search is heuristic, not unrestricted semantic understanding. The catalog can include historical or superseded versions and source metadata mistakes. Full publication text, live revision status and all external journal/draft coverage are not verified.

Host/provider outages, GitHub scheduling delays or disabling, CDN caches, rate limits, browser extensions, low-memory devices and network loss remain possible. No uptime SLA, full penetration test, screen-reader certification or exhaustive vulnerability audit is claimed. Normal host/GitHub requests expose routine connection metadata to those providers. Users can forward the public link.

## Review record

- Last architecture/security/input/filesystem review: October 13, 2026.
- Dependency: MIT-licensed SAX 1.6.1, pinned; original npm install reported zero advisories. No browser package dependencies.
- Guidance consulted: [OWASP DOM XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html), [official NIST metadata](https://github.com/usnistgov/NIST-Tech-Pubs), [GitHub Actions permissions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication), [schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), and Sites publishing guidance.
- Tests and evidence: [TESTING.md](TESTING.md). Review is bounded implementation work, not a certification.
- Next review: source schema changes, new network destinations, full-text indexing, authentication, dependency updates or hosting changes.
