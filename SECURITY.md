# Security policy

## Maintenance scope

The current main branch and latest documented release receive owner review as capacity allows. There is no guaranteed response time, long-term-support commitment or promise that every issue has been found. Review [architecture](docs/ARCHITECTURE.md), [operations](docs/OPERATIONS.md) and [test limits](docs/TESTING.md) before relying on the app.

## Report a vulnerability

Use this repository's GitHub Security tab and **Report a vulnerability** if private reporting is available. This documentation does not establish that the repository setting is enabled. If unavailable, open an issue requesting a private reporting channel without including exploit details, credentials, private data or sensitive logs. Do not post a secret or working sensitive exploit publicly.

Provide the affected commit/version, component, minimal reproduction, expected/actual behavior and impact. Redact personal and credential data. Do not test against other people's systems or stress the public host.

This static app does not provide a visitor account system or public write API. GitHub/hosting accounts and publisher metadata remain separate trust boundaries. Keep credentials outside public assets and source history. Follow the existing cost-approval requirement before adding external monitoring or security services.
