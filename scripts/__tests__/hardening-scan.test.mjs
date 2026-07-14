import { expect, test } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { run, runCheck, scanAsyncUiStateNoTerminalFailureFromText } from "../hardening-scan.mjs";

test("v4 scanner flags async UI request state with no terminal failure state", () => {
  const source = `
    function BrokenPanel() {
      const [loading, setLoading] = useState(false);
      const send = async () => {
        setLoading(true);
        const response = await fetch("/api/mercy-ai");
        setAnswer(await response.text());
      };
      return <button onClick={send}>Send</button>;
    }
  `;

  const hits = scanAsyncUiStateNoTerminalFailureFromText(source, "src/components/ai-tutor/BrokenPanel.tsx");

  expect(hits).toHaveLength(1);
  expect(hits[0].line).toBe(5);
});

test("v4 scanner accepts bounded async UI state with distinct failure and retry", () => {
  const source = `
    function HardenedPanel() {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const retry = () => void send();
      const send = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await fetchWithTimeout("/api/mercy-ai", {}, 12_000);
          setAnswer(await response.text());
        } catch {
          setError("Mercy chưa lấy được câu trả lời. Bạn thử lại nhé.");
        } finally {
          setLoading(false);
        }
      };
      return error ? <button onClick={retry}>Thử lại</button> : null;
    }
  `;

  const hits = scanAsyncUiStateNoTerminalFailureFromText(source, "src/components/ai-tutor/HardenedPanel.tsx");

  expect(hits).toEqual([]);
});

test("scanner command runner reports timeouts with code 124", () => {
  const result = run(process.execPath, ["-e", "setTimeout(() => {}, 1000)"], { timeoutMs: 10 });

  expect(result.timedOut).toBe(true);
  expect(result.code).toBe(124);
  expect(result.timeoutMs).toBe(10);
});

test("scanner check wrapper records elapsed time and timeout budget", () => {
  const result = runCheck("Z", "fixture check", () => ({ status: "ok", findings: [] }));

  expect(result.status).toBe("ok");
  expect(result.findings).toEqual([]);
  expect(typeof result.elapsedMs).toBe("number");
  expect(result.timeoutMs).toBe(60_000);
});

test("scanner fail-on-findings mode exits nonzero when check L reports RLS intent drift", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hardening-fail-on-findings-"));
  try {
    fs.mkdirSync(path.join(root, "supabase/migrations"), { recursive: true });
    fs.mkdirSync(path.join(root, "security"), { recursive: true });
    fs.writeFileSync(path.join(root, "supabase/migrations/001_table.sql"), `
      create table public.audit_log (id uuid primary key);
      alter table public.audit_log enable row level security;
    `);
    fs.writeFileSync(path.join(root, "security/rls-intent.json"), `${JSON.stringify({
      schema_version: 1,
      generated_by: "fixture",
      scan_roots: ["supabase/migrations"],
      migration_files: 0,
      tables: {},
    })}\n`);

    const args = [path.resolve("scripts/hardening-scan.mjs")];
    const env = { ...process.env, HARDENING_SCAN_CHECKS: "L", HARDENING_SCAN_SKIP_TOOL_VERSIONS: "1" };
    const advisory = run(process.execPath, args, { timeoutMs: 10_000, cwd: root, env });
    expect(advisory.code).toBe(0);
    expect(advisory.stdout).toContain("Finding counts");

    const failing = run(process.execPath, args, {
      timeoutMs: 10_000,
      cwd: root,
      env: { ...env, HARDENING_SCAN_FAIL_ON_FINDINGS: "1" },
    });
    expect(failing.code).toBe(1);
    expect(failing.stderr).toContain("FAIL_ON_FINDINGS");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("scanner fail-on-findings mode exits nonzero when check M reports auth intent drift", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hardening-auth-fail-on-findings-"));
  try {
    fs.mkdirSync(path.join(root, "functions/api"), { recursive: true });
    fs.mkdirSync(path.join(root, "security"), { recursive: true });
    fs.writeFileSync(path.join(root, "functions/api/ping.ts"), `
      export async function onRequest() {
        return new Response(JSON.stringify({ ok: true }));
      }
    `);
    fs.writeFileSync(path.join(root, "security/auth-intent.json"), `${JSON.stringify({
      schema_version: 1,
      generated_by: "fixture",
      scan_roots: ["functions", "supabase/functions", "src"],
      endpoints: {},
    })}\n`);

    const args = [path.resolve("scripts/hardening-scan.mjs")];
    const env = { ...process.env, HARDENING_SCAN_CHECKS: "M", HARDENING_SCAN_SKIP_TOOL_VERSIONS: "1" };
    const advisory = run(process.execPath, args, { timeoutMs: 10_000, cwd: root, env });
    expect(advisory.code).toBe(0);
    expect(advisory.stdout).toContain("Finding counts");
    expect(advisory.stdout).toContain("M:1");

    const failing = run(process.execPath, args, {
      timeoutMs: 10_000,
      cwd: root,
      env: { ...env, HARDENING_SCAN_FAIL_ON_FINDINGS: "1" },
    });
    expect(failing.code).toBe(1);
    expect(failing.stderr).toContain("FAIL_ON_FINDINGS");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
