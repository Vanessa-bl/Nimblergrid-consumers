import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["app", "components", "features", "screens", "slices", "domain", "lib"];
const EXTS = new Set([".ts", ".tsx", ".css"]);
const IGNORED = new Set(["app/tokens.css"]);

const RULES = [
  {
    regex: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g,
    message: "color hex literal",
  },
  { regex: /\b(?:rgba?|hsla?)\(/g, message: "función de color literal" },
  {
    regex:
      /\b(?:rose|zinc|stone|gray|slate|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink)-[0-9]{2,3}\b/g,
    message: "clase de paleta cruda (usá brand/neutral o tokens semánticos)",
  },
];

const walk = (dir) => {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (EXTS.has(extname(entry.name))) files.push(full);
  }
  return files;
};

const lineOf = (content, index) => content.slice(0, index).split("\n").length;

const violations = [];

for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  let files = [];
  try {
    files = statSync(abs).isDirectory() ? walk(abs) : [];
  } catch {
    continue;
  }
  for (const file of files) {
    const rel = relative(ROOT, file);
    if (IGNORED.has(rel)) continue;
    const content = readFileSync(file, "utf8");
    for (const rule of RULES) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(content)) !== null) {
        violations.push({
          file: rel,
          line: lineOf(content, match.index),
          match: match[0],
          message: rule.message,
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error("");
  console.error(`✖ Tokens: ${violations.length} violación(es) de color encontradas:`);
  console.error("");
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line}  "${violation.match}"  — ${violation.message}`,
    );
  }
  console.error("");
  console.error("Regla: la identidad vive en app/tokens.css. Usá utilidades (bg-brand-500,");
  console.error("text-neutral-600, shadow-card…) o var(--token) — nunca colores literales.");
  console.error("");
  process.exit(1);
}

console.log("✔ Tokens OK — sin colores hardcodeados ni paletas crudas.");
