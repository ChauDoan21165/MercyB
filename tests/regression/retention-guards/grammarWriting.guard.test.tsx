// Retention surface guard — GrammarWritingTab handleAnalyze seam (recordActiveDay).
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GrammarWritingTab } from "@/components/mercy-guide/tabs/grammar-writing/GrammarWritingTab";

const h = vi.hoisted(() => ({ record: vi.fn() }));
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));
vi.mock("@/hooks/useFeatureFlag", () => ({ useFeatureFlag: () => ({ enabled: false, loading: false }) }));
vi.mock("@/components/mercy-guide/tabs/grammar-writing/api", () => ({
  analyzeGrammarWithApi: vi.fn(async () => ({
    correctedText: "Corrected.", enhancedText: "Enhanced.", explanation: "",
    issues: [], logicPatterns: [], bridges: [],
  })),
}));

function renderTab() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <GrammarWritingTab roomId="r1" roomTitle="Test Room" contentEn="Hello world." englishLevel="B1" />
    </QueryClientProvider>,
  );
}

describe("retention guard — GrammarWritingTab handleAnalyze", () => {
  beforeEach(() => { h.record.mockClear(); });

  it("POSITIVE: submitting text for grammar analysis fires recordActiveDay exactly once", async () => {
    renderTab();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "I go to school yesterday." } });
    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));
    await waitFor(() => expect(h.record).toHaveBeenCalledTimes(1));
  });

  it("NEGATIVE: typing without submitting (non-trigger) does NOT fire recordActiveDay", async () => {
    renderTab();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "draft only, not submitted" } });
    await screen.findByRole("button", { name: /analyze/i });
    expect(h.record).not.toHaveBeenCalled();
  });
});
