#!/usr/bin/env node
/**
 * Structure check for the Geocode AI plugin (no dependencies): every manifest
 * parses and agrees on name and version, every MCP config points at the same
 * server, and every skill has frontmatter whose name matches its folder plus
 * an agents/openai.yaml.
 * Run by scripts/publish-plugins.mjs before publishing and by the published
 * repository's CI. Exit 2 on failure.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const problems = [];
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), "utf8"));

const manifests = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json", ".plugin/plugin.json"];
const parsed = {};
for (const path of [...manifests, ".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", ".mcp.json"]) {
  try {
    parsed[path] = read(path);
  } catch (error) {
    problems.push(`${path}: ${error.message}`);
  }
}
const versions = new Set(manifests.map((m) => parsed[m]?.version));
if (versions.size !== 1) problems.push(`manifest versions differ: ${[...versions].join(", ")}`);
for (const m of manifests) if (parsed[m] && parsed[m].name !== "geocode") problems.push(`${m}: name must be "geocode"`);

const urls = new Set([parsed[".mcp.json"]?.mcpServers?.geocode?.url, parsed[".claude-plugin/plugin.json"]?.mcpServers?.geocode?.url]);
if (urls.size !== 1 || [...urls].some((u) => !/^https:\/\/[^/]+\/mcp(\/account)?(\?|$)/.test(u ?? ""))) problems.push(`MCP urls must match and end in /mcp or /mcp/account: ${[...urls].join(", ")}`);
if (parsed[".claude-plugin/marketplace.json"]?.plugins?.[0]?.name !== "geocode") problems.push("marketplace.json must list geocode");

const skills = readdirSync(join(ROOT, "skills"));
if (!skills.length) problems.push("no skills");
for (const skill of skills) {
  const file = join(ROOT, "skills", skill, "SKILL.md");
  if (!existsSync(file)) {
    problems.push(`skills/${skill}: no SKILL.md`);
    continue;
  }
  const front = /^---\n([\s\S]*?)\n---\n/.exec(readFileSync(file, "utf8"))?.[1] ?? "";
  const name = /^name:\s*(.+)$/m.exec(front)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim();
  if (name !== skill) problems.push(`skills/${skill}: frontmatter name is "${name}"`);
  if (!description || description.length > 1024) problems.push(`skills/${skill}: description missing or over 1024 characters`);
  if (!existsSync(join(ROOT, "skills", skill, "agents/openai.yaml"))) problems.push(`skills/${skill}: no agents/openai.yaml`);
}

if (problems.length) {
  console.error(`Plugin validation failed:\n- ${problems.join("\n- ")}`);
  process.exit(2);
}
console.log(`geocode ${[...versions][0]}: ${manifests.length} manifests, ${skills.length} skills OK`);
