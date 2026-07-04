import http from 'node:http';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const port = 8766;

function status() {
  spawnSync(process.execPath, ['scripts/factory/c3-status-json.mjs'], { encoding: 'utf8' });
  return JSON.parse(fs.readFileSync('reports/c3-factory-status.json', 'utf8'));
}

function html(s) {
  const badge = s.health === 'healthy' ? '🟢 RUNNING' : '🟡 IDLE';
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="2">
<title>C3 Factory OS</title>
<style>
body{font-family:Menlo,monospace;background:#f7f1e7;color:#241b13;margin:0;padding:28px}
.card{max-width:520px;margin:auto;background:#fffaf3;border:1px solid #d8cab8;border-radius:18px;padding:24px}
h1{margin:0;font-size:24px} h2{margin:4px 0 20px;font-size:15px;font-weight:500;color:#6d5f52}
.badge{font-size:20px;margin-bottom:16px}
.row{display:flex;justify-content:space-between;border-top:1px solid #eadfce;padding:12px 0;font-size:18px}
.num{font-weight:800}
.small{font-size:13px;color:#7d7065;margin-top:18px}
</style>
</head>
<body>
<div class="card">
<h1>C3 Factory OS</h1>
<h2>${s.mission}</h2>
<div class="badge">${badge}</div>
<div class="row"><span>Workers</span><span class="num">${s.workersRunning} / ${s.workersTarget}</span></div>
<div class="row"><span>Ready WPs</span><span class="num">${s.readyWorkpacks}</span></div>
<div class="row"><span>Running</span><span class="num">${s.running}</span></div>
<div class="row"><span>F Done</span><span class="num">${s.fDone}</span></div>
<div class="row"><span>Judge Verified</span><span class="num">${s.judgeVerified}</span></div>
<div class="row"><span>Bad WPs</span><span class="num">${s.badWorkpacks}</span></div>
<div class="row"><span>HEAD</span><span class="num">${s.head}</span></div>
<div class="small">Updated ${s.updated}</div>
</div>
</body>
</html>`;
}

http.createServer((req, res) => {
  const s = status();
  if (req.url === '/status.json') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(`${JSON.stringify(s, null, 2)}\n`);
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(html(s));
}).listen(port, '127.0.0.1');
