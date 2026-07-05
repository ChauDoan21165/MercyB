import assert from 'node:assert/strict'
import { generateJudgePrompt } from '../../factory-os/product-intelligence/judgePromptGenerator.mjs'

const judgePrompt = generateJudgePrompt({
  econ: {
    type: 'ExecutionContract',
    status: 'econ_ready',
    sourceObjectiveId: 'EO-TM-SPEAKING-OBS-001',
    pcap: 'TM_SPEAKING_RUNTIME_OBSERVATION',
    pflow: 'Speaking Runtime → product_observation effect → Observation Bus',
    baseCommit: '6064b6de',
    baselineModifiedFiles: ['src/pre-existing.ts'],
    allowedFiles: ['factory-os/product-intelligence/**', 'scripts/__tests__/**'],
    forbiddenFiles: ['src/**', 'supabase/**'],
    acceptanceCriteria: ['Judge validates boundary and test evidence.'],
    verificationCommands: ['node scripts/__tests__/judge-prompt-generator.test.mjs']
  }
})

assert.equal(judgePrompt.type, 'JudgePrompt')
assert.equal(judgePrompt.status, 'judge_prompt_ready')
assert.equal(judgePrompt.boundary.judgeIndependentFromWorker, true)
assert.equal(judgePrompt.boundary.workerMayMarkVerified, false)
assert.equal(judgePrompt.boundary.mayMergePushDeploy, false)
assert.equal(judgePrompt.boundary.runtimeReadinessClaimed, false)
assert.equal(judgePrompt.boundary.capabilityVerifiedClaimed, false)

assert.ok(judgePrompt.prompt.includes('You are the independent Judge.'))
assert.ok(judgePrompt.prompt.includes('F worker may not certify itself'))
assert.ok(judgePrompt.prompt.includes('baselineModifiedFiles') || judgePrompt.prompt.includes('ECON Baseline Modified Files'))
assert.ok(judgePrompt.prompt.includes('forbiddenDrift'))
assert.ok(judgePrompt.prompt.includes('outOfScopeContamination'))
assert.ok(judgePrompt.prompt.includes('PASS with evidence'))
assert.ok(judgePrompt.prompt.includes('FAIL with reasons'))
assert.ok(judgePrompt.prompt.includes('Do not merge, push, deploy, or mark verified.'))

assert.throws(() => generateJudgePrompt({ econ: { type: 'ExecutionContract', status: 'draft' } }), /econ_ready/)

console.log('judge prompt generator tests PASS')
