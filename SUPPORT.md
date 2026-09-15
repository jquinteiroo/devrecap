# DevRecap Support

DevRecap is an open-source project maintained through GitHub.

## Get help

For bugs, installation problems, unexpected reports, marketplace issues, or feature requests, open an issue:

https://github.com/jquinteiroo/devrecap/issues

When reporting a problem, include:

- DevRecap/plugin version;
- operating system;
- Node.js version;
- Codex/Claude host used;
- the command or prompt that triggered the issue;
- sanitized logs or screenshots when useful.

Do not include API keys, credentials, private source code, raw transcripts, personal data, or other secrets in a public issue.

## Codex installation troubleshooting

### `plugin devrecap was not found in marketplace openai-curated`

DevRecap is published in the OpenAI Plugins Directory, but the Codex CLI curated catalog can differ by client version, account, or rollout state. If the curated command does not expose DevRecap, install it through the repository marketplace instead:

```bash
codex plugin marketplace add jquinteiroo/devrecap --ref main
codex plugin add devrecap@devrecap-marketplace
```

Then start or restart Codex and run:

```text
$devrecap
```

If the repository marketplace was already added, refresh it before reinstalling:

```bash
codex plugin marketplace upgrade devrecap-marketplace
codex plugin add devrecap@devrecap-marketplace
```

To inspect what the current Codex CLI exposes from configured and remote marketplaces, use:

```bash
codex plugin list --available --json
```

Only use `codex plugin add devrecap@openai-curated` when DevRecap is actually present in that client's curated catalog.

## Security and privacy

For privacy behavior, see `PRIVACY.md`.

If a report contains unexpected sensitive data, stop sharing the report publicly and file a sanitized issue describing the behavior.

## Scope

Support is best-effort. DevRecap does not provide emergency support, uptime guarantees, or guaranteed response times.
