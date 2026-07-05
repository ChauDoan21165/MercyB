export const CELL_OS_V0_VERSION = 'cell-os-v0'

export const CELL_KINDS = Object.freeze([
  'room',
  'lesson',
  'sentence',
  'word',
  'character',
  'concept',
  'audio',
  'image',
  'capability',
  'replay',
  'evidence',
  'packet',
  'learner',
  'product'
])

export const CELL_RELATION_TYPES = Object.freeze([
  'contains',
  'uses',
  'depends_on',
  'observes',
  'validates',
  'covers',
  'requires',
  'produces'
])

export function createCell({ id, kind, label, source = {}, state = 'identified', health = {} }) {
  if (!id || typeof id !== 'string') throw new Error('Cell requires stable string id')
  if (!CELL_KINDS.includes(kind)) throw new Error(`Unsupported cell kind: ${kind}`)
  return {
    version: CELL_OS_V0_VERSION,
    id,
    kind,
    label: label || id,
    source,
    state,
    health: {
      coverage: health.coverage ?? 'unknown',
      verified: health.verified ?? false,
      weak: health.weak ?? false,
      missing: Array.isArray(health.missing) ? health.missing : []
    }
  }
}

export function createCellRelation({ from, to, type, evidence = {} }) {
  if (!from || !to) throw new Error('Cell relation requires from and to')
  if (!CELL_RELATION_TYPES.includes(type)) throw new Error(`Unsupported relation type: ${type}`)
  return { from, to, type, evidence }
}
