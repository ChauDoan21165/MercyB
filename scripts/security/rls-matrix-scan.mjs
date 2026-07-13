#!/usr/bin/env node
// Static Supabase migration RLS matrix scanner.

import fs from "node:fs";
import path from "node:path";

export const DEFAULT_MIGRATIONS_DIR = "supabase/migrations";
export const DEFAULT_INTENT_PATH = "security/rls-intent.json";
export const DEFAULT_REPORT_PATH = "reports/security/rls-matrix.md";

function rel(root, file) {
  return path.relative(root, file) || file;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function stripIdentifierQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1).replace(/""/g, '"');
  return trimmed;
}

function normalizeIdentifier(value) {
  const trimmed = value.trim().replace(/;$/, "");
  if (!trimmed) return "";
  return stripIdentifierQuotes(trimmed).toLowerCase();
}

function normalizeTableName(raw) {
  let value = raw.trim();
  value = value.replace(/\s+/g, "");
  value = value.replace(/^only\s+/i, "");
  value = value.replace(/^ifexists/i, "");
  value = value.replace(/;$/, "");
  const parts = value.split(".").filter(Boolean).map(normalizeIdentifier);
  if (parts.length === 1) return `public.${parts[0]}`;
  return `${parts.at(-2)}.${parts.at(-1)}`;
}

function summarizeExpression(value) {
  const normalized = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^\((.*)\)$/s, "$1")
    .trim();
  return normalized || null;
}

function splitSqlStatements(sql) {
  const statements = [];
  let start = 0;
  let quote = null;
  let dollarTag = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }
    if (dollarTag) {
      if (sql.startsWith(dollarTag, i)) {
        i += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }
    if (quote) {
      if (ch === quote) {
        if (quote === "'" && next === "'") {
          i++;
        } else {
          quote = null;
        }
      }
      continue;
    }

    if (ch === "-" && next === "-") {
      lineComment = true;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === "$") {
      const match = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
      if (match) {
        dollarTag = match[0];
        i += dollarTag.length - 1;
        continue;
      }
    }
    if (ch === ";") {
      const text = sql.slice(start, i + 1).trim();
      if (text) statements.push({ text, offset: start });
      start = i + 1;
    }
  }

  const tail = sql.slice(start).trim();
  if (tail) statements.push({ text: tail, offset: start });
  return statements;
}

function compactSql(sql) {
  return sql
    .replace(/--.*$/gm, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;$/, "");
}

function executableOffset(sqlFragment) {
  let i = 0;
  while (i < sqlFragment.length) {
    if (/\s/.test(sqlFragment[i])) {
      i++;
      continue;
    }
    if (sqlFragment.startsWith("--", i)) {
      const end = sqlFragment.indexOf("\n", i + 2);
      i = end === -1 ? sqlFragment.length : end + 1;
      continue;
    }
    if (sqlFragment.startsWith("/*", i)) {
      const end = sqlFragment.indexOf("*/", i + 2);
      i = end === -1 ? sqlFragment.length : end + 2;
      continue;
    }
    return i;
  }
  return 0;
}

function readBalancedParens(text, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (quote) {
      if (ch === quote) {
        if (quote === "'" && next === "'") i++;
        else quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") {
      depth--;
      if (depth === 0) return text.slice(openIndex, i + 1);
    }
  }
  return null;
}

function extractClause(statement, keywordPattern) {
  const match = keywordPattern.exec(statement);
  if (!match) return null;
  let index = match.index + match[0].length;
  while (/\s/.test(statement[index] || "")) index++;
  if (statement[index] !== "(") return null;
  return summarizeExpression(readBalancedParens(statement, index));
}

function extractRoles(statement) {
  const match = statement.match(/\bto\s+(.+?)(?=\s+(?:using|with\s+check)\b|$)/i);
  if (!match) return ["public"];
  return match[1]
    .split(",")
    .flatMap((role) => role.trim().split(/\s+/))
    .map((role) => normalizeIdentifier(role))
    .filter(Boolean)
    .sort();
}

