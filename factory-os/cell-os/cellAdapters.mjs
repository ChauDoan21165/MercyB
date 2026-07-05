import { createCell, createCellRelation } from './cellTypes.mjs'

export function lessonToCell(lesson) {
  return createCell({
    id: lesson.id || lesson.lessonId || lesson.slug,
    kind: 'lesson',
    label: lesson.title || lesson.name || lesson.slug,
    source: { adapter: 'lessonToCell' },
    health: {
      verified: Boolean(lesson.verified),
      missing: [
        ...(!lesson.audioId ? ['audio'] : []),
        ...(!lesson.imageId ? ['image'] : [])
      ]
    }
  })
}

export function capabilityToCell(capability) {
  return createCell({
    id: capability.id || capability.pcap,
    kind: 'capability',
    label: capability.label || capability.title || capability.id || capability.pcap,
    source: { adapter: 'capabilityToCell' },
    health: {
      verified: Boolean(capability.verified),
      weak: Boolean(capability.weak),
      missing: Array.isArray(capability.missing) ? capability.missing : []
    }
  })
}

export function assetRelation({ assetId, assetKind, ownerCellId }) {
  const assetCell = createCell({ id: assetId, kind: assetKind })
  const relation = createCellRelation({ from: ownerCellId, to: assetId, type: 'uses' })
  return { assetCell, relation }
}
