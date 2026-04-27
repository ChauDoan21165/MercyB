// SLO incident lifecycle.
//
// An "incident" is one continuous window where an SLO sits at
// 'critical' or 'exhausted'. Auto-created by the burn-rate cron when
// it sees the bad state for the first time; auto-resolved after the
// SLO has been 'healthy' continuously for INCIDENT_AUTO_RESOLVE_HOURS.
//
// The "warning" band intentionally does NOT open an incident — too
// noisy. Only critical+ counts.

import { supabase } from "@/lib/supabaseClient";
import {
  INCIDENT_AUTO_RESOLVE_HOURS,
  type SloDefinition,
} from "@/config/slos";
import type { BudgetResult, BudgetStatus } from "@/lib/admin/errorBudget";

export type IncidentTransition =
  | { kind: "noop" }
  | { kind: "open"; slo_id: string }
  | { kind: "update"; slo_id: string; peak_burn_rate: number }
  | { kind: "resolve"; slo_id: string };

export interface IncidentRow {
  id: number;
  slo_id: string;
  started_at: string;
  resolved_at: string | null;
  peak_burn_rate: number | null;
  peak_status: string;
}

/**
 * Decide what should happen to the open incident (if any) for one SLO,
 * given its latest budget reading and the time the SLO has been in
 * 'healthy' state.
 *
 * Pure helper — caller does the DB writes. Splitting it out keeps
 * branching testable.
 *
 * Rules:
 *   1. SLO is critical/exhausted, no open incident → open.
 *   2. SLO is critical/exhausted, open incident → update peak.
 *   3. SLO is healthy, open incident, healthy_for_hours ≥ AUTO_RESOLVE
 *      → resolve.
 *   4. SLO is healthy, open incident, healthy_for_hours < AUTO_RESOLVE
 *      → noop (still cooling down).
 *   5. SLO is warning, open incident → noop (still degraded).
 *   6. SLO is healthy/warning, no open incident → noop.
 */
export interface DecideIncidentInput {
  status: BudgetStatus;
  burnRate: number;
  openIncident: IncidentRow | null;
  healthyForHours: number;
}

export function decideIncidentTransition(
  input: DecideIncidentInput,
  slo: SloDefinition,
): IncidentTransition {
  const isCritical = input.status === "critical" || input.status === "exhausted";

  if (isCritical) {
    if (input.openIncident) {
      const newPeak = Math.max(
        input.openIncident.peak_burn_rate ?? 0,
        input.burnRate,
      );
      if (newPeak !== (input.openIncident.peak_burn_rate ?? 0)) {
        return { kind: "update", slo_id: slo.id, peak_burn_rate: newPeak };
      }
      return { kind: "noop" };
    }
    return { kind: "open", slo_id: slo.id };
  }

  if (input.status === "warning") {
    return { kind: "noop" };
  }

  // healthy or no_data
  if (input.openIncident) {
    if (input.healthyForHours >= INCIDENT_AUTO_RESOLVE_HOURS) {
      return { kind: "resolve", slo_id: slo.id };
    }
    return { kind: "noop" };
  }
  return { kind: "noop" };
}

// ── Async helpers (Supabase) ─────────────────────────────────────────

export async function getOpenIncident(
  sloId: string,
): Promise<IncidentRow | null> {
  const { data, error } = await supabase
    .from("slo_incidents")
    .select("id, slo_id, started_at, resolved_at, peak_burn_rate, peak_status")
    .eq("slo_id", sloId)
    .is("resolved_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as IncidentRow;
}

export async function listRecentIncidents(
  limit = 25,
): Promise<IncidentRow[]> {
  const { data, error } = await supabase
    .from("slo_incidents")
    .select("id, slo_id, started_at, resolved_at, peak_burn_rate, peak_status")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as IncidentRow[];
}

export async function applyIncidentTransition(
  transition: IncidentTransition,
  context: { burnRate: number; status: BudgetStatus },
): Promise<void> {
  switch (transition.kind) {
    case "noop":
      return;
    case "open": {
      await supabase.from("slo_incidents").insert({
        slo_id: transition.slo_id,
        peak_burn_rate: context.burnRate,
        peak_status: context.status,
      });
      return;
    }
    case "update": {
      const open = await getOpenIncident(transition.slo_id);
      if (!open) return;
      await supabase
        .from("slo_incidents")
        .update({ peak_burn_rate: transition.peak_burn_rate })
        .eq("id", open.id);
      return;
    }
    case "resolve": {
      const open = await getOpenIncident(transition.slo_id);
      if (!open) return;
      await supabase
        .from("slo_incidents")
        .update({ resolved_at: new Date().toISOString() })
        .eq("id", open.id);
      return;
    }
  }
}

export interface SloPauseStatus {
  active: boolean;
}

export async function readSloPauseFlag(): Promise<SloPauseStatus> {
  const { data } = await supabase
    .from("feature_flags")
    .select("is_enabled")
    .eq("flag_key", "slo_pause_active")
    .maybeSingle();
  return { active: Boolean((data as { is_enabled?: boolean } | null)?.is_enabled) };
}

export async function setSloPauseFlag(active: boolean): Promise<void> {
  await supabase
    .from("feature_flags")
    .update({ is_enabled: active })
    .eq("flag_key", "slo_pause_active");
}

export function pickWorstStatus(results: BudgetResult[]): BudgetStatus {
  const order: BudgetStatus[] = ["exhausted", "critical", "warning", "healthy", "no_data"];
  for (const status of order) {
    if (results.some((r) => r.status === status)) return status;
  }
  return "no_data";
}
