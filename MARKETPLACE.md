# DevRecap — Codex Marketplace Guide

DevRecap ships as a portable Agent Plugin containing the `devrecap` Skill, plus a repository marketplace for Codex/ChatGPT plugin testing and private distribution.

## What the marketplace package contains

- `plugin.json` — portable Agent Plugins manifest.
- `skills/devrecap/SKILL.md` — AI-first DevRecap skill used by the installed plugin.
- `.agents/plugins/marketplace.json` — repository marketplace catalog.
- `scripts/devrecap-plugin.mjs` — bundled runner that boots the factual CLI without a global npm install.
- `PRIVACY.md`, `TERMS.md`, and `SUPPORT.md` — public policy/support pages for the directory listing.
- `OPENAI_SUBMISSION.md` — public-directory listing copy, prompts, test cases, release notes, and submission checklist.

The plugin source is the repository root, so the installed package also contains the DevRecap collectors, activity engine, report engine, and CLI needed by the skill.

## Add the GitHub marketplace to Codex

```bash
codex plugin marketplace add jquinteiroo/devrecap --ref main
```

Inspect configured marketplaces:

```bash
codex plugin marketplace list
```

Then open the Plugins surface in a supported Codex/ChatGPT client, find **DevRecap** under the DevRecap marketplace, and install it.

After repository updates, refresh the marketplace with:

```bash
codex plugin marketplace upgrade devrecap-marketplace
```

## First use

Invoke the installed skill and ask for a recap, for example:

```text
$devrecap

Me ajuda a lembrar tudo que trabalhei nas últimas duas semanas.
Quero um relatório detalhado em português.
```

On first use, DevRecap requires explicit authorization for local sources. The skill must not bypass this setup.

The bundled plugin runner is:

```bash
node <plugin-root>/scripts/devrecap-plugin.mjs setup
```

The Skill always uses the runner bundled with the same plugin installation, preventing stale global/local binaries from changing report behavior.

## Why the Skill uses AI

The CLI determines facts: Activities, Workstreams, completion evidence, Git correlation, and allowed source IDs.

The host model writes the report from those structured facts:

```text
local evidence
  ↓
DevRecap factual pipeline
  ↓
contract.facts
  ↓
Codex / Claude synthesis
  ↓
validated analysis.json
  ↓
editorial HTML / optional PDF
```

This keeps completion and evidence deterministic while letting the installed AI produce a natural, useful report.

## Public directory

DevRecap 0.3.0 is the first public-directory release candidate.

The GitHub marketplace remains useful for development and private testing, but it does not make the plugin discoverable in the universal Plugins Directory by itself. Public discovery requires a **Skills only** submission through the OpenAI plugin submission portal, OpenAI review, approval, and a final publish action by the developer.

The materials required for that submission are maintained in `OPENAI_SUBMISSION.md`. The repository includes public website/support/privacy/terms URLs and production logo assets for the listing.

After OpenAI approves and the developer publishes the submission, DevRecap can appear in the universal Plugins Directory shared by ChatGPT and Codex.

## Requirements

- Node.js 24 or newer
- Git
- Codex/ChatGPT client with a local environment capable of running the bundled Skill runner
- Optional Chrome/Chromium for direct PDF rendering

See `PRIVACY.md` for the local-source and AI-processing privacy model.
