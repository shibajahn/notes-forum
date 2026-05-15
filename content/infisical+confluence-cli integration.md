# infisical+confluence-cli integration

## Security analysis of confluence-cli

Package: `confluence-cli` v2.6.3 (npm)
Author: pchuri (single maintainer)
License: MIT
Repository: https://github.com/pchuri/confluence-cli

### Verdict: Safe to install

No security vulnerabilities found. All 9 dependencies are well-known, widely-used packages (axios, commander, chalk, etc.). No lifecycle scripts, no remote code execution, no obfuscated code.

### Key findings

- **No malicious patterns** — no postinstall/preinstall scripts, no eval(), no remote code loading
- **Local analytics only** — `lib/analytics.js` tracks usage stats locally at `~/.confluence-cli/stats.json`, no external network calls. Disable with `CONFLUENCE_CLI_ANALYTICS=false`
- **Credentials stored in plain text** — `~/.confluence-cli/config.json` if using `confluence init` (interactive or flags). Mitigate with `chmod 600 ~/.confluence-cli/config.json`
- **Single maintainer** — personal Gmail, 87 releases, actively maintained. Key-man risk if they disappear.

### Environment variables supported (no disk write)

```bash
export CONFLUENCE_DOMAIN="your-domain.atlassian.net"
export CONFLUENCE_API_TOKEN="your-api-token"
export CONFLUENCE_EMAIL="user@example.com"
export CONFLUENCE_API_PATH="/wiki/rest/api"
export CONFLUENCE_AUTH_TYPE="basic"
# mTLS:
export CONFLUENCE_TLS_CLIENT_CERT="~/.certs/client.pem"
export CONFLUENCE_TLS_CLIENT_KEY="~/.certs/client.key"
# Cookie auth:
export CONFLUENCE_COOKIE="JSESSIONID=abc123..."
# Read-only mode:
export CONFLUENCE_READ_ONLY=true
```

Only env vars + direct command use = zero disk credential storage.

## Infisical integration

Infisical `exec` command injects secrets as environment variables into child processes. Since confluence-cli reads credentials from env vars, the integration is seamless.

### Setup

1. Install Infisical CLI: `brew install infisical/get-cli/infisical`
2. `infisical login` — authenticate
3. `infisical init` — configure project
4. Add secrets in Infisical: `CONFLUENCE_DOMAIN`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_EMAIL`

### Usage

```bash
# Wraps confluence-cli with Infisical env vars
infisical exec -- confluence read 123456789
infisical exec -- confluence search "something"
infisical exec -- confluence create "My Page" SPACEKEY --content "Hello"
```

### Optional convenience alias

```bash
alias confluence='infisical exec -- confluence'
# Then just: confluence read 123456789
```

### Benefits

- Secrets stay in Infisical vault only — never written to disk
- Each invocation fetches fresh secrets (good for rotation)
- Environment-specific secrets (dev/staging/prod) via Infisical project environments
- Audit trail from Infisical (who ran what and when)
- No `config.json` created since you never run `confluence init`
