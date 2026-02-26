// FILE: mercyHost.ts
// PATH: src/core/engine/mercyHost.ts
//
// Purpose:
// - Mercy Host "elite, calm" coaching layer.
// - Deterministic copy selection (seeded).
// - Produces short UI-ready messages + next-step intent.

import type { SkillId, MasteryState } from "./mastery";

export type MercyTone = "calm" | "focused" | "strict";

export type MercyIntent =
  | "welcome"
  | "recommend_next"
  | "praise"
  | "course_correct"
  | "gate_blocked"
  | "gate_ready"
  | "recovery";

export interface MercyContext {
  userName?: string | null;
  levelId: number;
  tone: MercyTone;
  seed: string;

  mastery: MasteryState;

  sessionScore0to100?: number;
  avgAccuracy0to1?: number;

  // gate info optional
  gateReady?: boolean;
  gateReasons?: string[];
  missingSkills?: SkillId[];
}

export interface MercyMessage {
  intent: MercyIntent;
  title: string;
  body: string;
  cta: { label: string; action: "start_next" | "review" | "recovery" | "level_up" | "close" };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function stableHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(items: T[], seed: string): T {
  if (items.length === 0) throw new Error("pick: empty");
  const h = stableHash(seed);
  return items[h % items.length];
}

function nameOf(userName?: string | null): string {
  const n = (userName ?? "").trim();
  return n ? n : "friend";
}

function weakestSkill(mastery: MasteryState): SkillId {
  const skills = Object.keys(mastery) as SkillId[];
  let best = skills[0];
  let v = mastery[best].value;
  for (const s of skills) {
    if (mastery[s].value < v) {
      best = s;
      v = mastery[s].value;
    }
  }
  return best;
}

function formatSkill(skill: SkillId): string {
  const map: Record<SkillId, string> = {
    listening: "Listening",
    reading: "Reading",
    speaking: "Speaking",
    writing: "Writing",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
    pronunciation: "Pronunciation",
  };
  return map[skill] ?? skill;
}

export function buildMercyMessage(ctx: MercyContext): MercyMessage {
  const nm = nameOf(ctx.userName);
  const score = typeof ctx.sessionScore0to100 === "number" ? clamp(ctx.sessionScore0to100, 0, 100) : undefined;
  const acc = typeof ctx.avgAccuracy0to1 === "number" ? clamp(ctx.avgAccuracy0to1, 0, 1) : undefined;

  // Gate signals win if present
  if (ctx.gateReady === true) {
    return {
      intent: "gate_ready",
      title: `Level ${ctx.levelId} cleared.`,
      body: `Clean work, ${nm}. You’ve earned the next level. Keep the standard.`,
      cta: { label: "Continue to next level", action: "level_up" },
    };
  }

  if (ctx.gateReady === false) {
    const missing = (ctx.missingSkills ?? []).map(formatSkill);
    const reasons = (ctx.gateReasons ?? []).slice(0, 2);

    const bodyParts: string[] = [];
    if (missing.length) bodyParts.push(`Priority: ${missing.join(", ")}.`);
    if (reasons.length) bodyParts.push(reasons.join(" "));
    if (bodyParts.length === 0) bodyParts.push("A little more consistency, then you pass.");

    return {
      intent: "gate_blocked",
      title: `Hold the line, Level ${ctx.levelId}.`,
      body: bodyParts.join(" "),
      cta: { label: "Train next drill", action: "start_next" },
    };
  }

  // Session feedback
  if (score != null) {
    if (score >= 85) {
      const praise = pick(
        [
          `Strong session, ${nm}. Precision first — that’s the elite habit.`,
          `Excellent control, ${nm}. Keep your pace; don’t chase speed.`,
          `You’re building real skill, ${nm}. Repeat this standard tomorrow.`,
        ],
        `${ctx.seed}:praise:${ctx.levelId}`
      );

      return {
        intent: "praise",
        title: "Good. Keep going.",
        body: praise,
        cta: { label: "Next drill", action: "start_next" },
      };
    }

    if (score < 55) {
      const weak = weakestSkill(ctx.mastery);
      const corrective = pick(
        [
          `${nm}, slow down. One clean repetition beats ten rushed ones.`,
          `Reset, ${nm}. Control your breath, then control the sentence.`,
          `No judgment. Just data, ${nm}. We train the weak link.`,
        ],
        `${ctx.seed}:correct:${ctx.levelId}`
      );

      return {
        intent: "course_correct",
        title: `Focus: ${formatSkill(weak)}`,
        body: `${corrective} Today’s priority: ${formatSkill(weak)}.`,
        cta: { label: "Do a recovery drill", action: "recovery" },
      };
    }
  }

  // Default recommendation nudge
  const weak = weakestSkill(ctx.mastery);
  const recommend = pick(
    [
      `${nm}, stay disciplined. We move step by step.`,
      `Quiet focus, ${nm}. One drill, full attention.`,
      `Train like it matters, ${nm}. Because it does.`,
    ],
    `${ctx.seed}:recommend:${ctx.levelId}`
  );

  const accHint = acc != null ? ` Accuracy: ${Math.round(acc * 100)}%.` : "";
  const scoreHint = score != null ? ` Score: ${score}.` : "";

  return {
    intent: "recommend_next",
    title: `Next: ${formatSkill(weak)}`,
    body: `${recommend}${scoreHint}${accHint}`,
    cta: { label: "Start next drill", action: "start_next" },
  };
}