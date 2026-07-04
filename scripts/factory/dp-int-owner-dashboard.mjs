#!/usr/bin/env node
import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = Number(process.env.DP_FACTORY_DASHBOARD_PORT || 4160);
const DB_PATH = process.env.DP_FACTORY_DB || "state/dp_int_factory.sqlite3";
const REPORT_PATH = "reports/FACTORY_REPORT_FOR_CHATGPT.md";
const TARGET_WORKERS = Number(process.env.DP_FACTORY_TARGET_WORKERS || 5);
const JUDGE_BACKLOG_THRESHOLD = 50;
const SAFETY_LOCKS = [
  "verified locked to Judge only",
  "F cannot write Judge ledger",
  "no deploy",
  "no HQ-200",
  "no TM INT redesign",
];

function run(command, args, input) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    input,
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  }
  return result.stdout.trim();
}

function runMaybe(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8",
    input: options.input,
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function readSqlJson(statement) {
  const output = run("sqlite3", ["-readonly", "-json", resolve(DB_PATH), statement]);
  return output ? JSON.parse(output) : [];
}

function gitLines(args) {
  return run("git", args)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function byKey(rows, keyName, valueName) {
  return Object.fromEntries(rows.map((row) => [row[keyName], Number(row[valueName] || 0)]));
}

function ratio(done, total) {
  return {
    done,
    total,
    text: `${done} / ${total}`,
    percent: total > 0 ? Math.round((done / total) * 1000) / 10 : 0,
  };
}

function workerProcessStatus(index, claimRows) {
  const worker = `F-DP-INT-W${index}`;
  const session = `dp-int-f-worker-${index}`;
  const worktree = `/Users/admin/MercyB.worktrees/dp-f-${index}`;
  const pane = runMaybe("tmux", ["list-panes", "-t", session, "-F", "#{pane_pid}"]);
  const panePid = pane.ok ? pane.stdout.split(/\r?\n/).filter(Boolean)[0] : "";
  const child = panePid ? runMaybe("pgrep", ["-P", panePid, "-f", "codex exec"]) : { ok: false, stdout: "" };
  const childPid = child.stdout.split(/\r?\n/).filter(Boolean)[0]?.split(/\s+/)[0] || "";
  const status = runMaybe("git", ["status", "--short"], { cwd: worktree });
  const claim = claimRows.find((row) => row.worker === worker);
  const dirty = status.ok && status.stdout.length > 0;

  return {
    worker,
    session,
    live: Boolean(panePid && childPid),
    panePid: panePid ? Number(panePid) : null,
    pid: childPid ? Number(childPid) : null,
    worktree,
    dirty,
    dirtyStatus: dirty ? status.stdout.split(/\r?\n/) : [],
    claim: claim || null,
    staleClaim: Boolean(claim && !(panePid && childPid)),
  };
}

function getStatus() {
  const [{ total = 0 } = {}] = readSqlJson("SELECT COUNT(*) AS total FROM dp_int_workpacks");
  const statusCounts = byKey(
    readSqlJson("SELECT status, COUNT(*) AS count FROM dp_int_workpacks GROUP BY status ORDER BY status"),
    "status",
    "count",
  );
  const verifiedCounts = byKey(
    readSqlJson("SELECT verified, COUNT(*) AS count FROM dp_int_workpacks GROUP BY verified ORDER BY verified"),
    "verified",
    "count",
  );
  const judgeCounts = byKey(
    readSqlJson("SELECT judge_status, COUNT(*) AS count FROM dp_int_judge_results GROUP BY judge_status ORDER BY judge_status"),
    "judge_status",
    "count",
  );
  const [{ f_done_unjudged: fDoneUnjudged = 0 } = {}] = readSqlJson(
    "SELECT COUNT(*) AS f_done_unjudged FROM dp_int_f_done_unjudged",
  );
  const workerRows = readSqlJson(
    "SELECT claimed_by AS worker, wp_id, claimed_at FROM dp_int_workpacks WHERE status='running' ORDER BY claimed_at, wp_id",
  );
  const workerProcesses = Array.from({ length: TARGET_WORKERS }, (_, offset) => workerProcessStatus(offset + 1, workerRows));
  const liveWorkers = workerProcesses.filter((worker) => worker.live);
  const staleClaims = workerProcesses.filter((worker) => worker.staleClaim);
  const dirtyWorktrees = workerProcesses.filter((worker) => worker.dirty);
  const fDone = statusCounts.f_done || 0;
  const ready = statusCounts.workpack_ready || 0;
  const running = statusCounts.running || 0;
  const judgePass = judgeCounts.judge_pass || 0;
  const judgeFail = judgeCounts.judge_fail || 0;
  const judged = judgePass + judgeFail;
  const verified = verifiedCounts[1] || 0;
  const fCanContinue = fDoneUnjudged <= JUDGE_BACKLOG_THRESHOLD;
  const blocker = fDoneUnjudged > JUDGE_BACKLOG_THRESHOLD ? "Judge backlog exceeds threshold" : "NONE";
  const phase =
    running > 0
      ? "F running"
      : fDoneUnjudged > JUDGE_BACKLOG_THRESHOLD
        ? "Judge pending"
        : ready > 0
          ? "F ready"
          : fDoneUnjudged > 0
            ? "Final Judge pending"
            : verified < total
              ? "Verification pending"
              : "Complete";

  return {
    taskName: "DP INT v1 Factory Run",
    generatedAt: new Date().toISOString(),
    phase,
    workers: {
      active: liveWorkers.length,
      target: TARGET_WORKERS,
      running: workerRows,
      runningClaims: new Set(workerRows.map((row) => row.worker).filter(Boolean)).size,
      processes: workerProcesses,
      staleClaims,
      dirtyWorktrees,
    },
    workpacks: {
      total,
      f_done: fDone,
      workpack_ready: ready,
      running,
      judge_pass: judgePass,
      judge_fail: judgeFail,
      verified,
      f_done_unjudged: fDoneUnjudged,
    },
    judgeBacklog: {
      current: fDoneUnjudged,
      threshold: JUDGE_BACKLOG_THRESHOLD,
      text: `${fDoneUnjudged} / ${JUDGE_BACKLOG_THRESHOLD}`,
    },
    fCanContinue,
    progress: {
      f: ratio(fDone, total),
      judge: ratio(judged, fDone),
      verified: ratio(verified, total),
    },
    blocker,
    latestCommits: gitLines(["log", "--oneline", "-5"]),
    gitStatus: gitLines(["status", "--short"]),
    safetyLocks: SAFETY_LOCKS,
  };
}

function buildReport(status) {
  return [
    "# DP INT v1 Factory Run",
    "",
    `Generated: ${status.generatedAt}`,
    `Current phase: ${status.phase}`,
    `Workers: ${status.workers.active} / ${status.workers.target}`,
    `Running claims: ${status.workers.runningClaims}`,
    `Stale/blocked claims: ${status.workers.staleClaims.length}`,
    `Dirty worktrees: ${status.workers.dirtyWorktrees.length}`,
    `Current blocker: ${status.blocker}`,
    `Judge backlog: ${status.judgeBacklog.text}`,
    `F can continue: ${status.fCanContinue ? "YES" : "NO"}`,
    "",
    "## Workpacks",
    "",
    `- total = ${status.workpacks.total}`,
    `- done by F = ${status.workpacks.f_done}`,
    `- pending = ${status.workpacks.workpack_ready}`,
    `- running = ${status.workpacks.running}`,
    `- f_done_unjudged = ${status.workpacks.f_done_unjudged}`,
    `- judged pass = ${status.workpacks.judge_pass}`,
    `- judged fail = ${status.workpacks.judge_fail}`,
    `- verified = ${status.workpacks.verified}`,
    "",
    "## Workers",
    "",
    ...status.workers.processes.map((worker) => [
      `- ${worker.worker}: ${worker.live ? `live pid ${worker.pid}` : "dead"}`,
      worker.claim ? ` claim=${worker.claim.wp_id}` : " claim=NONE",
      worker.dirty ? ` dirty=${worker.dirtyStatus.join("; ")}` : " dirty=NO",
    ].join(";")),
    "",
    "## Progress",
    "",
    `- F progress = ${status.progress.f.text}`,
    `- Judge progress = ${status.progress.judge.text}`,
    `- Verified progress = ${status.progress.verified.text}`,
    "",
    "## Latest Commits",
    "",
    ...status.latestCommits.map((commit) => `- ${commit}`),
    "",
    "## Safety Locks",
    "",
    ...status.safetyLocks.map((lock) => `- ${lock}`),
    "",
    "## Git Status",
    "",
    ...(status.gitStatus.length ? status.gitStatus.map((line) => `- ${line}`) : ["- clean"]),
    "",
  ].join("\n");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function writeReport() {
  const status = getStatus();
  const report = `${buildReport(status)}\n`;
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, report, "utf8");
  return { path: REPORT_PATH, report, status };
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DP INT Factory Dashboard</title>
<style>
body{margin:0;background:#f7f8fa;color:#17202a;font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
main{width:min(1120px,calc(100vw - 32px));margin:24px auto}
header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:16px}
h1{margin:0;font-size:28px;line-height:1.1}.label{color:#5d6b78;font-size:12px;font-weight:750;text-transform:uppercase}.subtle{color:#5d6b78}
button{border:1px solid #075c63;background:#0b7c86;color:white;border-radius:6px;min-height:38px;padding:0 14px;font-weight:750;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px}.panel{background:white;border:1px solid #d9dee4;border-radius:8px;padding:16px}
.span4{grid-column:span 4}.span6{grid-column:span 6}.span12{grid-column:span 12}.value{font-size:26px;font-weight:780;overflow-wrap:anywhere}.ok{color:#187047}.warn{color:#9f5b00}.phase{color:#075c63}
table{width:100%;border-collapse:collapse}td,th{text-align:left;border-bottom:1px solid #d9dee4;padding:8px 6px}th{color:#5d6b78;font-size:12px;text-transform:uppercase}
.metric{margin-top:12px}.bar{height:10px;background:#e6eaee;border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:#0b7c86}
li{margin:4px 0;overflow-wrap:anywhere}@media(max-width:820px){header{flex-direction:column}.span4,.span6{grid-column:span 12}button{width:100%}}
</style>
</head>
<body>
<main>
<header><div><div class="label">Task name</div><h1 id="task">DP INT v1 Factory Run</h1><div class="subtle">Refreshes every 2 seconds. Local only.</div></div><button id="copy">Copy Report</button></header>
<section class="grid">
<div class="panel span4"><div class="label">Current phase</div><div class="value phase" id="phase">Loading</div></div>
<div class="panel span4"><div class="label">Live workers</div><div class="value"><span id="active">0</span> / <span id="target">0</span></div></div>
<div class="panel span4"><div class="label">Current blocker</div><div class="value ok" id="blocker">NONE</div></div>
<div class="panel span4"><div class="label">Running claims</div><div class="value" id="runningClaims">0</div></div>
<div class="panel span4"><div class="label">Stale/blocked claims</div><div class="value warn" id="staleClaims">0</div></div>
<div class="panel span4"><div class="label">Dirty worktrees</div><div class="value warn" id="dirtyWorktrees">0</div></div>
<div class="panel span4"><div class="label">Judge backlog</div><div class="value" id="judgeBacklog">0 / 50</div></div>
<div class="panel span4"><div class="label">F can continue</div><div class="value ok" id="fCanContinue">YES</div></div>
<div class="panel span6"><div class="label">Workpacks</div><table><tbody id="workpacks"></tbody></table></div>
<div class="panel span6"><div class="label">Progress</div><div id="progress"></div></div>
<div class="panel span12"><div class="label">Workers</div><table><thead><tr><th>Worker</th><th>Process</th><th>Claim</th><th>Worktree</th></tr></thead><tbody id="workerRows"></tbody></table></div>
<div class="panel span6"><div class="label">Latest commits</div><ul id="commits"></ul></div>
<div class="panel span6"><div class="label">Safety locks</div><ul id="locks"></ul></div>
<div class="panel span12"><div class="label">Git status</div><ul id="git"></ul></div>
</section>
</main>
<script>
const $=(id)=>document.getElementById(id);
function li(text){const el=document.createElement("li");el.textContent=text;return el}
function tr(name,value){const row=document.createElement("tr");const a=document.createElement("td");const b=document.createElement("td");a.textContent=name;b.textContent=value;row.append(a,b);return row}
function workerTr(worker){const row=document.createElement("tr");[worker.worker,worker.live?"live pid "+worker.pid:"dead",worker.claim?worker.claim.wp_id:"NONE",worker.dirty?worker.dirtyStatus.join("; "):"clean"].forEach((value)=>{const cell=document.createElement("td");cell.textContent=value;row.append(cell)});return row}
function metric(name,p){const d=document.createElement("div");d.className="metric";d.innerHTML="<strong>"+name+"</strong> <span class=subtle>"+p.text+" ("+p.percent+"%)</span><div class=bar><span style=width:"+Math.min(100,p.percent)+"%></span></div>";return d}
function list(id, rows, empty){$(id).replaceChildren(...(rows.length?rows:[empty]).map(li))}
function render(s){
  $("task").textContent=s.taskName;$("phase").textContent=s.phase;$("active").textContent=s.workers.active;$("target").textContent=s.workers.target;
  $("runningClaims").textContent=s.workers.runningClaims;$("staleClaims").textContent=s.workers.staleClaims.length;$("dirtyWorktrees").textContent=s.workers.dirtyWorktrees.length;
  $("blocker").textContent=s.blocker;$("blocker").className="value "+(s.blocker==="NONE"?"ok":"warn");
  $("judgeBacklog").textContent=s.judgeBacklog.text;$("fCanContinue").textContent=s.fCanContinue?"YES":"NO";$("fCanContinue").className="value "+(s.fCanContinue?"ok":"warn");
  $("workpacks").replaceChildren(tr("total",s.workpacks.total),tr("done by F = f_done",s.workpacks.f_done),tr("pending = workpack_ready",s.workpacks.workpack_ready),tr("running",s.workpacks.running),tr("f_done_unjudged",s.workpacks.f_done_unjudged),tr("judged pass = judge_pass",s.workpacks.judge_pass),tr("judged fail = judge_fail",s.workpacks.judge_fail),tr("verified",s.workpacks.verified));
  $("progress").replaceChildren(metric("F progress",s.progress.f),metric("Judge progress",s.progress.judge),metric("Verified progress",s.progress.verified));
  $("workerRows").replaceChildren(...s.workers.processes.map(workerTr));
  list("commits",s.latestCommits,"No commits found");list("locks",s.safetyLocks,"No safety locks found");list("git",s.gitStatus,"clean");
}
async function refresh(){const r=await fetch("/api/status",{cache:"no-store"});if(!r.ok)throw new Error(await r.text());render(await r.json())}
$("copy").onclick=async()=>{const b=$("copy");b.disabled=true;b.textContent="Copying...";try{const r=await fetch("/api/report",{method:"POST",cache:"no-store"});if(!r.ok)throw new Error(await r.text());const p=await r.json();await navigator.clipboard.writeText(p.report);render(p.status);b.textContent="Copied"}catch(e){console.error(e);b.textContent="Copy failed"}finally{setTimeout(()=>{b.disabled=false;b.textContent="Copy Report"},1200)}};
refresh().catch(console.error);setInterval(()=>refresh().catch(console.error),2000);
</script>
</body>
</html>`;

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${HOST}:${PORT}`);
    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      response.end(html);
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/status") return sendJson(response, 200, getStatus());
    if (request.method === "POST" && url.pathname === "/api/report") return sendJson(response, 200, writeReport());
    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}/`);
});
