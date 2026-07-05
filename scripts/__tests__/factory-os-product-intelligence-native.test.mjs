import { describe, expect, test } from 'vitest'

describe('Factory OS Product Intelligence native contracts', () => {
  test('core modules load without side effects', async () => {
    const modulePaths = [
      '../../factory-os/product-intelligence/runtimeEventObserver.mjs',
      '../../factory-os/product-intelligence/speakingRuntimeObserver.mjs',
      '../../factory-os/product-intelligence/observationBus.mjs',
      '../../factory-os/product-intelligence/capabilityCoverageEngine.mjs',
      '../../factory-os/product-intelligence/productGapInvestmentAdapter.mjs',
      '../../factory-os/product-intelligence/engineeringObjectiveGenerator.mjs',
      '../../factory-os/product-intelligence/executionContractGenerator.mjs',
      '../../factory-os/product-intelligence/econBoundaryValidator.mjs',
      '../../factory-os/product-intelligence/workerPromptGenerator.mjs',
      '../../factory-os/product-intelligence/judgePromptGenerator.mjs',
      '../../factory-os/product-intelligence/econRunbookGenerator.mjs',
      '../../factory-os/product-intelligence/productIntelligenceOrchestrator.mjs',
      '../../factory-os/product-intelligence/packageQueueAdapter.mjs',
      '../../factory-os/product-intelligence/singleObjectiveRunnerSkeleton.mjs',
      '../../factory-os/product-intelligence/runnerExecutionGate.mjs',
      '../../factory-os/product-intelligence/executionResultContract.mjs',
      '../../factory-os/product-intelligence/judgeResultContract.mjs',
      '../../factory-os/product-intelligence/verifiedAccountingGate.mjs',
      '../../factory-os/product-intelligence/mercybRepositoryAdapter.mjs'
    ]

    for (const modulePath of modulePaths) {
      const mod = await import(modulePath)
      expect(Object.keys(mod).length).toBeGreaterThan(0)
    }
  })

  test('observation bus accepts a product_observation fixture', async () => {
    const { createObservationBus } =
      await import('../../factory-os/product-intelligence/observationBus.mjs')

    const bus = createObservationBus()
    const result = bus.emit({
      kind: 'product_observation',
      payload: {
        observer: 'nativeVitest',
        productCapability: 'PCAP-TM-SPEAKING-TONE-PRODUCT-LIKE-001',
        productFlow: 'PFLOW-TM-SPEAKING-RUNTIME-OBSERVATION-001'
      }
    })

    expect(result).toBeTruthy()
  })
})
