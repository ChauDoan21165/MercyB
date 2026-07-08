#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const repo = process.cwd();
const packetRoot = path.join(repo, 'state', 'packets');
const report = path.join(repo, 'reports', 'FACTORY_PACKET_OS_REPORT.md');

const schemas = {
  capability: ['id','title','runtime_entrypoints','expected_evidence','expected_replay','expected_judge'],
  workpack: ['id','capability_id','objective','files_allowed','acceptance_tests','anti_fake_checks'],
  implementation: ['id','workpack_id','commit','changed_files','tests_run'],
  evidence: ['id','workpack_id','files','hashes','runtime_notes'],
  replay: ['id','workpack_id','replay_file','input_hash','output_hash'],
  verification: ['id','workpack_id','judge','status','evidence_checked','anti_fake_checked']
};

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function writeJson(p,obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2)+'\n'); }
function sha(s){ return crypto.createHash('sha256').update(s).digest('hex'); }

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules','.git','.claude','docs','dist','build','.next','coverage'].includes(name)) continue;
    const p = path.join(dir,name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p,out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

function productFiles() {
  return ['src','app','api','core','components','lib','pages']
    .flatMap(d => walk(path.join(repo,d)))
    .filter(Boolean);
}

function findRuntimeEntrypoints() {
  const files = productFiles();
  const out = [];
  for (const f of files) {
    const rel = path.relative(repo,f);
    const txt = fs.readFileSync(f,'utf8');

    let score = 0;
    if (/TeacherMercy|Teacher Mercy|teacherContext|TeacherContext/i.test(txt)) score += 5;
    if (/runtimeIntegration|RuntimeReplay|runtime replay|runtime event|emit|dispatchEvent|create.*Event/i.test(txt)) score += 5;
    if (/observation|OBS|LearningSignal|TeacherContext|decision|pedagogy|DP/i.test(txt)) score += 4;
    if (/export function|export const|export default|handler|POST|GET/i.test(txt)) score += 2;

    if (/src\/lib\/teacher-mercy|src\/lib\/placement|src\/lib\/speech|src\/lib\/ai-tutor/i.test(rel)) score += 4;
    if (/src\/components\/mercy|src\/components\/ai-tutor|src\/components\/teacher-mercy/i.test(rel)) score += 2;
    if (/__tests__|\.test\.|\.fixtures\./i.test(rel)) score -= 6;
    if (/Certificate|notebook|keyboard|slos/i.test(rel)) score -= 4;

    const kind = /__tests__|\.test\./i.test(rel) ? 'test' :
      /src\/components\//i.test(rel) ? 'component' :
      /src\/lib\//i.test(rel) ? 'runtime_lib' :
      /api\//i.test(rel) ? 'api' : 'other';

    if (score >= 7) out.push({file: rel, score, kind});
  }
  return out.sort((a,b)=>b.score-a.score || a.file.localeCompare(b.file)).slice(0,40);
}


function firstExistingRuntimeCandidate(runtimeEntrypoints) {
  const preferred = [
    'src/lib/tm-int/runtime/replay.ts',
    'src/lib/tm-int/runtimeReadiness/decisionTrace.ts',
    'src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts',
    'src/lib/tm-int/runtimeReadiness/judgeRubric.ts',
    'src/lib/placement/v3/rr001RuntimeReplay.ts',
    'src/lib/placement/v3/runtimeIntegration.ts',
    'src/lib/teacher-mercy/engine.ts'
  ];
  for (const f of preferred) {
    const hit = runtimeEntrypoints.find(x => x.file === f);
    if (hit) return hit;
  }
  return runtimeEntrypoints[0] || null;
}

ensureDir(packetRoot);
for (const type of Object.keys(schemas)) ensureDir(path.join(packetRoot,type));

const runtimeEntrypoints = findRuntimeEntrypoints();

const seedCapability = {
  id: 'CAP-TEACHER-MERCY-RUNTIME-READINESS-001',
  title: 'Teacher Mercy Runtime Readiness',
  runtime_entrypoints: runtimeEntrypoints,
  expected_evidence: ['runtime event','OBS packet','Teacher Context','DP/PED decision','visible behavior change'],
  expected_replay: ['production-like replay bundle'],
  expected_judge: ['independent runtime truth judge'],
  status: runtimeEntrypoints.length ? 'runtime_candidates_found' : 'packet_seed_no_runtime_found',
  created_at: new Date().toISOString()
};

writeJson(path.join(packetRoot,'capability',`${seedCapability.id}.json`), seedCapability);

const seedWP = {
  id: 'WP-PACKET-OS-001',
  capability_id: seedCapability.id,
  objective: 'Confirm the mapped Teacher Mercy runtime candidates and connect the real runtime path to evidence/replay/Judge packets without claiming verification.',
  files_allowed: ['src/**','app/**','api/**','core/**','components/**','lib/**','pages/**','scripts/**','tests/**','reports/**','state/packets/**'],
  acceptance_tests: ['node scripts/factory-packet-os-v1.mjs --validate'],
  anti_fake_checks: [
    'No verified status unless verification packet has judge status pass',
    'No docs-only capability counted as runtime',
    'No .claude/worktrees evidence counted as product runtime',
    'Runtime entrypoint must be product code, not docs or archived worktrees'
  ],
  status: 'ready',
  created_at: new Date().toISOString()
};
writeJson(path.join(packetRoot,'workpack',`${seedWP.id}.json`), seedWP);

const primaryRuntime = firstExistingRuntimeCandidate(runtimeEntrypoints);

if (primaryRuntime) {
  const sourcePath = path.join(repo, primaryRuntime.file);
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const sourceHash = sha(sourceText);

  writeJson(path.join(packetRoot,'evidence','EV-TEACHER-MERCY-RUNTIME-READINESS-001.json'), {
    id: 'EV-TEACHER-MERCY-RUNTIME-READINESS-001',
    workpack_id: seedWP.id,
    files: [primaryRuntime.file],
    hashes: {[primaryRuntime.file]: sourceHash},
    runtime_notes: [
      'candidate evidence packet generated from product runtime source',
      'not proof of runtime execution yet',
      'requires replay and independent Judge before verified'
    ],
    status: 'candidate',
    created_at: new Date().toISOString()
  });

  writeJson(path.join(packetRoot,'replay','RP-TEACHER-MERCY-RUNTIME-READINESS-001.json'), {
    id: 'RP-TEACHER-MERCY-RUNTIME-READINESS-001',
    workpack_id: seedWP.id,
    replay_file: primaryRuntime.file.includes('replay') ? primaryRuntime.file : '',
    input_hash: '',
    output_hash: '',
    candidate_runtime_file: primaryRuntime.file,
    status: primaryRuntime.file.includes('replay') ? 'candidate_replay_file_found' : 'required_missing_replay_file',
    created_at: new Date().toISOString()
  });

  writeJson(path.join(packetRoot,'verification','VF-TEACHER-MERCY-RUNTIME-READINESS-001.json'), {
    id: 'VF-TEACHER-MERCY-RUNTIME-READINESS-001',
    workpack_id: seedWP.id,
    judge: 'independent_runtime_truth_judge_required',
    status: 'required_not_run',
    evidence_checked: false,
    anti_fake_checked: false,
    candidate_runtime_file: primaryRuntime.file,
    required_checks: [
      'source file exists in product runtime area',
      'runtime event can be produced',
      'OBS/Teacher Context packet can be observed',
      'DP/PED decision or visible behavior change can be replayed',
      'evidence hash matches source/runtime artifact',
      'not docs-only',
      'not worker self-verification'
    ],
    created_at: new Date().toISOString()
  });
}

function listJson(type){
  const dir = path.join(packetRoot,type);
  return fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>{
    const p = path.join(dir,f);
    return {file:p, data:JSON.parse(fs.readFileSync(p,'utf8'))};
  });
}

