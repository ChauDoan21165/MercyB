import fs from 'node:fs'
import path from 'node:path'

function walkFiles(root, allowedExtensions = new Set(['.json', '.md'])) {
  const found = []

  function walk(dir) {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue
        walk(full)
      } else if (allowedExtensions.has(path.extname(entry.name))) {
        found.push(full)
      }
    }
  }

  walk(root)
  return found
}

export function normalizeEngineeringInvestment(candidate, sourcePath = 'unknown') {
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('EngineeringInvestment candidate must be an object')
  }

  const id = candidate.id || candidate.investmentId || candidate.wp_id || candidate.objective_id
  const status = candidate.status
  const pcap = candidate.pcap || candidate.productCapability || candidate.capability || candidate.semantic_key
  const pflow = candidate.pflow || candidate.runtimeFlow || candidate.flow || candidate.objective
  const problem = candidate.problem || candidate.gap || candidate.objective || candidate.title
  const productValue = candidate.productValue || candidate.expected_product_value || candidate.value || candidate.objective

  if (!id) throw new Error('EngineeringInvestment missing id')
  if (status !== 'objective_ready') throw new Error('EngineeringInvestment is not objective_ready')
  if (!pcap) throw new Error('EngineeringInvestment missing PCAP')
  if (!pflow) throw new Error('EngineeringInvestment missing PFLOW')

  return {
    id,
    status: 'objective_ready',
    pcap,
    pflow,
    problem: problem || 'MercyB repository objective-ready investment.',
    productValue: productValue || 'Strengthens one Teacher Mercy product capability or runtime flow.',
    allowedFiles: candidate.allowedFiles || candidate.allowed_files || [],
    forbiddenFiles: candidate.forbiddenFiles || candidate.forbidden_files || ['deployment/**', 'supabase/**'],
    acceptanceCriteria: candidate.acceptanceCriteria || candidate.acceptance_tests || candidate.acceptance || [],
    verificationCommands: candidate.verificationCommands || candidate.verification_commands || candidate.judge_checks || [],
    sourcePath
  }
}

export function discoverObjectiveReadyInvestments({ repoRoot, searchRoots = ['factory-os', 'reports', 'state'] }) {
  if (!repoRoot) throw new Error('repoRoot is required')

  const investments = []

  for (const relativeRoot of searchRoots) {
    const root = path.join(repoRoot, relativeRoot)
    for (const file of walkFiles(root)) {
      const text = fs.readFileSync(file, 'utf8')

      if (!text.includes('objective_ready')) continue

      if (file.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text)
          const candidates = Array.isArray(parsed) ? parsed : [parsed]
          for (const candidate of candidates) {
            try {
              investments.push(normalizeEngineeringInvestment(candidate, path.relative(repoRoot, file)))
            } catch {
      // Ignore unreadable candidate files during repository discovery.
    }
          }
        } catch {
      // Ignore unreadable candidate files during repository discovery.
    }
      } else {
        const id = text.match(/(?:id|investmentId|wp_id|objective_id)\s*[:=]\s*([A-Z0-9._:-]+)/i)?.[1]
        const pcap = text.match(/(?:PCAP|pcap|product capability)\s*[:=]\s*(.+)/i)?.[1]?.trim()
        const pflow = text.match(/(?:PFLOW|pflow|runtime flow)\s*[:=]\s*(.+)/i)?.[1]?.trim()
        if (id && pcap && pflow) {
          try {
            investments.push(normalizeEngineeringInvestment({
              id,
              status: 'objective_ready',
              pcap,
              pflow,
              problem: `Discovered from ${path.relative(repoRoot, file)}`,
              productValue: `Repository-discovered MercyB objective from ${path.relative(repoRoot, file)}`
            }, path.relative(repoRoot, file)))
          } catch {
      // Ignore unreadable candidate files during repository discovery.
    }
        }
      }
    }
  }

  return investments.sort((a, b) => String(a.id).localeCompare(String(b.id)))
}

export function selectFirstObjectiveReadyInvestment({ investments }) {
  if (!Array.isArray(investments)) throw new Error('investments must be an array')
  const first = investments.find(item => item.status === 'objective_ready')
  if (!first) throw new Error('No objective_ready EngineeringInvestment found')
  return first
}