function ensureTable(tables, name, source) {
  if (!tables.has(name)) {
    tables.set(name, {
      table: name,
      created_in_migrations: false,
      rls_enabled: false,
      sources: [],
      policies: new Map(),
    });
  }
  const table = tables.get(name);
  if (source) table.sources.push(source);
  return table;
}

function parsePolicyName(raw) {
  const quoted = raw.match(/^"((?:[^"]|"")+)"/);
  if (quoted) return { name: quoted[1].replace(/""/g, '"'), rest: raw.slice(quoted[0].length).trim() };
  const match = raw.match(/^(\S+)\s*(.*)$/);
  return { name: normalizeIdentifier(match?.[1] || ""), rest: match?.[2]?.trim() || "" };
}

function parseCreatePolicy(statement) {
  const after = statement.replace(/^create\s+policy\s+/i, "");
  const parsedName = parsePolicyName(after);
  const onMatch = parsedName.rest.match(/^on\s+(.+?)(?=\s+(?:as|for|to|using|with\s+check)\b|$)/i);
  if (!onMatch) return null;
  const table = normalizeTableName(onMatch[1]);
  const command = normalizeIdentifier(statement.match(/\bfor\s+(all|select|insert|update|delete)\b/i)?.[1] || "all");
  return {
    name: parsedName.name,
    table,
    command,
    roles: extractRoles(statement),
    using: extractClause(statement, /\busing\b/i),
    with_check: extractClause(statement, /\bwith\s+check\b/i),
  };
}

