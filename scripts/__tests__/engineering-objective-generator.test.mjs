import assert from 'node:assert/strict'
import { generateEngineeringObjective } from '../../factory-os/product-intelligence/engineeringObjectiveGenerator.mjs'

const eo = generateEngineeringObjective({
  id: 'INV-TM-SPEAKING-OBS-001',
  status: 'objective_ready',
  pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
  pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
  problem: 'Speaking observations need bounded conversion into executable engineering objectives.',
  productValue: 'Factory can select one real Teacher Mercy runtime gap at a time.',
  allowedFiles: [
    'factory-os/product-intelligence/**',
    'scripts/__tests__/**'
  ],
  verificationCommands: [
    'node scripts/__tests__/engineering-objective-generator.test.mjs'
  ]
})

assert.equal(eo.type, 'EngineeringObjective')
assert.equal(eo.status, 'bounded_ready')
assert.equal(eo.pcap, 'TM_SPEAKING_RUNTIME_OBSERVATION')
assert.equal(eo.boundary.runtimeReadinessClaimed, false)
assert.equal(eo.boundary.capabilityVerifiedClaimed, false)
assert.equal(eo.boundary.requiresECONBeforeImplementation, true)
assert.equal(eo.boundary.oneObjectiveAtATime, true)
assert.ok(eo.allowedFiles.length > 0)
assert.ok(eo.antiFakeChecks.some(x => x.includes('PCAP/PFLOW')))

assert.throws(() => generateEngineeringObjective({ status: 'draft' }), /objective_ready/)

console.log('engineering objective generator tests PASS')
