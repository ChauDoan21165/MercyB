// src/components/analytics/L1RuleEffectivenessTable.tsx
//
// Sortable table of L1 rule firings + their improvement rates. The
// "needs attention" callout sits above the table and highlights rules
// that fire often but don't help — a signal Chau should rewrite the
// feedback string or narrow the trigger.
//
// Sorting is local-state only (no URL params): the surface is small.

import React, { useEffect, useMemo, useState } from "react";

import {
  getL1RuleEffectiveness,
  getRulesNeedingAttention,
  NEEDS_ATTENTION_MIN_SAMPLE,
  NEEDS_ATTENTION_RATE_THRESHOLD,
  type L1RuleEffectivenessRow,
} from "@/lib/analytics/ruleEffectiveness";

type SortKey =
  | "rule_tag"
  | "total_attempts"
  | "improvements"
  | "improvement_rate"
  | "sample_size";

type SortDir = "asc" | "desc";

export function L1RuleEffectivenessTable() {
  const [rows, setRows] = useState<L1RuleEffectivenessRow[] | null>(null);
  const [needsAttention, setNeedsAttention] = useState<L1RuleEffectivenessRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("improvement_rate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [allRes, attentionRes] = await Promise.all([
        getL1RuleEffectiveness(),
        getRulesNeedingAttention(),
      ]);
      if (cancelled) return;
      if (!allRes.ok) {
        setError(allRes.error);
        setRows([]);
        return;
      }
      setError(null);
      setRows(allRes.data);
      setNeedsAttention(attentionRes.ok ? attentionRes.data : []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    if (!rows) return [];
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const dir = sortDir === "asc" ? 1 : -1;
      if (av === bv) return 0;
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir(k === "rule_tag" ? "asc" : "desc");
    }
  }

  if (rows === null && !error) {
    return <p className="text-sm text-slate-500">Loading rule effectiveness…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-700 dark:text-red-300" role="alert">
        {error}
      </p>
    );
  }
  if (rows && rows.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No rule effectiveness data yet — needs at least one speech_attempts row with an error_code.
      </p>
    );
  }

  return (
    <section
      aria-label="L1 rule effectiveness"
      className="space-y-4"
      data-testid="rule-effectiveness-table"
    >
      {needsAttention.length > 0 && (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
          role="status"
        >
          <div className="font-semibold mb-1">
            {needsAttention.length} rule{needsAttention.length === 1 ? "" : "s"} need attention
          </div>
          <p className="text-xs">
            Rules with at least {NEEDS_ATTENTION_MIN_SAMPLE} distinct users and an
            improvement rate below {(NEEDS_ATTENTION_RATE_THRESHOLD * 100).toFixed(0)}%.
            Consider revising the feedback string or narrowing the trigger.
          </p>
          <ul className="mt-2 text-xs font-mono space-y-0.5">
            {needsAttention.slice(0, 5).map((r) => (
              <li key={r.rule_tag}>
                {r.rule_tag} — {(r.improvement_rate * 100).toFixed(1)}% over {r.total_attempts} attempts
              </li>
            ))}
            {needsAttention.length > 5 && (
              <li className="text-amber-800/70">…and {needsAttention.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-black/10 bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <Th k="rule_tag"          label="Rule"        sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
              <Th k="total_attempts"    label="Attempts"    sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} numeric />
              <Th k="improvements"      label="Improved"    sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} numeric />
              <Th k="improvement_rate"  label="Rate"        sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} numeric />
              <Th k="sample_size"       label="Users"       sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} numeric />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.rule_tag}
                className="border-t border-black/5"
                data-testid="rule-effectiveness-row"
                data-rule-tag={r.rule_tag}
              >
                <td className="px-3 py-2 font-mono text-xs">{r.rule_tag}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.total_attempts}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.improvements}</td>
                <td
                  className={`px-3 py-2 text-right tabular-nums font-semibold ${rateClass(r.improvement_rate)}`}
                >
                  {(r.improvement_rate * 100).toFixed(1)}%
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{r.sample_size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function rateClass(rate: number): string {
  if (rate >= 0.6) return "text-emerald-700";
  if (rate >= 0.3) return "text-slate-700";
  return "text-red-700";
}

function Th({
  k,
  label,
  sortKey,
  sortDir,
  onClick,
  numeric,
}: {
  k: SortKey;
  label: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onClick: (k: SortKey) => void;
  numeric?: boolean;
}) {
  const active = sortKey === k;
  return (
    <th
      scope="col"
      className={`px-3 py-2 cursor-pointer select-none ${
        numeric ? "text-right" : "text-left"
      } ${active ? "underline" : ""}`}
      onClick={() => onClick(k)}
    >
      {label}
      {active ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}

export default L1RuleEffectivenessTable;
