import assert from 'node:assert/strict'
import { validateEconBoundary } from '../../factory-os/product-intelligence/econBoundaryValidator.mjs'

const econ = {
  type: 'ExecutionContract',
  status: 'econ_ready',
  sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  baselineModifiedFiles: [
    'src/lib/teacher-mercy/pre-existing.ts'
  ],
  allowedFiles: [
    'factory-os/product-intelligence/**',
    'scripts/__tests__/**'
  ],
  forbiddenFiles: [
    'src/**',
    'supabase/**'
  ]
}

const result = validateEconBoundary({
  econ,
  finalModifiedFiles: [
    'factory-os/product-intelligence/econBoundaryValidator.mjs',
    'scripts/__tests__/econ-boundary-validator.test.mjs',
    'src/lib/teacher-mercy/pre-existing.ts',
    'src/lib/teacher-mercy/new-drift.ts',
    'README.md'
  ]
})

assert.equal(result.type, 'EconBoundaryValidation')
assert.equal(result.status, 'boundary_validated')
assert.deepEqual(result.allowedNewWork, [
  'factory-os/product-intelligence/econBoundaryValidator.mjs',
  'scripts/__tests__/econ-boundary-validator.test.mjs'
])
assert.deepEqual(result.preExistingDirtyFiles, [
  'src/lib/teacher-mercy/pre-existing.ts'
])
assert.deepEqual(result.forbiddenDrift, [
  'src/lib/teacher-mercy/new-drift.ts'
])
assert.deepEqual(result.outOfScopeContamination, [
  'README.md'
])
assert.equal(result.pass, false)
assert.equal(result.boundary.runtimeReadinessClaimed, false)
assert.equal(result.boundary.capabilityVerifiedClaimed, false)

const clean = validateEconBoundary({
  econ,
  finalModifiedFiles: [
    'factory-os/product-intelligence/econBoundaryValidator.mjs',
    'src/lib/teacher-mercy/pre-existing.ts'
  ]
})
assert.equal(clean.pass, true)

assert.throws(() => validateEconBoundary({ econ: { type: 'ExecutionContract', status: 'draft' }, finalModifiedFiles: [] }), /econ_ready/)
assert.throws(() => validateEconBoundary({ econ, finalModifiedFiles: null }), /finalModifiedFiles/)

console.log('econ boundary validator tests PASS')
