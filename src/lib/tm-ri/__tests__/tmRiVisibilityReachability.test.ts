import { describe, expect, it } from "vitest";
import {
  ProductTrustAnalyzer,
  ReachabilityAnalyzer,
  RuntimeReplayEngine,
  VisibilityAnalyzer,
  type TmRiFinding,
} from "../index";
import {
  expectLinhLikeCriticalAudioFailureReplay,
  expectMixedPlacementAudioFailureReplay,
  expectSpeakingTextFallbackReplay,
  runLinhLikeAudioFailureReplay,
  runMixedPlacementAudioFailureReplay,
  runSpeakingTextFallbackReplay,
} from "./replaySample";

const visibility = new VisibilityAnalyzer();
const reachability = new ReachabilityAnalyzer();

describe("TM-RI visibility and reachability analysis", () => {
  it("classifies placement-v3 audit/debugging comments as non-learner evidence", () => {
    const source = `
export interface PlacementV3ResponseRow {
  /** Prompt text shown to the learner for audit/debugging. */
  prompt_text: string;
}
`;

    const visible = visibility.analyze({
      source,
      text: "audit/debugging",
      filePath: "src/types/placement-v3.ts",
    });
    const reachable = reachability.analyze({
      source,
      text: "audit/debugging",
      filePath: "src/types/placement-v3.ts",
    });

    expect(["comment_only", "type_only"]).toContain(visible.scope);
    expect(["source_comment", "type_definition"]).toContain(reachable.surface);

    const trust = new ProductTrustAnalyzer().analyze(
      [trustFinding("audit/debugging", visible, reachable)],
      { stages: [] },
    );
    expect(trust.points[0]?.score).toBe(100);
    expect(trust.collapsePoint).toBeUndefined();
  });

  it("classifies test stub/debug wording as test-only and not learner trust failure", () => {
    const source = `
import { describe, expect, it, vi } from "vitest";
describe("route", () => {
  it("uses a debug stub", () => {
    vi.stubGlobal("fetch", fetchMock);
    expect("debug stub").toBeTruthy();
  });
});
`;

    const visible = visibility.analyze({
      source,
      text: "debug stub",
      filePath: "src/router/__tests__/placement-v3-route-guard.test.tsx",
    });
    const reachable = reachability.analyze({
      source,
      text: "debug stub",
      filePath: "src/router/__tests__/placement-v3-route-guard.test.tsx",
    });

    expect(visible.scope).toBe("test_only");
    expect(reachable.surface).toBe("test_fixture");

    const trust = new ProductTrustAnalyzer().analyze(
      [trustFinding("debug stub", visible, reachable)],
      { stages: [] },
    );
    expect(trust.points[0]?.score).toBe(100);
  });

  it("treats DOM debug textContent as learner-visible runtime UI risk", () => {
    const source = `
const debug = document.createElement("div");
debug.textContent = "Debug stub: audioUrl missing";
root.appendChild(debug);
`;

    const visible = visibility.analyze({
      source,
      text: "Debug stub: audioUrl missing",
      filePath: "src/pages/placement/v3/TestPage.tsx",
    });
    const reachable = reachability.analyze({
      source,
      text: "Debug stub: audioUrl missing",
      filePath: "src/pages/placement/v3/TestPage.tsx",
    });

    expect(visible.scope).toBe("learner_visible");
    expect(reachable.surface).toBe("runtime_ui");

    const trust = new ProductTrustAnalyzer().analyze(
      [trustFinding("Debug stub: audioUrl missing", visible, reachable)],
      { stages: [] },
    );
    expect(trust.points[0]?.score).toBe(75);
  });

  it("treats orchestrator wording in learner UI as reachable runtime trust risk", () => {
    const source = `
export function PlacementResultNotice() {
  return <p>{"The placement orchestrator could not load your audio score."}</p>;
}
`;

    const visible = visibility.analyze({
      source,
      text: "The placement orchestrator could not load your audio score.",
      filePath: "src/pages/placement/v3/ResultsPage.tsx",
    });
    const reachable = reachability.analyze({
      source,
      text: "The placement orchestrator could not load your audio score.",
      filePath: "src/pages/placement/v3/ResultsPage.tsx",
    });

    expect(visible.scope).toBe("learner_visible");
    expect(reachable.surface).toBe("runtime_ui");

    const trust = new ProductTrustAnalyzer().analyze(
      [trustFinding("The placement orchestrator could not load your audio score.", visible, reachable)],
      { stages: [] },
    );
    expect(trust.points[0]?.score).toBe(75);
  });

  it("separates learner-visible error copy from comment, type, and test-only strings", () => {
    const cases = [
      {
        name: "source comment",
        source: `
export function PlacementResultNotice() {
  // Learner-visible error: audioUrl missing.
  return <p>{"Audio could not be checked. Please try again."}</p>;
}
`,
        text: "Learner-visible error: audioUrl missing.",
        filePath: "src/pages/placement/v3/ResultsPage.tsx",
        expectedScope: "comment_only",
        expectedSurface: "source_comment",
        expectedScore: 100,
      },
      {
        name: "type contract",
        source: `
export type PlacementErrorCopy = {
  readonly learnerVisibleError: "audioUrl missing";
};
`,
        text: "audioUrl missing",
        filePath: "src/types/placement-v3.ts",
        expectedScope: "type_only",
        expectedSurface: "type_definition",
        expectedScore: 100,
      },
      {
        name: "test assertion",
        source: `
import { expect, it } from "vitest";
it("keeps audio errors visible", () => {
  expect("audioUrl missing").toBeTruthy();
});
`,
        text: "audioUrl missing",
        filePath: "src/pages/placement/v3/__tests__/ResultsPage.test.tsx",
        expectedScope: "test_only",
        expectedSurface: "test_fixture",
        expectedScore: 100,
      },
      {
        name: "runtime learner UI",
        source: `
export function PlacementResultNotice() {
  return <p>{"Audio could not be checked. Please try again."}</p>;
}
`,
        text: "Audio could not be checked. Please try again.",
        filePath: "src/pages/placement/v3/ResultsPage.tsx",
        expectedScope: "learner_visible",
        expectedSurface: "runtime_ui",
        expectedScore: 75,
      },
    ] as const;

    for (const example of cases) {
      const visible = visibility.analyze(example);
      const reachable = reachability.analyze(example);
      const trust = new ProductTrustAnalyzer().analyze(
        [trustFinding(example.text, visible, reachable)],
        { stages: [] },
      );

      expect(visible.scope, example.name).toBe(example.expectedScope);
      expect(reachable.surface, example.name).toBe(example.expectedSurface);
      expect(trust.points[0]?.score, example.name).toBe(example.expectedScore);
    }
  });

  it("does not penalize product trust for trust findings without visibility evidence", () => {
    const trust = new ProductTrustAnalyzer().analyze(
      [
        {
          code: "product_trust_risk",
          severity: "medium",
          educationalSeverity: "moderate",
          title: "Product trust risk detected",
          evidence: ["test-only source string"],
          impact: "Trust in the result may be lower even if scoring logic completes.",
          confidence: 0.85,
        },
      ],
      { stages: [] },
    );

    expect(trust.points[0]?.score).toBe(100);
  });

  it("classifies ListeningTaskCard unavailable audio copy as learner-visible runtime UI", () => {
    const source = `
export function ListeningTaskCard() {
  return (
    <p>
      {mediaStatus === "unavailable"
        ? "Audio is unavailable for this question. This listening item cannot be submitted yet."
        : "Audio loaded."}
    </p>
  );
}
`;

    const visible = visibility.analyze({
      source,
      text: "Audio is unavailable for this question. This listening item cannot be submitted yet.",
      filePath: "src/components/placement/v3/ListeningTaskCard.tsx",
    });
    const reachable = reachability.analyze({
      source,
      text: "Audio is unavailable for this question. This listening item cannot be submitted yet.",
      filePath: "src/components/placement/v3/ListeningTaskCard.tsx",
    });

    expect(visible.scope).toBe("learner_visible");
    expect(reachable.surface).toBe("runtime_ui");
  });

  it("does not convert internal event details into learner-facing trust findings", () => {
    const analysis = new RuntimeReplayEngine().analyze(
      [
        {
          id: "internal-only",
          type: "internal_text_visible",
          timestampMs: 100,
          internalText: "React MediaRecorder debug factory audioUrl HTMLAudioElement",
        },
      ],
      [],
    );

    expect(analysis.runtimeFindings.map((finding) => finding.code)).not.toContain("product_trust_risk");
    expect(analysis.trust.points[0]?.score).toBe(100);
  });

  it("keeps observation packets educational and strips implementation details", () => {
    const analysis = new RuntimeReplayEngine().analyze(
      [
        {
          id: "debug-copy",
          type: "internal_text_visible",
          timestampMs: 100,
          userFacingText: "React MediaRecorder debug factory audioUrl HTMLAudioElement",
        },
      ],
      [],
    );

    const packetText = JSON.stringify(analysis.observationPacket).toLowerCase();
    expect(analysis.runtimeFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "internal_text_visible",
          visibility: expect.objectContaining({ scope: "learner_visible" }),
          reachability: expect.objectContaining({ surface: "runtime_ui" }),
        }),
        expect.objectContaining({
          code: "product_trust_risk",
          visibility: expect.objectContaining({ scope: "learner_visible" }),
          reachability: expect.objectContaining({ surface: "runtime_ui" }),
        }),
      ]),
    );
    expect(packetText).not.toContain("react");
    expect(packetText).not.toContain("audiourl");
    expect(packetText).not.toContain("mediarecorder");
    expect(packetText).not.toContain("htmlaudioelement");
    expect(packetText).not.toContain("factory");
  });

  it("still produces a critical educational finding when Linh guessed after audio failure", () => {
    const analysis = runLinhLikeAudioFailureReplay();

    expect(analysis.observationPacket.findings.some((finding) => finding.educationalSeverity === "critical")).toBe(true);
    expect(analysis.trust.collapsePoint).toBeDefined();
    expectLinhLikeCriticalAudioFailureReplay(analysis);
  });

  it("replays speaking text fallback as reachable degraded evidence", () => {
    const analysis = runSpeakingTextFallbackReplay();

    expect(analysis.repairPlan.items.map((item) => item.title)).toContain(
      "Separate typed fallback from spoken evidence",
    );
    expect(analysis.knowledgeGraph.nodes.map((node) => node.id)).toContain("pedagogy:speaking_modality_degraded");
    expectSpeakingTextFallbackReplay(analysis);
  });

  it("replays mixed placement audio failure as observation and graph evidence", () => {
    const analysis = runMixedPlacementAudioFailureReplay();

    expect(analysis.observationPacket.recommendations).toEqual(
      expect.arrayContaining(["withhold_cefr", "retry_required"]),
    );
    expect(analysis.knowledgeGraph.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining(["observation:audio_unavailable", "observation:invalid_scoring_risk"]),
    );
    expectMixedPlacementAudioFailureReplay(analysis);
  });
});

const trustFinding = (
  evidence: string,
  visibilityAssessment: TmRiFinding["visibility"],
  reachabilityAssessment: TmRiFinding["reachability"],
): TmRiFinding => ({
  code: "product_trust_risk",
  severity: "medium",
  educationalSeverity: "moderate",
  title: "Product trust risk detected",
  evidence: [evidence],
  impact: "Trust in the result may be lower even if scoring logic completes.",
  confidence: 0.85,
  visibility: visibilityAssessment,
  reachability: reachabilityAssessment,
});
