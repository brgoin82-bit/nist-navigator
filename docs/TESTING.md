# Verification record

Version 0.2.0 · October 13, 2026

## Automated results

The Windows Node 24.21.0 sequential run completed **36 tests: 36 passed, zero failed, skipped or cancelled**, approximately 0.8 seconds. The catalog used was the complete 20,393-record Sept2026 source, with 9,209 distinct original subjects and 44 normalized series. Source bytes: 84,486,668. Source SHA-256: `ac32062c7f70600185555ab520e0b6469e280bc70a876562df51ad035ec0b913`.

Four appearance checks cover preference validation, 432 sampled user-color/theme combinations against all defined main surfaces and their button text (minimum 4.5:1 contrast), persisted theme/color selection, and corrupt or denied storage. These are numerical/unit checks; they do not establish full visual or screen-reader accessibility compliance.

Windows PowerShell, current directory the cloned project:

```powershell
& 'C:\Program Files\nodejs\node.exe' --test --test-concurrency=1 tests/*.test.mjs
```

Coverage includes exact/partial/typo/abbreviation searches, publication numbers, suggestions, combined filters, sorting, pagination and totals, empty/related results, plain-text malicious-looking queries, GRC/data-center classification, original subject preservation, DOI recovery, DTD/malformed XML rejection, source-record completeness, duplicate/unsafe links, local traversal/Host/Origin rejection, fixed monthly data URL, credential-free/no-redirect fetches, explicit startup fallback, failed-refresh no-downgrade behavior, malformed remote data, older-release rejection, and replacing/retaining the actual search-worker engine across successful/failed refreshes.

A new worker integration test first exposed a Node harness/browser global mismatch (`onmessage` was not defined in Node). The worker handler was made explicitly global; the unchanged test then passed. This was not a hidden or skipped failure.

## Observed browser checks

Actual browser testing of the published app observed:

- All 20,393 records loaded.
- Subject and publication autocomplete; `Authentication` selection by keyboard returned 58 records.
- Misspelled `cybersecurty` returned 211 records.
- Data-center filter returned 88 records and next-page navigation worked.
- GRC filter returned 300 records and displayed official framework/control starting links.
- `800-37` within GRC returned four records under the fuzzy search rules.
- The live Refresh catalog button showed a busy state, then a success message; the query and GRC filter remained in place.

The monthly-update channel and GitHub execution evidence are recorded in Actions after the first workflow run. The monthly calendar occurrence itself cannot be observed until its scheduled date. Creation of a workflow is not by itself a successful-run claim.

## Not established by these tests

No claim of complete security, formal accessibility compliance, legal compliance, every possible interaction, or continuous uptime. Automated/live tests do not prove coverage of all NIST material outside the source export, every possible spelling/synonym, every browser/device, prolonged load, full screen-reader operation, all network failures or future provider changes. Filesystem disk-full and power-loss tests were not performed. The initial tests were sequential; no deep scanner or multi-agent review was launched.
