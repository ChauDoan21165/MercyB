import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {
  normalizeEngineeringInvestment,
  discoverObjectiveReadyInvestments,
  selectFirstObjectiveReadyInvestment
} from '../../factory-os/product-intelligence/mercybRepositoryAdapter.mjs'

const normalized = normalizeEngineeringInvestment({
  id: 'INV-TM-REAL-001',
  status: 'objective_ready',
  pcap: 'TM_REAL_PRODUCT_CAPABILITY',
  pflow: 'Runtime → Observation → Gap',
  expected_product_value: 'Strengthens a real Teacher Mercy product capability.',
  allowed_files: ['src/lib/teacher-mercy/**'],
  acceptance_tests: ['npm test']
}, 'reports/example.json')

assert.equal(normalized.id, 'INV-TM-REAL-001')
assert.equal(normalized.status, 'objective_ready')
assert.equal(normalized.pcap, 'TM_REAL_PRODUCT_CAPABILITY')
assert.equal(normalized.pflow, 'Runtime → Observation → Gap')
assert.equal(normalized.sourcePath, 'reports/example.json')
assert.deepEqual(normalized.allowedFiles, ['src/lib/teacher-mercy/**'])
assert.deepEqual(normalized.acceptanceCriteria, ['npm test'])

assert.throws(() => normalizeEngineeringInvestment({ id: 'x', status: 'draft', pcap: 'p', pflow: 'f' }), /not objective_ready/)
assert.throws(() => normalizeEngineeringInvestment({ status: 'objective_ready', pcap: 'p', pflow: 'f' }), /missing id/)

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mercyb-repo-adapter-'))
fs.mkdirSync(path.join(tmp, 'state'), { recursive: true })
fs.writeFileSync(path.join(tmp, 'state', 'investment.json'), JSON.stringify({
  id: 'INV-TM-DISCOVERED-001',
  status: 'objective_ready',
  pcap: 'TM_DISCOVERED_CAPABILITY',
  pflow: 'Discovered Runtime Flow',
  objective: 'Discovered objective-ready investment.'
}, null, 2))

const discovered = discoverObjectiveReadyInvestments({
  repoRoot: tmp,
  searchRoots: ['state']
})

assert.equal(discovered.length, 1)
assert.equal(discovered[0].id, 'INV-TM-DISCOVERED-001')
assert.equal(discovered[0].sourcePath, 'state/investment.json')

const selected = selectFirstObjectiveReadyInvestment({ investments: discovered })
assert.equal(selected.id, 'INV-TM-DISCOVERED-001')

assert.throws(() => selectFirstObjectiveReadyInvestment({ investments: [] }), /No objective_ready/)

console.log('mercyb repository adapter tests PASS')
