import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { buildFailureTimeline } from "@/lib/placementForensics/buildFailureTimeline";
import type {
  PlacementFailureTimeline,
  PlacementForensicEvent,
  PlacementRuntimeAlert,
} from "@/types/placementForensics";

type ForensicEventRow = {
  id: string;
  session_id: string;
  correlation_id: string;
  occurred_at: string;
  sequence: number;
  event_type: string;
  severity: string;
  step: string;
  message: string;
  event: PlacementForensicEvent;
};

type AlertRow = {
  id: string;
  session_id: string | null;
  correlation_id: string | null;
  severity: "warn" | "error" | "fatal";
  alert_type: string;
  message: string;
  created_at: string;
};

function cardStyle(tone: "plain" | "warn" | "error" = "plain"): React.CSSProperties {
  const tones = {
    plain: ["rgba(0,0,0,0.08)", "white"],
    warn: ["rgba(217,119,6,0.25)", "rgba(255,251,235,0.9)"],
    error: ["rgba(190,18,60,0.24)", "rgba(255,241,242,0.92)"],
  } as const;
  return {
    border: `1px solid ${tones[tone][0]}`,
    background: tones[tone][1],
    borderRadius: 8,
    padding: 14,
  };
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "n/a";
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? value : new Date(parsed).toLocaleString();
}

export default function PlacementForensicsDashboard() {
  const [events, setEvents] = useState<ForensicEventRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [eventResult, alertResult] = await Promise.all([
          supabase
            .from("placement_v3_forensic_events")
            .select("id, session_id, correlation_id, occurred_at, sequence, event_type, severity, step, message, event")
            .order("occurred_at", { ascending: false })
            .limit(250),
          supabase
            .from("placement_v3_runtime_alerts")
            .select("id, session_id, correlation_id, severity, alert_type, message, created_at")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);
        if (cancelled) return;
        if (eventResult.error) throw eventResult.error;
        if (alertResult.error) throw alertResult.error;
        setEvents((eventResult.data ?? []) as ForensicEventRow[]);
        setAlerts((alertResult.data ?? []) as AlertRow[]);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const timelines = useMemo(() => {
    const groups = new Map<string, PlacementForensicEvent[]>();
    for (const row of events) {
      const event = row.event;
      if (!event) continue;
      const key = `${row.session_id}:${row.correlation_id}`;
      groups.set(key, [...(groups.get(key) ?? []), event]);
    }
    return Array.from(groups.values()).map(buildFailureTimeline);
  }, [events]);

  const stats = useMemo(() => {
    const failed = timelines.filter((timeline) =>
      timeline.steps.some((step) => step.severity === "error" || step.severity === "fatal")
    ).length;
    const degraded = timelines.filter((timeline) => timeline.degraded).length;
    const retries = timelines.reduce((sum, timeline) => sum + timeline.retries.length, 0);
    const providerSwitches = timelines.reduce(
      (sum, timeline) => sum + timeline.providerSwitches.length,
      0,
    );
    const latencySpikes = events.filter(
      (row) => row.event_type === "latency_event" && row.event?.type === "latency_event" &&
        row.event.exceededBudget,
    ).length;
    const deadEnds = timelines.reduce(
      (sum, timeline) => sum + timeline.orchestrationDeadEnds.length,
      0,
    );
    const taxonomyAnomalies = events.filter(
      (row) => row.event_type === "taxonomy_trigger" && row.severity !== "info",
    ).length;
    const unrecoverable = timelines.filter(
      (timeline) => timeline.recoverability === "unrecoverable",
    ).length;
    return {
      failed,
      degraded,
      retries,
      providerSwitches,
      latencySpikes,
      deadEnds,
      taxonomyAnomalies,
      unrecoverable,
    };
  }, [events, timelines]);

  return (
    <div style={{ display: "grid", gap: 18 }} data-testid="placement-forensics-dashboard">
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>Placement V3 Forensics</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.72 }}>
          Runtime evidence for failed, degraded, retried, and recovered placement sessions.
        </p>
      </div>

      {loading ? <div style={cardStyle()}>Loading forensic events...</div> : null}
      {error ? <div style={cardStyle("error")}>Failed to load forensics: {error}</div> : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
        }}
      >
        {[
          ["Failed sessions", stats.failed],
          ["Degraded sessions", stats.degraded],
          ["Retries", stats.retries],
          ["Provider switches", stats.providerSwitches],
          ["Latency spikes", stats.latencySpikes],
          ["Orchestration dead ends", stats.deadEnds],
          ["Taxonomy anomalies", stats.taxonomyAnomalies],
          ["Unrecoverable failures", stats.unrecoverable],
        ].map(([label, value]) => (
          <div key={label} style={cardStyle(value ? "warn" : "plain")}>
            <div style={{ fontSize: 12, opacity: 0.68, fontWeight: 800 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
          </div>
        ))}
      </section>

      <section style={cardStyle(alerts.length ? "warn" : "plain")}>
        <h3 style={{ marginTop: 0 }}>Runtime Alerts</h3>
        {alerts.length === 0 ? (
          <p>No runtime alerts found.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 8 }}>
                <strong>{alert.severity.toUpperCase()} · {alert.alert_type}</strong>
                <div>{alert.message}</div>
                <small>
                  {formatDate(alert.created_at)} · {alert.session_id ?? "no session"}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>Failure Timelines</h3>
        {timelines.length === 0 ? (
          <p>No persisted Placement V3 forensic events found.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {timelines.map((timeline: PlacementFailureTimeline) => (
              <article
                key={`${timeline.sessionId}:${timeline.correlationId}`}
                style={cardStyle(timeline.recoverability === "unrecoverable" ? "error" : timeline.degraded ? "warn" : "plain")}
              >
                <h4 style={{ margin: "0 0 8px" }}>{timeline.sessionId}</h4>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
                  <span>events: {timeline.eventCount}</span>
                  <span>recoverability: {timeline.recoverability}</span>
                  <span>degraded: {timeline.degraded ? "yes" : "no"}</span>
                  <span>provider switches: {timeline.providerSwitches.length}</span>
                  <span>retries: {timeline.retries.length}</span>
                  <span>missing sequences: {timeline.missingSequences.length}</span>
                </div>
                <ol style={{ marginBottom: 0 }}>
                  {timeline.steps.slice(0, 8).map((step) => (
                    <li key={`${timeline.correlationId}-${step.sequence}`}>
                      <strong>{step.sequence}. {step.step}</strong> · {step.type} · {step.message}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
