# OpenClaw plus OpenShell Status Report

## Official Status

OpenClaw **does have official documentation** for OpenShell — there's a page at `docs.openclaw.ai/gateway/openshell` describing it as a "managed sandbox backend for OpenClaw", listed alongside Docker and SSH backends. The team also has an open PR (`#54959` by mjamiv) adding 866 lines of OpenShell deployment docs. The team has gone the route of **documentation + supported sandbox backend** rather than a partnership announcement.

## Critical Bug: npm Name Collision

OpenClaw's `package.json` declares `"openshell": "0.1.0"` as an optionalDependency — but this resolves to an **unrelated npm Telegram bot package** (by jason026386), **NOT** NVIDIA's OpenShell CLI (which is not published on npm). This causes the bundled OpenShell module to crash on startup because the Telegram bot expects a `TELEGRAM_BOT_TOKEN`.

Open bugs:

- **Issue #59528**: "The bundled plugins openshell does not work correctly since version 2026.03.13" — reports sandbox lifecycle issues
- **Issue #56813**: "Bundled openshell module crashes exec tool" — the npm name collision described above

The community workaround is to rename the bundled module. **Neither bug has been fixed or even acknowledged by the OpenClaw team.**

## steipete's Involvement

- steipete has **not commented** on any OpenShell-related GitHub issues in `openclaw/openclaw`
- steipete has **not opened any PRs** about OpenShell in the OpenClaw repo
- steipete has **no public statement** about OpenShell on Mastodon (@steipete@mastodon.social) or Bluesky
- steipete's OpenShell-related commits exist only in the **NVIDIA/NemoClaw** repo, not in OpenClaw itself

## Bottom Line

The OpenClaw team has treated OpenShell as a **community-maintained sandbox backend option** with official docs, but the critical npm name collision bug has been left unfixed and steipete has been silent on all OpenShell issues in the OpenClaw repo. The integration status is: **documented but broken, with minimal team attention** (steipete's actual work on OpenShell goes into NemoClaw on the NVIDIA side instead).
