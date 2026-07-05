export function createCellGraph({ cells = [], relations = [] } = {}) {
  const byId = new Map()
  for (const cell of cells) {
    if (byId.has(cell.id)) throw new Error(`Duplicate Cell id: ${cell.id}`)
    byId.set(cell.id, cell)
  }

  for (const relation of relations) {
    if (!byId.has(relation.from)) throw new Error(`Relation from missing Cell: ${relation.from}`)
    if (!byId.has(relation.to)) throw new Error(`Relation to missing Cell: ${relation.to}`)
  }

  return {
    cells: [...byId.values()],
    relations,
    getCell(id) {
      return byId.get(id)
    },
    missingCells() {
      return [...byId.values()].filter((cell) => cell.health.missing.length > 0)
    },
    weakCells() {
      return [...byId.values()].filter((cell) => cell.health.weak)
    },
    unverifiedCells() {
      return [...byId.values()].filter((cell) => !cell.health.verified)
    }
  }
}
