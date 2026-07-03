import type { TmRiVisibilityAssessment, TmRiVisibilityScope } from "../types";

export interface TmRiSourceEvidence {
  readonly source: string;
  readonly text: string;
  readonly filePath?: string;
}

const testPathPattern = /(^|\/)(?:__tests__|tests?|spec|fixtures?)(\/|$)|\.(?:test|spec)\.[cm]?[tj]sx?$/i;
const typePathPattern = /(^|\/)types?\/|(?:^|\/)[^/]*types?\.[cm]?[tj]s$|\.d\.ts$/i;
const adminPathPattern = /(^|\/)(?:admin|dashboard|ops|moderation)(\/|$)/i;
const learnerPathPattern = /(^|\/)(?:components|pages|app|routes)(\/|$)|\.[tj]sx$/i;

export class VisibilityAnalyzer {
  analyze(evidence: TmRiSourceEvidence): TmRiVisibilityAssessment {
    const filePath = evidence.filePath ?? "";
    const source = evidence.source;
    const index = this.findEvidenceIndex(source, evidence.text);
    const context = this.contextFor(source, index);

    if (testPathPattern.test(filePath) || this.hasNearbyTestApi(context)) {
      return this.assessment("test_only", 0.95, "Evidence is inside a test or fixture source.");
    }

    if (index >= 0 && this.isInsideComment(source, index)) {
      return this.assessment("comment_only", typePathPattern.test(filePath) ? 0.96 : 0.93, "Evidence appears only in source comments.");
    }

    if (typePathPattern.test(filePath) || this.hasNearbyTypeSyntax(context)) {
      return this.assessment("type_only", 0.9, "Evidence is in a type-only contract or declaration context.");
    }

    if (adminPathPattern.test(filePath)) {
      return this.assessment("admin_visible", 0.85, "Evidence is in an admin or operator-facing surface.");
    }

    if (this.hasVisibleUiSink(context)) {
      return this.assessment("learner_visible", 0.9, "Evidence is assigned to rendered UI text.");
    }

    if (learnerPathPattern.test(filePath) && this.hasJsxTextContext(context)) {
      return this.assessment("learner_visible", 0.82, "Evidence appears in a UI component render context.");
    }

    if (this.hasDevOnlyContext(context)) {
      return this.assessment("dev_only", 0.86, "Evidence is used in logging, diagnostics, or implementation-only code.");
    }

    return this.assessment("unreachable_unknown", 0.45, "Source evidence does not prove a rendered learner or admin surface.");
  }

  private assessment(scope: TmRiVisibilityScope, confidence: number, reason: string): TmRiVisibilityAssessment {
    return { scope, confidence, reason };
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

  private isInsideComment(source: string, index: number): boolean {
    const before = source.slice(0, index);
    const lastBlockOpen = before.lastIndexOf("/*");
    const lastBlockClose = before.lastIndexOf("*/");
    if (lastBlockOpen > lastBlockClose) {
      return true;
    }

    const lineStart = before.lastIndexOf("\n") + 1;
    const linePrefix = before.slice(lineStart);
    return linePrefix.includes("//");
  }

  private hasNearbyTestApi(context: string): boolean {
    return /\b(?:describe|it|test|expect|vi\.|jest\.|fixture|mock)\b/i.test(context);
  }

  private hasNearbyTypeSyntax(context: string): boolean {
    return /\b(?:export\s+type|type\s+\w+|interface\s+\w+|readonly\s+\w+|Record<|Partial<|import\s+type)\b/.test(context);
  }

  private hasVisibleUiSink(context: string): boolean {
    return /\b(?:textContent|innerText|innerHTML|aria-label|title|placeholder)\b\s*[=:]|(?:toast|alert|setError|setMessage)\s*\(/i.test(context);
  }

  private hasJsxTextContext(context: string): boolean {
    return /<[A-Za-z][^>]*>[\s\S]*["'`][^"'`]+["'`][\s\S]*<\/[A-Za-z]/.test(context) || /\{["'`][^"'`]+["'`]\}/.test(context);
  }

  private hasDevOnlyContext(context: string): boolean {
    return /\b(?:console\.(?:debug|log|warn|error)|logger\.|Sentry\.|debugger|throw new Error|Error\()\b/i.test(context);
  }
}
