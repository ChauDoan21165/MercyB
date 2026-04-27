import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import {
  decideIncidentTransition,
  pickWorstStatus,
} from "@/lib/admin/incidentLog";
import { getSloById } from "@/config/slos";
import type { BudgetResult } from "@/lib/admin/errorBudget";

const slo = getSloById("ai_chat_p99")!;

const fakeOpenIncident = {
  id: 1,
  slo_id: slo.id,
  started_at: new Date("2026-04-27T08:00:00Z").toISOString(),
  resolved_at: null,
  peak_burn_rate: 5,
  peak_status: "critical",
};

describe("decideIncidentTransition", () => {
  it("opens an incident when SLO is critical and none is open", () => {
    const t = decideIncidentTransition(
      { status: "critical", burnRate: 10, openIncident: null, healthyForHours: 0 },
      slo,
    );
    expect(t.kind).toBe("open");
  });

  it("does not double-open when an incident is already open", () => {
    const t = decideIncidentTransition(
      {
        status: "critical",
        burnRate: 5,
        openIncident: fakeOpenIncident,
        healthyForHours: 0,
      },
      slo,
    );
    expect(t.kind).toBe("noop");
  });

  it("updates peak burn when a higher burn comes in", () => {
    const t = decideIncidentTransition(
      {
        status: "critical",
        burnRate: 8,
        openIncident: fakeOpenIncident,
        healthyForHours: 0,
      },
      slo,
    );
    expect(t.kind).toBe("update");
    if (t.kind === "update") expect(t.peak_burn_rate).toBe(8);
  });

  it("noops on warning even with an open incident (only critical+ matters)", () => {
    const t = decideIncidentTransition(
      {
        status: "warning",
        burnRate: 1,
        openIncident: fakeOpenIncident,
        healthyForHours: 0,
      },
      slo,
    );
    expect(t.kind).toBe("noop");
  });

  it("noops when healthy but cool-down period has not elapsed", () => {
    const t = decideIncidentTransition(
      {
        status: "healthy",
        burnRate: 0,
        openIncident: fakeOpenIncident,
        healthyForHours: 1,
      },
      slo,
    );
    expect(t.kind).toBe("noop");
  });

  it("resolves the incident after 4 healthy hours", () => {
    const t = decideIncidentTransition(
      {
        status: "healthy",
        burnRate: 0,
        openIncident: fakeOpenIncident,
        healthyForHours: 5,
      },
      slo,
    );
    expect(t.kind).toBe("resolve");
  });

  it("noops when healthy with no open incident", () => {
    const t = decideIncidentTransition(
      {
        status: "healthy",
        burnRate: 0,
        openIncident: null,
        healthyForHours: 24,
      },
      slo,
    );
    expect(t.kind).toBe("noop");
  });
});

describe("pickWorstStatus", () => {
  function row(status: BudgetResult["status"]): BudgetResult {
    return {
      slo_id: "x",
      total_count: 0,
      good_count: 0,
      bad_count: 0,
      actual_percent: 0,
      target_percent: 99,
      budget_remaining_percent: 100,
      burn_rate_per_hour: 0,
      projected_exhaustion_at: null,
      status,
    };
  }

  it("returns exhausted when any SLO is exhausted", () => {
    expect(pickWorstStatus([row("healthy"), row("exhausted"), row("warning")])).toBe(
      "exhausted",
    );
  });

  it("returns critical when worst is critical", () => {
    expect(pickWorstStatus([row("warning"), row("critical"), row("healthy")])).toBe(
      "critical",
    );
  });

  it("falls back to no_data when no rows", () => {
    expect(pickWorstStatus([])).toBe("no_data");
  });

  it("returns healthy when all are healthy", () => {
    expect(pickWorstStatus([row("healthy"), row("healthy")])).toBe("healthy");
  });
});
