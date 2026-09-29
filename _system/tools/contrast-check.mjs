#!/usr/bin/env node
// Contrast check for docs/design-tokens.md (_system/conventions.md section 10).
//
// Reads the Colors table (the first table under "## Colors" is the binding
// one) and every row of the "## Contrast" table, calculates each pair's WCAG
// 2.x ratio against that row's own Minimum column, and prints filled-in rows
// ready to paste back into the Contrast table.
//
// A row whose Minimum cell says "decorative" (a color never used as text or as
// a control edge) is listed but not checked, so a correct setup can still exit 0.
//
// Node only, no install, no network. Exit 0: every pair passes. Exit 1: at
// least one pair fails. Exit 2: the file could not be read or a token in the
// Contrast table is not defined in Colors.
//
// Optional: --google also writes a throwaway DESIGN.md (Google's open format,
// github.com/google-labs-code/design.md) to the system temp folder, never into
// this repo, and runs its linter as a second opinion. That needs network the
// first time, and its linter applies 4.5:1 to every pair (no 3:1 large-text
// minimum), so this script's own result is the one that counts.
//
// Usage: node _system/tools/contrast-check.mjs [docs/design-tokens.md] [--google]

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const GOOGLE_CLI = "@google/design.md@0.4.0";
const args = process.argv.slice(2);
const useGoogle = args.includes("--google");
const file = args.find((a) => !a.startsWith("--")) ?? "docs/design-tokens.md";

let text;
try {
  text = readFileSync(file, "utf8");
} catch {
  console.error(`contrast-check: cannot read ${file}`);
  process.exit(2);
}

function section(name) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${name}\\b`, "i").test(l));
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return end === -1 ? rest : rest.slice(0, end);
}

// First markdown table in a block of lines, as arrays of trimmed cells, header and divider dropped.
function firstTable(lines) {
  const rows = [];
  let started = false;
  for (const l of lines) {
    if (/^\s*\|/.test(l)) {
      started = true;
      rows.push(l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    } else if (started) break;
  }
  return rows.slice(2);
}

const clean = (cell) => cell.replace(/`/g, "").trim();
// "background-dark (surface)" or "brand-primary, main color" -> "background-dark" / "brand-primary"
const bareName = (cell) => clean(cell).replace(/\s*\(.*\)\s*$/, "").split(/[\s,]/)[0];

function parseColor(cell) {
  const hex = cell.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const rgb = cell.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return rgb.slice(1, 4).map(Number);
  if (/^white$/i.test(clean(cell))) return [255, 255, 255];
  if (/^black$/i.test(clean(cell))) return [0, 0, 0];
  return null;
}

const colors = new Map();
for (const [token, value] of firstTable(section("Colors"))) {
  const rgb = value && parseColor(value);
  if (token && rgb) {
    colors.set(clean(token), rgb);
    colors.set(bareName(token), rgb);
  }
}

function resolve(cell) {
  return colors.get(clean(cell)) ?? colors.get(bareName(cell)) ?? parseColor(cell);
}

function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const pairs = firstTable(section("Contrast"));
if (pairs.length === 0) {
  console.error(`contrast-check: no rows in the "## Contrast" table of ${file}`);
  process.exit(2);
}

let failed = false;
let unknown = false;
let decorative = 0;
const out = ["| Foreground token | Background token | Ratio | Minimum | Pass |", "|---|---|---|---|---|"];
const checked = [];
for (const row of pairs) {
  const [fgCell, bgCell, , minCell = ""] = row;
  const fg = resolve(fgCell);
  const bg = resolve(bgCell);
  if (!fg || !bg) {
    unknown = true;
    const missing = !fg ? fgCell : bgCell;
    console.error(`contrast-check: "${missing}" is not a token in the Colors table.`);
    if (/^\(.*\)$/.test(clean(missing))) console.error("  This is still the template's placeholder text. Replace it with the token name you gave that color.");
    console.error(`  Use the exact name from the Colors table's Token column. Defined: ${[...new Set([...colors.keys()].map(bareName))].join(", ") || "none (is the Colors table filled in?)"}`);
    continue;
  }
  if (/decorative/i.test(minCell)) {
    decorative++;
    const r0 = Math.floor(ratio(fg, bg) * 100) / 100;
    out.push(`| ${fgCell} | ${bgCell} | ${r0.toFixed(2)}:1 | decorative | not checked |`);
    continue;
  }
  const min = parseFloat(minCell) || 4.5;
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) failed = true;
  // Rounded down, so a displayed ratio never looks like a pass it is not.
  const shown = Math.floor(r * 100) / 100;
  out.push(`| ${fgCell} | ${bgCell} | ${shown.toFixed(2)}:1 | ${min}:1 | ${pass ? "yes" : "NO"} |`);
  checked.push({ fg: clean(fgCell), bg: clean(bgCell), fgRgb: fg, bgRgb: bg });
}

console.log(out.join("\n"));
console.log(
  failed
    ? "\nAt least one pair fails. Shift lightness and keep hue, or add a separate text token (conventions.md section 10)."
    : unknown
      ? "\nSome rows could not be checked (see above)."
      : `\nAll pairs pass.${decorative ? ` ${decorative} decorative row(s) not checked: never use those colors as text or as a control edge.` : ""}`
);

if (useGoogle && checked.length) {
  const toHex = (rgb) => "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "color";
  const lines = ["---", "version: alpha", "name: contrast-check (throwaway)", "colors:"];
  const seen = new Map();
  const ref = (name, rgb) => {
    const key = slug(name);
    if (!seen.has(key)) {
      seen.set(key, true);
      lines.push(`  ${key}: "${toHex(rgb)}"`);
    }
    return `{colors.${key}}`;
  };
  const comps = checked.map((p, i) => [
    `  pair-${i + 1}:`,
    `    textColor: "${ref(p.fg, p.fgRgb)}"`,
    `    backgroundColor: "${ref(p.bg, p.bgRgb)}"`,
  ]);
  lines.push("components:", ...comps.flat(), "---", "", "## Overview", "", "Throwaway file for a contrast cross-check.", "");
  const dir = mkdtempSync(join(tmpdir(), "contrast-check-"));
  const designFile = join(dir, "DESIGN.md");
  writeFileSync(designFile, lines.join("\n"));
  const res = spawnSync("npx", ["--yes", GOOGLE_CLI, "lint", designFile], { encoding: "utf8", shell: true });
  if (res.status === null || (!res.stdout && res.status !== 0)) {
    console.log(`\nGoogle cross-check: not run (${GOOGLE_CLI} unavailable: no network or no npx).`);
  } else {
    try {
      const findings = JSON.parse(res.stdout).findings.filter((f) => f.rule === "contrast-ratio");
      console.log(`\nGoogle cross-check (${GOOGLE_CLI}, 4.5:1 for every pair): ${findings.length} warning(s).`);
      for (const f of findings) {
        const n = parseInt(f.path.split("pair-")[1], 10);
        console.log(`- ${checked[n - 1].fg} on ${checked[n - 1].bg}: ${f.message}`);
      }
    } catch {
      console.log("\nGoogle cross-check: output could not be read; ignored.");
    }
  }
}

process.exit(unknown ? 2 : failed ? 1 : 0);
