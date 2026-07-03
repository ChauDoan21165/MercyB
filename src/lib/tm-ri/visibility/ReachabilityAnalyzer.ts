import type { TmRiReachabilityAssessment, TmRiReachabilitySurface } from "../types";
import type { TmRiSourceEvidence } from "./VisibilityAnalyzer";
import { VisibilityAnalyzer } from "./VisibilityAnalyzer";

const testPathPattern = /(^|\/)(?:__tests__|tests?|spec|fixtures?)(\/|$)|\.(?:test|spec)\.[cm]?[tj]sx?$/i;
const typePathPattern = /(^|\/)types?\/|(?:^|\/)[^/]*types?\.[cm]?[tj]s$|\.d\.ts$/i;
const adminPathPattern = /(^|\/)(?:admin|dashboard|ops|moderation)(\/|$)/i;

export class ReachabilityAnalyzer {
  analyze(evidence: TmRiSourceEvidence): TmRiReachabilityAssessment {
    const filePath = evidence.filePath ?? "";
    const source = evidence.source;
    const index = this.findEvidenceIndex(source, evidence.text);
    const context = this.contextFor(source, index);
    const visibility = new VisibilityAnalyzer().analyze(evidence);

    if (testPathPattern.test(filePath) || /\b(?:describe|it|test|expect|vi\.|jest\.|fixture|mock)\b/i.test(context)) {
      return this.assessment("test_fixture", 0.95, "Evidence is reachable only through tests or fixtures.");
    }

    if (visibility.scope === "comment_only") {
      return this.assessment("source_comment", 0.94, "Evidence is inside a source comment.");
    }

    if (typePathPattern.test(filePath) || visibility.scope === "type_only") {
      return this.assessment("type_definition", 0.9, "Evidence is part of type definitions, not runtime rendering.");
    }

    if (adminPathPattern.test(filePath) || visibility.scope === "admin_visible") {
      return this.assessment("admin_panel", 0.86, "Evidence is likely rendered in an admin/operator surface.");
    }

    if (this.hasCrashContext(context)) {
      return this.assessment("crash_screen", 0.84, "Evidence is attached to thrown or surfaced failure text.");
    }

    if (visibility.scope === "learner_visible") {
      return this.assessment("runtime_ui", 0.88, "Evidence is likely rendered in runtime learner UI.");
    }

    return this.assessment("unknown", 0.45, "Source evidence is insufficient to prove a runtime surface.");
  }

  private assessment(surface: TmRiReachabilitySurface, confidence: number, reason: string): TmRiReachabilityAssessment {
    return { surface, confidence, reason };
  }

  private findEvidenceIndex(source: string, text: string): number {
    if (text.length === 0) {
      return -1;
    }
    const exact = source.indexOf(text);
    if (exact >= 0) {
      return exact;
    }
    return source.toLowerCase().indexOf(text.toLowerCase());
  }

  private contextFor(source: string, index: number): string {
    if (index < 0) {
      return source.slice(0, 800);
    }
    return source.slice(Math.max(0, index - 320), Math.min(source.length, index + 320));
  }

  private hasCrashContext(context: string): boolean {
    return /\b(?:throw new Error|Error\(|componentDidCatch|errorBoundary|crash|fatal|setError|toast\.error)\b/i.test(context);
  }
}
