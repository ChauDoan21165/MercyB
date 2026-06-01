import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { REVIEW_FLOWS } from "@/features/review/flows";
import type { ReviewFlowId } from "@/features/review/types";
import { OverviewView, type DeckSummary } from "../OverviewView";

function allLimits(value = 20): Partial<Record<ReviewFlowId, number>> {
  const m: Partial<Record<ReviewFlowId, number>> = {};
  for (const f of REVIEW_FLOWS) m[f.id] = value;
  return m;
}

describe("OverviewView", () => {
  it("renders one deck card per flow in REVIEW_FLOWS order", () => {
    const decks: Partial<Record<ReviewFlowId, DeckSummary>> = {};
    for (const f of REVIEW_FLOWS) decks[f.id] = { due: 3, newAvailable: 2 };

    render(
      <OverviewView
        decks={decks}
        dailyNewLimits={allLimits()}
        onStartFlow={() => {}}
        onChangeDailyLimit={() => {}}
      />,
    );

    for (const f of REVIEW_FLOWS) {
      const card = screen.getByTestId(`deck-card-${f.id}`);
      expect(within(card).getByText(f.label)).toBeInTheDocument();
      expect(within(card).getByText("3 thẻ đến hạn")).toBeInTheDocument();
      expect(within(card).getByText("2 thẻ mới")).toBeInTheDocument();
    }
    // 7 start buttons, all enabled.
    const startBtns = screen.getAllByRole("button", { name: /Bắt đầu ôn/ });
    expect(startBtns).toHaveLength(REVIEW_FLOWS.length);
  });

  it("fires onStartFlow with the right flow id when a deck's start is tapped", () => {
    const onStartFlow = vi.fn();
    const decks: Partial<Record<ReviewFlowId, DeckSummary>> = {
      "vi-en": { due: 5, newAvailable: 0 },
    };
    render(
      <OverviewView
        decks={decks}
        dailyNewLimits={allLimits()}
        onStartFlow={onStartFlow}
        onChangeDailyLimit={() => {}}
      />,
    );

    const card = screen.getByTestId("deck-card-vi-en");
    fireEvent.click(within(card).getByRole("button", { name: /Bắt đầu ôn/ }));
    expect(onStartFlow).toHaveBeenCalledWith("vi-en");
  });

  it("de-emphasizes an empty deck (0 due + 0 new) and disables its start", () => {
    const decks: Partial<Record<ReviewFlowId, DeckSummary>> = {
      "vi-en": { due: 0, newAvailable: 0 },
    };
    render(
      <OverviewView
        decks={decks}
        dailyNewLimits={allLimits()}
        onStartFlow={() => {}}
        onChangeDailyLimit={() => {}}
      />,
    );

    const card = screen.getByTestId("deck-card-vi-en");
    expect(card).toHaveAttribute("data-empty", "true");
    const btn = within(card).getByRole("button", { name: /chưa có thẻ/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("Chưa có thẻ");
  });

  it("fires onChangeDailyLimit with flow id + value", () => {
    const onChangeDailyLimit = vi.fn();
    const decks: Partial<Record<ReviewFlowId, DeckSummary>> = {};
    for (const f of REVIEW_FLOWS) decks[f.id] = { due: 1, newAvailable: 1 };

    render(
      <OverviewView
        decks={decks}
        dailyNewLimits={allLimits(20)}
        onStartFlow={() => {}}
        onChangeDailyLimit={onChangeDailyLimit}
      />,
    );

    // The first flow's daily-limit input.
    const inputs = screen.getAllByRole("spinbutton", {
      name: "Số thẻ mới mỗi ngày",
    });
    fireEvent.change(inputs[0], { target: { value: "10" } });
    expect(onChangeDailyLimit).toHaveBeenCalledWith(REVIEW_FLOWS[0].id, 10);
  });

  it("shows a loading status when loading", () => {
    render(
      <OverviewView
        decks={{}}
        dailyNewLimits={{}}
        onStartFlow={() => {}}
        onChangeDailyLimit={() => {}}
        loading
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Đang tải");
  });
});
