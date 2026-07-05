import { describe, expect, test } from 'vitest'
import { createCell, createCellRelation } from '../../factory-os/cell-os/cellTypes.mjs'
import { createCellGraph } from '../../factory-os/cell-os/cellGraph.mjs'

describe('Cell OS v0 contracts', () => {
  test('creates stable product cells without changing runtime behavior', () => {
    const capability = createCell({
      id: 'PCAP-TM-SPEAKING-TONE-PRODUCT-LIKE-001',
      kind: 'capability',
      label: 'Speaking tone product-like capability',
      health: { verified: false, weak: true, missing: ['runtime-replay', 'judge-verification'] }
    })

    expect(capability.id).toBe('PCAP-TM-SPEAKING-TONE-PRODUCT-LIKE-001')
    expect(capability.health.verified).toBe(false)
    expect(capability.health.missing).toContain('judge-verification')
  })

  test('builds typed cell relationships', () => {
    const capability = createCell({ id: 'PCAP-1', kind: 'capability' })
    const evidence = createCell({ id: 'EVID-1', kind: 'evidence' })
    const relation = createCellRelation({ from: 'EVID-1', to: 'PCAP-1', type: 'validates' })

    const graph = createCellGraph({ cells: [capability, evidence], relations: [relation] })

    expect(graph.getCell('PCAP-1').kind).toBe('capability')
    expect(graph.relations[0].type).toBe('validates')
  })

  test('detects weak, missing, and unverified cells', () => {
    const graph = createCellGraph({
      cells: [
        createCell({ id: 'LESSON-1', kind: 'lesson', health: { verified: true } }),
        createCell({ id: 'AUDIO-1', kind: 'audio', health: { verified: false, weak: true, missing: ['native-review'] } })
      ]
    })

    expect(graph.weakCells().map((cell) => cell.id)).toEqual(['AUDIO-1'])
    expect(graph.missingCells().map((cell) => cell.id)).toEqual(['AUDIO-1'])
    expect(graph.unverifiedCells().map((cell) => cell.id)).toEqual(['AUDIO-1'])
  })
})