let errors = [];
let counts = {};
for (const [type, required] of Object.entries(schemas)) {
  const rows = listJson(type);
  counts[type]=rows.length;
  for (const row of rows) {
    for (const key of required) {
      if (!(key in row.data)) errors.push(`${type}/${path.basename(row.file)} missing ${key}`);
    }
  }
}

const allPacketText = Object.entries(schemas).flatMap(([type]) =>
  listJson(type).map(r => `${type}:${path.basename(r.file)}:${JSON.stringify(r.data)}`)
).join('\n');

const out = `# Factory Packet OS v1.4

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Packet Counts

${Object.entries(counts).map(([k,v])=>`- ${k}: ${v}`).join('\n')}

## Validation

${errors.length ? errors.map(e=>`- FAIL ${e}`).join('\n') : '- PASS packet schemas valid'}

## Runtime Candidates for Teacher Mercy Runtime Readiness

${runtimeEntrypoints.length ? runtimeEntrypoints.map(x=>`- ${x.file} score=${x.score}`).join('\n') : '- NONE FOUND'}

## System Hash

${sha(allPacketText)}

## Current Truth

- Capability packet exists.
- Workpack packet exists.
- Runtime candidates are mapped from product code only.
- Evidence/replay/verification packets are now manufactured as candidates/requirements.
- Nothing is verified yet; verification packet is required_not_run.

## Release Gate Status

${releaseBlockers.length ? '- BLOCKED' : '- PASS'}

## Release Blockers

${releaseBlockers.length ? releaseBlockers.map(x=>`- ${x}`).join('\n') : '- None'}

## Next Best Workpack

Create evidence/replay packet generator for the top real runtime candidate, then require independent Judge packet before verified status.

## Rule

Factory may produce packets.
Factory may assemble packets.
Factory may recommend next workpacks.
Factory must not mark product verified.
Only independent Judge verification packet can support verified status.
`;

ensureDir(path.dirname(report));
fs.writeFileSync(report,out);
console.log(out);
