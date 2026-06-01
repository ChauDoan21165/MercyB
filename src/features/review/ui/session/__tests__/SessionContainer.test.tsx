import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { SessionContainer } from "../SessionContainer";
import type { SessionDeps } from "@/features/review/session";
import {
  FakeScheduler,
  FakeStore,
  FakeContent,
  makeItem,
} from "@/features/review/session/__tests__/fakes";

// Fixed clock for deterministic tests.
const NOW = 1_700_000_000_000;

function makeDeps(items = [makeItem("vi-en", "a"), makeItem("vi-en", "b")]): {
  deps: SessionDeps;
  store: FakeStore;
} {
  const store = new FakeStore();
  const deps: SessionDeps = {
    scheduler: new FakeScheduler(),
    store,
    content: new FakeContent({ "vi-en": items }),
  };
  return { deps, store };
}

describe("SessionContainer", () => {
  it("builds a queue and shows the first card's front", async () => {
    const { deps } = makeDeps();
    render(<SessionContainer deps={deps} flow="vi-en" nowMs={NOW} />);

    await waitFor(() =>
      expect(screen.getByTestId("session-view")).toBeInTheDocument(),
    );
    // first new item front text
    expect(screen.getByTestId("card-front-text")).toHaveTextContent("front-a");
    // progress 0 / 2
    expect(screen.getByTestId("session-progress")).toHaveTextContent("0 / 2");
  });

  it("reveals the back, then advances on grade through the whole queue to completion", async () => {
    const { deps, store } = makeDeps();
    render(<SessionContainer deps={deps} flow="vi-en" nowMs={NOW} />);

    await waitFor(() =>
      expect(screen.getByTestId("card-front-text")).toHaveTextContent("front-a"),
    );

    // Card 1: reveal → grade "good".
    fireEvent.click(screen.getByRole("button", { name: "Hiện đáp án" }));
    expect(screen.getByTestId("card-back-text")).toHaveTextContent("back-a");
    fireEvent.click(
      screen.getByTestId("grade-buttons").querySelector('[data-grade="good"]')!,
    );

    // Advances to card 2 (front again).
    await waitFor(() =>
      expect(screen.getByTestId("card-front-text")).toHaveTextContent("front-b"),
    );
    expect(screen.getByTestId("session-progress")).toHaveTextContent("1 / 2");

    // Card 2: reveal → grade "easy".
    fireEvent.click(screen.getByRole("button", { name: "Hiện đáp án" }));
    fireEvent.click(
      screen.getByTestId("grade-buttons").querySelector('[data-grade="easy"]')!,
    );

    // Completion celebration.
    await waitFor(() =>
      expect(screen.getByTestId("session-complete")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("session-complete-count")).toHaveTextContent(
      "Đã ôn 2 thẻ",
    );

    // Both cards persisted to the store.
    const cards = await store.getCards("vi-en");
    expect(cards).toHaveLength(2);
    // 2 reviews + 2 new introduced logged in the daily count.
    const daily = await store.getDailyCount(
      "vi-en",
      // dayKey derived from NOW
      (await import("@/features/review/session")).dayKey(NOW),
    );
    expect(daily.reviews).toBe(2);
    expect(daily.newCards).toBe(2);
  });

  it("shows completion immediately for an empty flow (fail soft)", async () => {
    const store = new FakeStore();
    const deps: SessionDeps = {
      scheduler: new FakeScheduler(),
      store,
      content: new FakeContent({}), // no items for vi-en
    };
    render(<SessionContainer deps={deps} flow="vi-en" nowMs={NOW} />);

    await waitFor(() =>
      expect(screen.getByTestId("session-complete")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("session-complete-count")).toHaveTextContent(
      "Đã ôn 0 thẻ",
    );
    expect(screen.getByTestId("session-complete-next")).toHaveTextContent(
      "Hôm nay không còn thẻ nào",
    );
  });

  it("labels grade buttons with the scheduler's interval previews", async () => {
    const { deps } = makeDeps([makeItem("vi-en", "a")]);
    render(<SessionContainer deps={deps} flow="vi-en" nowMs={NOW} />);

    await waitFor(() =>
      expect(screen.getByTestId("card-front-text")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Hiện đáp án" }));

    // FakeScheduler intervals: good=4, easy=10.
    expect(screen.getByText("4 ngày")).toBeInTheDocument();
    expect(screen.getByText("10 ngày")).toBeInTheDocument();
    // again=0 → "Hôm nay"
    const againBtn = screen
      .getByTestId("grade-buttons")
      .querySelector('[data-grade="again"]')!;
    expect(againBtn).toHaveTextContent("Hôm nay");
  });
});
