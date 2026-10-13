# Operations, updates and recovery

Version 0.2.0 · October 13, 2026

## Deployment model

- Public app: https://nist-navigator.brgoin82.chatgpt.site
- Public source/update channel: https://github.com/brgoin82-bit/nist-navigator
- Source: official https://github.com/usnistgov/NIST-Tech-Pubs/releases
- Client data: fixed HTTPS `raw.githubusercontent.com/brgoin82-bit/nist-navigator/main/dist/catalog.json`.
- Local preview: http://127.0.0.1:5180 . SignalWatch is separate and is not modified by this app.

The app is static. The hosted frontend stays in place while monthly data changes are published to the public GitHub repository. A frontend/code change still requires republishing the website; a verified catalog-only change does not. GitHub changes do not automatically deploy new frontend files to the Sites host.

## Monthly schedule

The workflow `.github/workflows/monthly-catalog.yml` runs on the 10th at 14:17 UTC. The schedule is in UTC, not a fixed Chicago hour across daylight saving changes. This date provides time for NIST's usual early-month bulk release, but NIST does not promise a precise release date.

The job installs the locked SAX parser without lifecycle scripts, downloads the latest official MODS release, verifies exact source bytes and SHA-256, checks every record, applies current classifications, runs the sequential suite, and commits only the catalog and successful-check timestamp. Every successful run records an actual check even when the NIST source release is unchanged. The workflow does not use AI and does not wake this chat.

It runs on a standard `ubuntu-latest` public-repository GitHub runner with a 12-minute timeout and one publication job at a time. The runtime is pinned to Node 24.21.0; the checkout/setup actions are pinned to verified immutable commits. Node and action pins still need periodic owner maintenance for support/security. No cache or extra storage purchase was enabled. The automatic repository token is restricted to the job; no personal access token or Sites credential is saved in the repo.

[GitHub standard public runners are free](https://docs.github.com/en/actions/concepts/billing-and-usage). Host quotas, outages, provider policy changes and rate limits still apply. Free does not mean guaranteed 100% uptime. GitHub may disable scheduled workflows after 60 days without repository activity. Successful monthly check commits provide real activity, but check Actions if updates stop. Do not create AI-based heartbeat monitors as a substitute.

## Run a check now

On GitHub, open **Actions → Monthly NIST catalog update → Run workflow**, choose `main`, then **Run workflow**. Wait for a green successful run. Confirm its commit updated `dist/update-status.json`, then use **Refresh catalog** in the app. Only owners/collaborators with appropriate repository permission can run this; visitors have no importer write endpoint.

A scheduled workflow definition is not proof that a run succeeded. Read the actual run result and published timestamp. There is no exact-time guarantee: [GitHub schedules can be delayed](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

## Run locally

Windows PowerShell, with the current directory set to the cloned `nist-navigator` repository:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci --ignore-scripts
& 'C:\Program Files\nodejs\node.exe' scripts/sync-catalog.mjs
& 'C:\Program Files\nodejs\node.exe' --test --test-concurrency=1 tests/*.test.mjs
& 'C:\Program Files\nodejs\node.exe' scripts/serve.mjs 5180
```

The import uses a fixed output path independent of your working directory. `--force` rebuilds classifications even for an unchanged source hash. The preview binds only 127.0.0.1. The browser preview reads the shared published catalog when reachable; local catalog edits appear only as its outage fallback unless the public update channel is also published. Do not expose this development server to the Internet.

## Failure handling

| Symptom | What to check | Safe action |
| --- | --- | --- |
| Workflow red/failed | Exact failed step in Actions | Retain published catalog. Correct the cause, then rerun once. |
| Source 403/429 or network timeout | NIST/GitHub availability and rate limits | Wait and rerun later; do not disable TLS or validation. |
| Checksum, parse or shrink failure | Official release size/digest, record structure and count | Investigate upstream change. Do not bypass the gate just to publish. |
| Refresh failed | Network, GitHub update channel, browser console | Continue with loaded records; try later. |
| Fallback snapshot label | Public update channel unreachable | Check Actions and GitHub. The bundled source may be old. |
| Search returns zero | Area/subject/series/year combinations | Reset filters. Do not infer that no publication exists. |
| Local sync reports a lock | Whether the specific import process still runs | Do not remove a live lock. Inspect an interrupted run before removing only its stale lock. |
| Local asset route unavailable | App/server version mismatch | Restart only this app's own preview process; never terminate all Node processes. |

An unsuccessful refresh never becomes a healthy-looking empty catalog. An initial fallback is explicitly labeled. Browser requests do not send the search phrase to GitHub. Initial remote load can take time because the catalog is approximately 17 MB.

## Recovery and rollback

Before local replacement, the importer retains `.runtime/catalog.previous.json`, outside public assets and Git. This same-disk copy is not an independent disaster recovery backup. GitHub's committed monthly catalog history supplies a separate recoverable copy.

For a bad published catalog, identify the last verified catalog commit, review it, and revert the offending catalog commit with a new commit. Do not rewrite shared history or force-push. Keep the paired status timestamp honest: restoring an older release must be clearly recorded, not described as a fresh NIST release. Browser refresh rejects a release older than its active release; a deliberate rollback may therefore require reopening the app and a clearly documented owner recovery decision.

For a bad frontend release, redeploy the preceding verified Sites version. The prior website remains a recoverable deployment artifact. Source history in the Sites repository and public GitHub repository are separate; synchronize deliberate frontend changes to both.

## Maintenance ownership

The owner reviews failed-run notifications and Actions history, provider/free-tier changes, dependency/runtime advisories, and changes to source schemas. GitHub notification delivery depends on account preferences; no separate alert service was configured. The separate compliance register and prose guides require human review when laws or standards change—they are not rewritten by the NIST catalog workflow.
