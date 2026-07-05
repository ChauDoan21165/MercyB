function matchPattern(file, pattern) {
  if (!pattern) return false
  if (pattern.endsWith('/**')) return file === pattern.slice(0, -3) || file.startsWith(pattern.slice(0, -2))
  if (pattern.endsWith('*')) return file.startsWith(pattern.slice(0, -1))
  return file === pattern
}

function matchesAny(file, patterns = []) {
  return patterns.some(pattern => matchPattern(file, pattern))
}

export function validateEconBoundary({ econ, finalModifiedFiles }) {
  if (!econ || econ.type !== 'ExecutionContract' || econ.status !== 'econ_ready') {
    throw new Error('Boundary validation requires econ_ready ExecutionContract')
  }
  if (!Array.isArray(finalModifiedFiles)) {
    throw new Error('Boundary validation requires finalModifiedFiles array')
  }

  const baseline = new Set(econ.baselineModifiedFiles || [])
  const allowedFiles = econ.allowedFiles || []
  const forbiddenFiles = econ.forbiddenFiles || []

  const result = {
    type: 'EconBoundaryValidation',
    status: 'boundary_validated',
    sourceObjectiveId: econ.sourceObjectiveId,
    pcap: econ.pcap,
    pflow: econ.pflow,
    allowedNewWork: [],
    preExistingDirtyFiles: [],
    forbiddenDrift: [],
    outOfScopeContamination: [],
    boundary: {
      runtimeReadinessClaimed: false,
      capabilityVerifiedClaimed: false
    }
  }

  for (const file of [...finalModifiedFiles].sort()) {
    const wasDirty = baseline.has(file)
    const isAllowed = matchesAny(file, allowedFiles)
    const isForbidden = matchesAny(file, forbiddenFiles)

    if (wasDirty) {
      result.preExistingDirtyFiles.push(file)
    } else if (isForbidden) {
      result.forbiddenDrift.push(file)
    } else if (isAllowed) {
      result.allowedNewWork.push(file)
    } else {
      result.outOfScopeContamination.push(file)
    }
  }

  result.pass = result.forbiddenDrift.length === 0 && result.outOfScopeContamination.length === 0
  return result
}
