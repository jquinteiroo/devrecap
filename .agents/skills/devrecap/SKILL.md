---
name: devrecap
description: Reconstruct developer work from explicitly authorized local Codex/Claude history and read-only Git metadata, then turn evidence-backed activities into polished developer recaps.
---

# DevRecap

Invoke explicitly as `$devrecap`.

DevRecap has two separate responsibilities:

- **DevRecap CLI = factual layer.** It collects only explicitly authorized local sources, parses them, determines accepted Activities, statuses, evidence, projects and workstreams.
- **The current coding agent = report-writing layer.** When this skill is invoked inside Codex, YOU are expected to turn those structured facts into the polished report. Do not delegate the writing back to the deterministic CLI unless AI synthesis cannot be completed.

The final HTML should read like a strong work report, not like telemetry.

## Consent comes first

Before any local collector is used, DevRecap CLI setup must already exist. If `devrecap prepare` reports that setup is required, stop and ask the user to run `devrecap setup`.

Never bypass setup, never scan local history yourself as a workaround, and never enable a source the user did not authorize.

## AI-first workflow

1. Resolve the requested period faithfully. If natural-language resolution produces a shorter range than requested, rerun with an explicit equivalent such as `last 14 days` or exact dates.
2. Run `devrecap prepare --request "<user request>" --out .devrecap/run.json`.
   - Inside the DevRecap source repository on Windows PowerShell, `npm.cmd run recap -- prepare --request "<user request>" --out .devrecap/run.json` is valid.
   - Do **not** use direct convenience commands such as `devrecap remember` or `devrecap week` as the final result inside the skill; those commands intentionally use the deterministic fallback writer.
3. Read `.devrecap/run.json`.
4. Analyze only `contract.facts`, `contract.allowedActivityIds`, and the structured accepted data in the prepared run. Raw transcripts are not part of the writing workflow.
5. Write `.devrecap/analysis.json` matching `contract.outputShape` at presentation quality.
6. Render to `reports/derecap-YYYY-MM-DD.html`, using the report range end date in the filename. Add a PDF with the same basename only when requested.
7. Return the generated path plus a concise conversational recap.

## What a good report feels like

Write like a strong technical teammate who reviewed the developer's work history and is helping them remember the period.

Use this editorial shape:

- **headline**: describe what characterized the period instead of showing a raw activity count. Do not prefix it with `DevRecap`, `derecap`, or the skill name; branding is already handled by the renderer once.
- **executiveSummary**: one polished opening paragraph covering the main fronts and overall state;
- **mainFocus**: summarize the most important front with context, what happened and where it ended;
- **detail sections**: consolidate related Activities into a small number of meaningful work fronts;
- **highlights**: only completed work backed by evidence;
- **investigations**: unresolved investigation fronts;
- **inProgress**: implementation or changes that were worked on but are not proven complete;
- **blockers** and **nextSteps**: only when explicitly supported.

For each narrative, prefer 2–4 useful sentences covering the context/problem, what was changed or investigated, why it mattered when the evidence supports that interpretation, and the factual state at the end of the period.

### Synthesis rules

- Combine related Activities into one narrative item when they clearly describe the same objective. Reference all supporting `activityIds`.
- Rewrite weak parser-generated labels into natural language when the structured facts support a better description.
- Treat `Investigated the API`, `Investigated the project`, filenames and command counts as clues, not final wording.
- Use project name, objective, activity summaries, categories, workstream context, technical terms, validation and status together to infer the clearest grounded description.
- Never invent a business purpose, feature name, root cause, outcome, blocker or next step.
- Never change `in_progress`, `blocked`, or `unknown` work into completed work.
- Use shipped/delivered/completed language only when completion or commit evidence supports it.
- Highlights/key deliveries may reference only completed activities.
- Do not repeat the same Activity in multiple detail sections; it may also appear in `mainFocus` only as a high-level overview.
- Only populate `nextSteps` when the prepared facts contain an explicit evidence-backed next step.
- Do not make filenames, file counts, command counts, raw shell commands or implementation noise the main story.
- Avoid database-like prose such as "the workstream grouped N activities" unless the count itself matters.
- Preserve meaningful proper names such as Codex, Claude, DocuSign, Laravel, Vue, PDF, API, SQL, GitHub and product/project names.
- Write in the user's requested language. For Portuguese requests, use natural Brazilian Portuguese.

## Report style by intent

### `daily`
Keep it concise and speakable. Prefer 2–4 meaningful points covering what changed, what is being worked on, and blockers. Aim for roughly a 30–60 second standup.

### `review`
Emphasize outcomes, shipped work, meaningful progress, validation, and impact that is actually supported by the facts. Do not turn raw activity volume into achievement.

### `remember` / "what did I work on?"
Use the richest synthesis. Reconstruct each major workstream with context, what was done, useful technical clues, and the evidence-backed current state.

## Quality check before render

Before writing `.devrecap/analysis.json`, verify that the result helps someone remember actual work, related Activities are consolidated, titles are natural, every claim is grounded, incomplete work remains honest, there are no invented next steps, and telemetry is not dominating the prose.

## Rendering rule

The host AI's validated wording is canonical for Skill-generated reports. Preserve the AI-written headline, executive summary, titles and narratives through render. The renderer handles the single derecap brand mark, color, section numbering and collapsed evidence references.

## Privacy and safety

DevRecap is explicit-invocation only. Do not create background monitoring. Do not expose raw transcripts, credentials, source code, secrets, or full command outputs to improve prose. Do not run project code. Git access by the CLI is read-only.

If agent analysis genuinely cannot be produced, use the deterministic fallback. The deterministic report is a safety net, not the preferred Skill experience.