function parseDropPolicy(statement) {
  const match = statement.match(/^drop\s+policy\s+(?:if\s+exists\s+)?((?:"(?:[^"]|"")+"|\S+))\s+on\s+(.+)$/i);
  if (!match) return null;
  return {
    name: stripIdentifierQuotes(match[1]).toLowerCase(),
    table: normalizeTableName(match[2]),
  };
}

export function scanRlsMigrations({ root = process.cwd(), migrationsDir = DEFAULT_MIGRATIONS_DIR } = {}) {
  const absDir = path.join(root, migrationsDir);
  const files = fs.existsSync(absDir)
    ? fs.readdirSync(absDir).filter((name) => name.endsWith(".sql")).sort()
    : [];
  const tables = new Map();

  for (const fileName of files) {
    const file = path.join(absDir, fileName);
    const sql = fs.readFileSync(file, "utf8");
    for (const statementInfo of splitSqlStatements(sql)) {
      const statement = compactSql(statementInfo.text);
      const source = { file: rel(root, file), line: lineForOffset(sql, statementInfo.offset + executableOffset(statementInfo.text)) };
      if (!statement) continue;

      const createTable = statement.match(/^create\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?(.+?)(?=\s*\()/i);
      if (createTable) {
        const table = ensureTable(tables, normalizeTableName(createTable[1]), source);
        table.created_in_migrations = true;
        continue;
      }

      const dropTable = statement.match(/^drop\s+table\s+(?:if\s+exists\s+)?(.+?)(?:\s+cascade|\s+restrict)?$/i);
      if (dropTable) {
        tables.delete(normalizeTableName(dropTable[1]));
        continue;
      }

      const enableRls = statement.match(/^alter\s+table\s+(.+?)\s+enable\s+row\s+level\s+security$/i);
      if (enableRls) {
        ensureTable(tables, normalizeTableName(enableRls[1]), source).rls_enabled = true;
        continue;
      }

      const disableRls = statement.match(/^alter\s+table\s+(.+?)\s+disable\s+row\s+level\s+security$/i);
      if (disableRls) {
        ensureTable(tables, normalizeTableName(disableRls[1]), source).rls_enabled = false;
        continue;
      }

      if (/^drop\s+policy\s+/i.test(statement)) {
        const dropped = parseDropPolicy(statement);
        if (!dropped) continue;
        ensureTable(tables, dropped.table, source).policies.delete(dropped.name);
        continue;
      }

      if (/^create\s+policy\s+/i.test(statement)) {
        const policy = parseCreatePolicy(statement);
        if (!policy) continue;
        const table = ensureTable(tables, policy.table, source);
        table.policies.set(policy.name.toLowerCase(), { ...policy, source });
      }
    }
  }

  const orderedTables = [...tables.values()]
    .sort((a, b) => a.table.localeCompare(b.table))
    .map((table) => ({
      table: table.table,
      created_in_migrations: table.created_in_migrations,
      rls_enabled: table.rls_enabled,
      sources: table.sources
        .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
        .filter((source, index, arr) => index === 0 || source.file !== arr[index - 1].file || source.line !== arr[index - 1].line),
      policies: [...table.policies.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((policy) => ({
          name: policy.name,
          command: policy.command,
          roles: policy.roles,
          using: policy.using,
          with_check: policy.with_check,
          source: policy.source,
        })),
    }));

  return {
    migrations_dir: migrationsDir,
    migration_files: files.length,
    tables: orderedTables,
  };
}

export function buildRlsIntent(scan) {
  return {
    schema_version: 1,
    generated_by: "scripts/security/rls-matrix-scan.mjs",
    scan_roots: [scan.migrations_dir],
    migration_files: scan.migration_files,
    tables: Object.fromEntries(scan.tables.map((table) => [
      table.table,
      {
        created_in_migrations: table.created_in_migrations,
        rls_enabled: table.rls_enabled,
        policies: table.policies.map((policy) => ({
          name: policy.name,
          command: policy.command,
          roles: policy.roles,
          using: policy.using,
          with_check: policy.with_check,
        })),
      },
    ])),
  };
}

function semanticTable(table) {
  return {
    created_in_migrations: Boolean(table.created_in_migrations),
    rls_enabled: Boolean(table.rls_enabled),
    policies: (table.policies || []).map((policy) => ({
      name: policy.name,
      command: policy.command,
      roles: [...(policy.roles || [])].sort(),
      using: policy.using ?? null,
      with_check: policy.with_check ?? null,
    })).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function stableJson(value) {
  return JSON.stringify(value);
}

export function compareRlsIntent(scan, intent) {
  const current = buildRlsIntent(scan);
  const findings = [];
  const tableNames = new Set([...Object.keys(current.tables), ...Object.keys(intent.tables || {})]);

  for (const tableName of [...tableNames].sort()) {
    const currentTable = current.tables[tableName];
    const intendedTable = intent.tables?.[tableName];
    const scanTable = scan.tables.find((table) => table.table === tableName);
    const hit = scanTable?.sources?.[0] || { file: DEFAULT_INTENT_PATH, line: 1 };

    if (!intendedTable && currentTable) {
      findings.push({
        type: currentTable.rls_enabled ? "new_table_without_manifest" : "new_table_without_rls",
        table: tableName,
        file: hit.file,
        line: hit.line,
        detail: currentTable.rls_enabled
          ? "table exists in migrations but not in security/rls-intent.json"
          : "table exists in migrations without RLS and without an intent entry",
      });
      continue;
    }
    if (intendedTable && !currentTable) {
      findings.push({
        type: "manifest_table_missing",
        table: tableName,
        file: DEFAULT_INTENT_PATH,
        line: 1,
        detail: "table is present in security/rls-intent.json but not in parsed migrations",
      });
      continue;
    }
    if (stableJson(semanticTable(currentTable)) !== stableJson(semanticTable(intendedTable))) {
      findings.push({
        type: "table_policy_or_rls_drift",
        table: tableName,
        file: hit.file,
        line: hit.line,
        detail: "parsed RLS/policy state differs from security/rls-intent.json",
      });
    }
  }

  return findings;
}

export function buildRlsMatrixReport(scan, intent, drift = []) {
  const noRls = scan.tables.filter((table) => !table.rls_enabled);
  const policyCount = scan.tables.reduce((sum, table) => sum + table.policies.length, 0);
  const lines = [];
  lines.push("# RLS Matrix");
  lines.push("");
  lines.push("Static scan only. Source: `supabase/migrations/*.sql`; no live database probing.");
  lines.push("");
  lines.push("## Summary");
  lines.push(`- migration_files: ${scan.migration_files}`);
  lines.push(`- tables_observed: ${scan.tables.length}`);
  lines.push(`- rls_enabled: ${scan.tables.length - noRls.length}`);
  lines.push(`- rls_not_enabled: ${noRls.length}`);
  lines.push(`- policies_observed: ${policyCount}`);
  lines.push(`- manifest_tables: ${Object.keys(intent.tables || {}).length}`);
  lines.push(`- manifest_drift_findings: ${drift.length}`);
  lines.push("");
  lines.push("## Tables");
  lines.push("");
  lines.push("| Table | Created In Migrations | RLS Enabled | Policies | Source |");
  lines.push("|---|---:|---:|---:|---|");
  for (const table of scan.tables) {
    const source = table.sources[0] ? `${table.sources[0].file}:${table.sources[0].line}` : "";
    lines.push(`| \`${table.table}\` | ${table.created_in_migrations ? "yes" : "no"} | ${table.rls_enabled ? "yes" : "no"} | ${table.policies.length} | \`${source}\` |`);
  }
  lines.push("");
  lines.push("## Policies");
  for (const table of scan.tables) {
    lines.push("");
    lines.push(`### ${table.table}`);
    lines.push(`- RLS enabled: ${table.rls_enabled ? "yes" : "no"}`);
    if (!table.policies.length) {
      lines.push("- Policies: none observed in migrations");
      continue;
    }
    lines.push("");
    lines.push("| Policy | Command | Roles | USING | WITH CHECK | Source |");
    lines.push("|---|---|---|---|---|---|");
    for (const policy of table.policies) {
      const using = policy.using ? `\`${policy.using.replaceAll("|", "\\|")}\`` : "";
      const withCheck = policy.with_check ? `\`${policy.with_check.replaceAll("|", "\\|")}\`` : "";
      lines.push(`| \`${policy.name}\` | ${policy.command} | ${policy.roles.join(", ")} | ${using} | ${withCheck} | \`${policy.source.file}:${policy.source.line}\` |`);
    }
  }
  if (drift.length) {
    lines.push("");
    lines.push("## Manifest Drift");
    for (const item of drift) {
      lines.push(`- ${item.type}: \`${item.table}\` at \`${item.file}:${item.line}\` — ${item.detail}`);
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function writeGenerated(root) {
  const scan = scanRlsMigrations({ root });
  const intent = buildRlsIntent(scan);
  const drift = compareRlsIntent(scan, intent);
  const intentPath = path.join(root, DEFAULT_INTENT_PATH);
  const reportPath = path.join(root, DEFAULT_REPORT_PATH);
  fs.mkdirSync(path.dirname(intentPath), { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(intentPath, `${JSON.stringify(intent, null, 2)}\n`);
  fs.writeFileSync(reportPath, buildRlsMatrixReport(scan, intent, drift));
  console.log(JSON.stringify({
    intent_path: DEFAULT_INTENT_PATH,
    report_path: DEFAULT_REPORT_PATH,
    migration_files: scan.migration_files,
    tables: scan.tables.length,
    rls_enabled: scan.tables.filter((table) => table.rls_enabled).length,
    policies: scan.tables.reduce((sum, table) => sum + table.policies.length, 0),
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--write")) writeGenerated(process.cwd());
  else {
    const scan = scanRlsMigrations();
    const intent = buildRlsIntent(scan);
    process.stdout.write(`${JSON.stringify(intent, null, 2)}\n`);
  }
}
