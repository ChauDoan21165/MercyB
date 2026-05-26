import http from "node:http";
import { execSync } from "node:child_process";
import { readFileSync, appendFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);

const HANDLER_FILE = resolve(ROOT, ".c10-sentry-handler.md");
const MEMORY_FILE = resolve(ROOT, "AGENT_MEMORY.md");
const PORT = 3456;

// ── Known error patterns → fix actions ──────────────────────────────────────

const PATTERNS = {
  "at is not a function": {
    name: "Array.prototype.at polyfill",
    fix() {
      const target = resolve(ROOT, "src/main.tsx");
      if (!existsSync(target)) return { ok: false, reason: "src/main.tsx not found" };
      const content = readFileSync(target, "utf-8");
      if (content.includes("Array.prototype.at")) {
        return { ok: false, reason: "Polyfill already present" };
      }
      const polyfill = `if (!Array.prototype.at) {
  Array.prototype.at = function(index) {
    if (index < 0) index = this.length + index;
    return this[index];
  };
}\n\n`;
      writeFileSync(target, polyfill + content, "utf-8");
      return { ok: true, file: "src/main.tsx" };
    }
  },
  "Cannot read propert": {
    name: "Optional chaining",
    fix() {
      return { ok: false, reason: "Pattern detected, but source location unknown. Requires manual optional-chaining fix." };
    }
  },
  "Failed to fetch": {
    name: "Fetch retry logic",
    fix() {
      return { ok: false, reason: "Apply retry wrapper (3 attempts, exponential backoff) to the failing fetch call." };
    }
  }
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toISOString();
  process.stdout.write(`[c10-webhook ${ts}] ${msg}\n`);
}

function addPatternToHandler(name, fixDesc) {
  const entry = `\n### Pattern: \`${name}\`\n**Fix:** ${fixDesc}\n`;
  appendFileSync(HANDLER_FILE, entry, "utf-8");
  log(`Added pattern "${name}" to handler file`);
}

function updateMemory(errorTitle, fixResult) {
  const ts = new Date().toISOString();
  const entry = `\n## ${ts}\n- **Error:** ${errorTitle}\n- **Fix applied:** ${fixResult}\n`;
  appendFileSync(MEMORY_FILE, entry, "utf-8");
  log("Updated AGENT_MEMORY.md");
}

function runBuild() {
  log("Running npm run build...");
  try {
    execSync("npm run build", { cwd: ROOT, stdio: "pipe", timeout: 120_000 });
    log("Build succeeded");
    return true;
  } catch (e) {
    log(`Build FAILED:\n${e.stderr?.toString() || e.message}`);
    return false;
  }
}

function commitAndPush(errorTitle) {
  log("Committing and pushing...");
  try {
    execSync("git add -A", { cwd: ROOT });
    execSync(`git commit -m "fix: ${errorTitle}"`, { cwd: ROOT });
    execSync("git push", { cwd: ROOT });
    log("Pushed successfully");
    return true;
  } catch (e) {
    log(`Git push failed: ${e.stderr?.toString() || e.message}`);
    return false;
  }
}

function extractErrorTitle(payload) {
  if (payload.message?.title) return payload.message.title;
  if (payload.event?.title) return payload.event.title;
  if (payload.title) return payload.title;
  if (payload.data?.event?.title) return payload.data.event.title;
  if (payload.event?.metadata?.value) return payload.event.metadata.value;
  if (payload.event?.metadata?.type && payload.event?.metadata?.value) {
    return `${payload.event.metadata.type}: ${payload.event.metadata.value}`;
  }
  return JSON.stringify(payload).slice(0, 200);
}

function matchPattern(title) {
  for (const [key, entry] of Object.entries(PATTERNS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return { key, entry };
    }
  }
  return null;
}

function isPatternInHandler(patternKey) {
  try {
    const content = readFileSync(HANDLER_FILE, "utf-8").toLowerCase();
    return content.includes(patternKey.toLowerCase());
  } catch {
    return false;
  }
}

// ── Fix workflow ────────────────────────────────────────────────────────────

async function handleSentryError(payload) {
  const title = extractErrorTitle(payload);
  log(`Received error: "${title}"`);

  const match = matchPattern(title);
  if (!match) {
    log(`No known pattern matched. Title: "${title}"`);
    return { status: "unknown_pattern", title };
  }

  log(`Matched pattern: "${match.key}"`);

  if (!isPatternInHandler(match.key)) {
    addPatternToHandler(match.key, match.entry.name);
  }

  let fixResult = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    fixResult = match.entry.fix();
    if (fixResult.ok) break;
    log(`Fix attempt ${attempt} failed: ${fixResult.reason}`);
  }

  if (!fixResult?.ok) {
    log(`Cannot auto-fix "${match.key}" — needs human help`);
    updateMemory(title, `NEEDS HUMAN HELP — ${fixResult?.reason || "fix returned null"}`);
    return { status: "needs_human", title, reason: fixResult?.reason };
  }

  log(`Fix applied to ${fixResult.file}`);

  if (!runBuild()) {
    log("Build failed after fix — rolling back requires human");
    updateMemory(title, `Fix applied but BUILD FAILED`);
    return { status: "build_failed", title };
  }

  commitAndPush(title);
  updateMemory(title, fixResult.file);

  return { status: "fixed", title };
}

// ── HTTP Server ─────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Sentry-Hook-Signature");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
    return;
  }

  if (req.method === "POST" && req.url === "/sentry") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const result = await handleSentryError(payload);
        res.writeHead(result.status === "fixed" ? 200 : 422, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (e) {
        log(`Parse error: ${e.message}`);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid payload", detail: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  log(`C10 Sentry webhook listening on http://127.0.0.1:${PORT}/sentry`);
  log(`Health check: http://127.0.0.1:${PORT}/health`);
});
