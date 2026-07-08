#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const repo = process.cwd();
const report = path.join(repo, 'reports', 'AUDIO_COVERAGE_REPORT.md');
const missingReport = path.join(repo, 'reports', 'MISSING_AUDIO_WORKPACKS.md');
const outDir = path.join(repo, 'state', 'audio_coverage');
fs.mkdirSync(outDir, {recursive:true});
fs.mkdirSync(path.join(repo,'reports'), {recursive:true});

function walk(dir,out=[]){
  if(!fs.existsSync(dir)) return out;
  for(const name of fs.readdirSync(dir)){
    if(['node_modules','.git','.claude','dist','build','.next','coverage'].includes(name)) continue;
    const p=path.join(dir,name);
    const st=fs.statSync(p);
    if(st.isDirectory()) walk(p,out);
    else out.push(p);
  }
  return out;
}
function sha(s){return crypto.createHash('sha256').update(s).digest('hex');}

const textFiles = ['src','app','api','core','data','content','public']
  .flatMap(d=>walk(path.join(repo,d)))
  .filter(f=>/\.(ts|tsx|js|jsx|mjs|json|md)$/.test(f));

const audioFiles = ['public','src','data','content']
  .flatMap(d=>walk(path.join(repo,d)))
  .filter(f=>/\.(mp3|wav|m4a|ogg|aac|webm)$/i.test(f));

const expected = new Map();
const existing = new Map();

function addExpected(cell){
  if(!cell.text || cell.text.length < 1) return;
  expected.set(cell.cell_id, cell);
}

function normLang(x){ return String(x||'unknown').toLowerCase(); }

for(const f of textFiles){
  const rel=path.relative(repo,f);
  const txt=fs.readFileSync(f,'utf8');

  const idRegex=/(MB-[A-Z]+-\d{6,}|[A-Z]{2,}-[A-Z0-9-]*\d{3,})/g;
  const ids=[...new Set([...txt.matchAll(idRegex)].map(m=>m[1]))];

  for(const id of ids){
    if(/AUD/.test(id)) continue;
    const likelySentence=/SEN|SENT|sentence/i.test(id) || /sentence/i.test(rel);
    const likelyConcept=/CON|concept|word|character|tone|phoneme/i.test(id) || /concept|word|character|tone|phoneme/i.test(rel);

    if(likelySentence){
      addExpected({
        cell_id:`AUDCELL-SENTENCE-${id}`,
        cell_type:'sentence',
        source_id:id,
        language:'unknown',
        text:id,
        source_file:rel,
        priority:'high'
      });
    } else if(likelyConcept){
      addExpected({
        cell_id:`AUDCELL-CONCEPT-${id}`,
        cell_type:'concept',
        source_id:id,
        language:'unknown',
        text:id,
        source_file:rel,
        priority:'medium'
      });
    }
  }

  const audioIdRegex=/(MB-[A-Z]+-\d{6,}-AUD-[A-Z]{2,}|[A-Z0-9-]+AUD[A-Z0-9-]+)/g;
  for(const m of txt.matchAll(audioIdRegex)){
    existing.set(m[1], {
      audio_id:m[1],
      source_file:rel,
      evidence_type:'code_reference'
    });
  }
}

for(const f of audioFiles){
  const rel=path.relative(repo,f);
  const base=path.basename(f);
  const id=base.replace(/\.[^.]+$/,'');
  existing.set(id, {
    audio_id:id,
    file_path:rel,
    evidence_type:'file',
    hash:sha(fs.readFileSync(f))
  });
}

const missing=[];
for(const cell of expected.values()){
  const src=cell.source_id;
  const has=[...existing.keys()].some(aid => aid.includes(src) || aid.includes(src.replace(/^MB-/,'')));
  if(!has){
    missing.push({
      ...cell,
      reason:'no matching audio id/file found',
      suggested_workpack_id:`WP-AUDIO-MISSING-${sha(cell.cell_id).slice(0,10).toUpperCase()}`
    });
  }
}

fs.writeFileSync(path.join(outDir,'expected_audio_cells.json'), JSON.stringify([...expected.values()],null,2)+'\n');
fs.writeFileSync(path.join(outDir,'existing_audio_assets.json'), JSON.stringify([...existing.values()],null,2)+'\n');
fs.writeFileSync(path.join(outDir,'missing_audio_cells.json'), JSON.stringify(missing,null,2)+'\n');

const topMissing=missing.slice(0,200);

fs.writeFileSync(report, `# Audio Coverage Ledger v1

Generated: ${new Date().toISOString()}
Repo: ${repo}

## Counts

- expected_audio_cells: ${expected.size}
- existing_audio_assets: ${existing.size}
- missing_audio_cells: ${missing.length}
- coverage_estimate: ${expected.size ? (((expected.size-missing.length)/expected.size)*100).toFixed(2) : '0.00'}%

## Scope

This v1 scanner detects ID-based expected audio cells and existing audio IDs/files.
It is conservative and may need repo-specific tuning for exact lesson/sentence tables.

## Top Missing Cells

${topMissing.map(x=>`- ${x.suggested_workpack_id} ${x.cell_type} ${x.source_id} source=${x.source_file}`).join('\n') || '- None'}

## Files Written

- state/audio_coverage/expected_audio_cells.json
- state/audio_coverage/existing_audio_assets.json
- state/audio_coverage/missing_audio_cells.json
- reports/MISSING_AUDIO_WORKPACKS.md
`);

fs.writeFileSync(missingReport, `# Missing Audio Workpacks v1

Generated: ${new Date().toISOString()}

## Workpacks

${topMissing.map(x=>`## ${x.suggested_workpack_id}

- cell_id: ${x.cell_id}
- cell_type: ${x.cell_type}
- source_id: ${x.source_id}
- source_file: ${x.source_file}
- reason: ${x.reason}
- objective: Generate or link missing audio for this expected audio cell.
- anti_fake_checks:
  - audio file or canonical audio_id must exist
  - cell_id must map back to source_id
  - no duplicate audio_id
  - tonal/hard-pronunciation language must not use unsafe provider without approval
`).join('\n') || '- None'}
`);

console.log(fs.readFileSync(report,'utf8'));
