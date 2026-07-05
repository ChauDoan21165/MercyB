import { describe, expect, test } from 'vitest'
import { assetRelation, capabilityToCell, lessonToCell } from '../../factory-os/cell-os/cellAdapters.mjs'
import { createCellGraph } from '../../factory-os/cell-os/cellGraph.mjs'

describe('Cell OS v0 adapters', () => {
  test('wraps existing lesson-like objects without replacing them', () => {
    const lesson = lessonToCell({ id: 'LESSON-VI-001', title: 'Vietnamese tone lesson', audioId: 'AUD-1' })

    expect(lesson.id).toBe('LESSON-VI-001')
    expect(lesson.kind).toBe('lesson')
    expect(lesson.source.adapter).toBe('lessonToCell')
    expect(lesson.health.missing).toEqual(['image'])
  })

  test('wraps capability-like objects as Product Cells', () => {
    const capability = capabilityToCell({
      pcap: 'PCAP-TM-SPEAKING-TONE-PRODUCT-LIKE-001',
      weak: true,
      missing: ['judge-verification']
    })

    expect(capability.kind).toBe('capability')
    expect(capability.health.weak).toBe(true)
    expect(capability.health.verified).toBe(false)
  })

  test('creates asset relationship cells without mutating source object', () => {
    const lesson = lessonToCell({ id: 'LESSON-1', title: 'Lesson 1', audioId: 'AUD-1', imageId: 'IMG-1' })
    const { assetCell, relation } = assetRelation({ assetId: 'AUD-1', assetKind: 'audio', ownerCellId: lesson.id })

    const graph = createCellGraph({ cells: [lesson, assetCell], relations: [relation] })

    expect(graph.relations[0].type).toBe('uses')
    expect(graph.getCell('AUD-1').kind).toBe('audio')
  })
})
