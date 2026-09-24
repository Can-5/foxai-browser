# Security Policy

FoxAI Browser takes the security of our users seriously. This document
describes which versions are supported, how to report vulnerabilities,
what is in scope, and what researchers can expect from us.

## Supported Versions

Security updates are provided for the following versions:

| Version       | Supported          |
| ------------- | ------------------ |
| `main` branch (latest) | :white_check_mark: |
| Tagged releases (`>= latest stable`) | :white_check_mark: |
| Older tagged releases | :x: |

We recommend always running the latest stable release. Only the `main`
branch and the most recent stable tag receive security fixes. Older
releases are supported on a best-effort basis and may not receive patches.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately using one of the following channels:

- Email: [security@foxai.dev](mailto:security@foxai.dev) (preferred)
- Fallback: [kygszilkaycan@icloud.com](mailto:kygszilkaycan@icloud.com)

To help us triage your report quickly, please include:

1. A description of the vulnerability and its potential impact.
2. Steps to reproduce (proof of concept, screenshots, or scripts).
3. The affected version, commit hash, platform, and OS.
4. Your contact details for follow-up questions.

PGP encryption is optional. If you require encrypted communication,
mention it in your initial email and we will provide a public key.

### What to expect

- **Acknowledgement:** we will acknowledge receipt within **48 hours**.
- **Assessment:** we will share an initial severity assessment and
  remediation plan within **7 days**.
- **Fix timeline:** we aim to ship a fix or mitigation within **90 days**
  of confirmation, depending on severity and complexity.
- **Coordinated disclosure:** we follow a **90-day coordinated disclosure**
  policy. Please do not publicly disclose the issue before the fix is
  released or the 90-day window expires, unless otherwise agreed.

## Scope

The following are considered **in scope**:

- **Browser core:** Firefox-based client code, build scripts, and
  bundled extensions in this repository.
- **Edge worker:** `cloudflare-worker.js` and `ddos-guard.js`
  (WAF, rate limiting, and bot mitigation logic).
- **Website:** static site served at
  [https://can-5.github.io/foxai-browser](https://can-5.github.io/foxai-browser)
  (`index.html`, `download.html`, `main.js`, `styles.css`).

The following are generally **out of scope**:

- Third-party services (GitHub Pages, Cloudflare, Google) themselves.
- Social engineering, phishing, or physical attacks.
- Denial-of-service attacks against production infrastructure.
- Reports from automated scanners without a demonstrated impact.

## Safe Harbor

We consider security research conducted in good faith and in compliance
with this policy to be authorized. We will not pursue legal action
against researchers who follow this policy, and we ask that you:

- Avoid accessing, modifying, or deleting other users' data.
- Avoid degrading the availability of our services.
- Act in good faith and stop testing if you cause unintended harm.

## Verifying Releases

All stable releases publish checksums and provenance attestations.
Before installing, please verify your download:

1. Download `SHA256SUMS` and `SHA256SUMS.sig` from the release page.
2. Verify the checksum: `sha256sum -c SHA256SUMS`.
3. Verify provenance via the Sigstore attestation linked on the release
   page (see the `release.yml` workflow for details).

If verification fails, do not install the artifact and contact us
immediately at [security@foxai.dev](mailto:security@foxai.dev).

## Hall of Fame

We gratefully acknowledge researchers who help keep FoxAI Browser safe.
With the reporter's permission, we list contributors in our
[GitHub Security Advisories](https://github.com/Can-5/foxai-browser/security/advisories)
and credit them in the corresponding release notes.

Thank you for helping protect our users.
