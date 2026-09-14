import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function json(path: string): any {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

test("portable plugin manifest exposes DevRecap as an AI-native productivity plugin", () => {
  const manifest = json("plugin.json");
  const interfaceConfig = manifest.extensions?.["com.openai"]?.interface;

  assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.equal(manifest.name, "devrecap");
  assert.equal(manifest.version, "0.3.0");
  assert.equal(interfaceConfig?.displayName, "DevRecap");
  assert.equal(interfaceConfig?.category, "Productivity");
  assert.match(interfaceConfig?.shortDescription ?? "", /evidence-backed work recaps/i);
  assert.equal(interfaceConfig?.brandColor, "#19372f");
  assert.equal(interfaceConfig?.composerIcon, "./assets/devrecap-icon.webp");
  assert.equal(interfaceConfig?.logo, "./assets/devrecap-logo-symbol.webp");
  assert.equal(interfaceConfig?.termsOfServiceURL, "https://github.com/jquinteiroo/devrecap/blob/main/TERMS.md");
  assert.equal(existsSync(resolve(root, interfaceConfig.composerIcon)), true);
  assert.equal(existsSync(resolve(root, interfaceConfig.logo)), true);
});

test("release manifests stay on the same product version", () => {
  const manifest = json("plugin.json");
  const rootPackage = json("package.json");
  const cliPackage = json("apps/cli/package.json");

  assert.equal(manifest.version, "0.3.0");
  assert.equal(rootPackage.version, manifest.version);
  assert.equal(cliPackage.version, manifest.version);
});

test("repo marketplace points at the portable plugin root with install metadata", () => {
  const marketplace = json(".agents/plugins/marketplace.json");
  assert.equal(marketplace.name, "devrecap-marketplace");
  assert.equal(marketplace.plugins.length, 1);
  const entry = marketplace.plugins[0];
  assert.equal(entry.name, "devrecap");
  assert.equal(entry.source.source, "local");
  assert.equal(entry.source.path, "./");
  assert.equal(entry.policy.installation, "AVAILABLE");
  assert.equal(entry.policy.authentication, "ON_INSTALL");
  assert.equal(entry.category, "Productivity");
});

test("portable skill keeps host AI synthesis as the preferred report path", () => {
  const skill = readFileSync(resolve(root, "skills/devrecap/SKILL.md"), "utf8");
  assert.match(skill, /AI-first report pipeline/i);
  assert.match(skill, /contract\.facts/);
  assert.match(skill, /\.devrecap\/analysis\.json/);
  assert.match(skill, /Never promote `in_progress`, `blocked`, or `unknown` work to completed/);
  assert.match(skill, /scripts\/devrecap-plugin\.mjs/);
});

test("marketplace skill always uses its bundled runner instead of a stale PATH binary", () => {
  const skill = readFileSync(resolve(root, "skills/devrecap/SKILL.md"), "utf8");
  assert.match(skill, /always use the runner bundled with the same installed plugin version/i);
  assert.match(skill, /Do not prefer a `devrecap` executable found on PATH/i);
  assert.match(skill, /Never mix an installed marketplace Skill with a different `devrecap` binary on PATH/i);
});

test("marketplace skill requires editorial renderer preflight and dated derecap output", () => {
  const skill = readFileSync(resolve(root, "skills/devrecap/SKILL.md"), "utf8");
  assert.match(skill, /--plugin-info/);
  assert.match(skill, /renderer` as `editorial-v2/);
  assert.match(skill, /reports\/derecap-YYYY-MM-DD\.html/);
  assert.match(skill, /Always pass this exact `--out` path explicitly/);
});

test("repository does not ship a second Codex skill that can shadow the marketplace plugin", () => {
  assert.equal(existsSync(resolve(root, ".agents", "skills", "devrecap", "SKILL.md")), false);
  assert.equal(existsSync(resolve(root, "skills", "devrecap", "SKILL.md")), true);
});

test("marketplace runner reports its exact plugin version and renderer before use", () => {
  const result = spawnSync(process.execPath, [resolve(root, "scripts/devrecap-plugin.mjs"), "--plugin-info"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env },
  });

  assert.equal(result.status, 0, result.stderr);
  const info = JSON.parse(result.stdout.trim());
  assert.equal(info.pluginVersion, "0.3.0");
  assert.equal(info.renderer, "editorial-v2");
  assert.equal(resolve(info.pluginRoot), root);
});

test("public submission materials exist", () => {
  assert.equal(existsSync(resolve(root, "PRIVACY.md")), true);
  assert.equal(existsSync(resolve(root, "TERMS.md")), true);
  assert.equal(existsSync(resolve(root, "SUPPORT.md")), true);
  assert.equal(existsSync(resolve(root, "OPENAI_SUBMISSION.md")), true);
  assert.equal(existsSync(resolve(root, "assets", "devrecap-logo.webp")), true);
  assert.equal(existsSync(resolve(root, "assets", "devrecap-icon.webp")), true);
  assert.equal(existsSync(resolve(root, "assets", "devrecap-logo-symbol.webp")), true);
});

test("marketplace runner boots the CLI on Node 24 without noisy workspace-link output", () => {
  const result = spawnSync(process.execPath, [resolve(root, "scripts/devrecap-plugin.mjs"), "--help"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /DevRecap — terminal-first developer work recap/);
  assert.doesNotMatch(result.stdout, /^linked @devrecap/m);
});
