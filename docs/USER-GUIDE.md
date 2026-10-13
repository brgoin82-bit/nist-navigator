# NIST Navigator: user guide

Version 0.2.1 · October 13, 2026

## What it does

Think of this as a library finder. It helps you locate NIST documents and then opens the original source. It does not invent an answer, summarize a full PDF, or tell you that your business is legally compliant.

Open [NIST Navigator](https://nist-navigator.brgoin82.chatgpt.site). Classmates can use this public link without signing in. Public viewers can search, filter, read and copy what their browser permits. They cannot edit the hosted application or catalog through the app. The link can be forwarded by anyone; it is not an invitation-only site.

## Find a publication

1. Start typing in the large search box. You do not need the complete title.
2. Suggestions appear underneath. Click one, or use Up/Down and Enter. Escape closes the list.
3. Try a subject such as `passwords`, an abbreviation such as `grc`, or a document number such as `800-53`.
4. Select an area on the left to narrow the topic. More than one area may describe a document.
5. Optionally select a publication series, an original catalog subject, or a year range.
6. Open the title or **Open publication** link. Check its revision, date, errata and withdrawal status on NIST's page.

Small misspellings, partial words, punctuation differences and a limited list of common abbreviations are supported. This is not an AI assistant: it cannot understand every question or synonym. A related-results message means no record matched all the meaningful words, so some-word matches are being shown instead.

## Governance, Risk & Compliance

Select **Governance, Risk & Compliance**. The current source has 300 records matching our transparent rules, including risk frameworks, controls, assessments and governance. Start with the official quick links above the results: CSF 2.0 and its Govern function, RMF, SP 800-53 controls, risk assessments and the Privacy Framework. Some of these links cover important official resources not established as present in the bulk export.

NIST guidance is not automatically a legal requirement for every business. Laws, contracts and government requirements can incorporate it. The separate [compliance reference](COMPLIANCE-REGISTER.md) explains that distinction.

## Data centers and other subjects

**Data centers & infrastructure** includes relevant catalog metadata for cloud, continuity, computing rooms, power and related infrastructure. **Buildings & fire safety** contains a wider set of construction and fire research. These broad inferred groups are not a substitute for local building codes, permits or an engineer's review. Use the original **Catalog subject** field for NIST's own labels.

## Sorting, counts and pages

- **Best match / newest** ranks meaningful word matches and then newer publication years. With no search text, newer years appear first.
- Other choices are newest, oldest and title order.
- Sidebar and dropdown counts describe the entire catalog. The number above the results reflects your combined filters.
- Twenty records appear per page. Next/Previous browse the rest; there is no hidden first-100-results cutoff.
- Separate library records and revisions remain separate. A record count is not a count of unique publication families.

If nothing appears, use **Reset filters** and try a shorter search. Zero results does not prove that NIST has no guidance on the topic.

## Refresh and monthly updates

The catalog is checked automatically on the 10th of every month at 14:17 UTC: 9:17 AM in Chicago during daylight saving time and 8:17 AM during standard time. Your laptop does not need to be on. GitHub may delay scheduled runs.

**Refresh catalog** downloads the latest successfully published catalog. It keeps your search, area, series, subject and year filters, returning to page 1. It does not force a new NIST release or trigger a privileged workflow from a classmate's browser. Only the repository owner can manually start the importer through GitHub Actions.

If a refresh fails, the loaded catalog remains searchable. If initial loading cannot reach the public update channel, the app labels its bundled fallback snapshot. The source release and import date remain visible in **About & coverage**. A fallback is useful but may be outdated.

## Appearance

Use **Dark high contrast** in the top bar to switch themes. Its pressed state means dark mode is on. **Accent** opens the app's own color panel, not the browser's native popup. Choose a named preset, move the Hue/Saturation/Lightness bars, or type a six-digit hex color such as `#7C3AED`. Sliders also accept keyboard arrows/Home/End. The live preview shows the color actually applied to buttons, links and selected areas. Click Done, click outside the panel, or press Escape to close it; Escape/Done returns focus to Accent. Changes are saved after adjustment finishes.

The app adjusts brightness if needed so accent text has at least 4.5:1 contrast against defined main surfaces, and selects black or white text for filled accent buttons. The panel explains when the applied color differs from your chosen color. Very bright colors may be darker in light mode; very dark colors may be lighter in dark mode. Invalid hex values are flagged and never replace the last valid accent.

Theme and chosen color are saved only in your browser's local storage. Each classmate chooses independently. No account or server profile is created. If browser storage is blocked or corrupt, the app still opens with safe defaults. These controls do not change the catalog or filters. Full screen-reader testing has not been performed.

## Sharing and privacy

Use **Copy share link**, or copy the address bar. A localhost/127.0.0.1 address works only on the computer running the preview; the button warns about this.

Search words stay in your browser. There are no app accounts, saved searches, tracking scripts or AI calls. Only your appearance preference is saved locally. The website host and GitHub still receive ordinary file-request connection metadata such as an IP address. Opening a source link contacts NIST or the DOI provider. Public GitHub source and NIST data are readable by everyone; no student data belongs in that repository.

## What is not promised

The initial library contains all 20,393 records from the official Sept2026 MODS export. This is not proof that every NIST-authored external journal article, every draft, or every website document is included. Search covers metadata, not all PDF text. The service does not guarantee uninterrupted availability, real-time publication detection, or legally complete compliance answers.
