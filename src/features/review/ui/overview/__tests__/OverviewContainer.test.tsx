import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import type { SessionDeps } from "@/features/review/session";
import { dayKey } from "@/features/review/session";
import {
  FakeContent,
  FakeScheduler,
  FakeStore,
  makeItem,
  storedCard,
  DAY,
} from "@/features/review/session/__tests__/fakes";
import { OverviewContainer } from "../OverviewContainer";

// Fixed clock for deterministic counts.
const NOW = 1_700_000_000_000;

function makeDeps(over: Partial<SessionDeps> = {}): {
  deps: SessionDeps;
  store: FakeStore;
  content: FakeContent;
} {
  const store = new FakeStore();
  const content = new FakeContent();
  const deps: SessionDeps = {
    scheduler: new FakeScheduler(),
    store,
    content,
    ...over,
  };
  return { deps, store, content };
}

describe("OverviewContainer", () => {
  it("computes due + new-available counts per flow from deps", async () => {
    const store = new FakeStore();
    const content = new FakeContent({
      // 3 vi-en items; one already has a stored card → 2 new available.
      "vi-en": [
        makeItem("vi-en", "a"),
        makeItem("vi-en", "b"),
        makeItem("vi-en", "c"),
      ],
    });
    // Stored card for "a": due now (counts as due, not new).
    await store.putCard(storedCard("vi-en", "vi-en:vocab:a", NOW - DAY));

    const deps: SessionDeps = {
      scheduler: new FakeScheduler(),
      store,
      content,
    };

    render(
      <OverviewContainer deps={deps} nowMs={NOW} onStartFlow={() => {}} />,
    );

    await waitFor(() => {
      const card = screen.getByTestId("deck-card-vi-en");
      expect(within(card).getByText("1 thẻ đến hạn")).toBeInTheDocument();
      expect(within(card).getByText("2 thẻ mới")).toBeInTheDocument();
    });

    // A flow with no content is an empty, de-emphasized deck.
    const empty = screen.getByTestId("deck-card-vi-de");
    expect(empty).toHaveAttribute("data-empty", "true");
  });

  it("caps new-available by the remaining daily new budget", async () => {
    const store = new FakeStore();
    const content = new FakeContent({
      "vi-en": Array.from({ length: 10 }, (_, i) => makeItem("vi-en", `n${i}`)),
    });
    // Limit 5, already introduced 3 today → only 2 of the 10 new are available.
    await store.putSettings({
      flow: "vi-en",
      dailyNewLimit: 5,
      dailyReviewLimit: 0,
    });
    store.seedDaily("vi-en", dayKey(NOW), { newCards: 3 });

    const deps: SessionDeps = {
      scheduler: new FakeScheduler(),
      store,
      content,
    };

    render(
      <OverviewContainer deps={deps} nowMs={NOW} onStartFlow={() => {}} />,
    );

    await waitFor(() => {
      const card = screen.getByTestId("deck-card-vi-en");
      expect(within(card).getByText("2 thẻ mới")).toBeInTheDocument();
    });
  });

  it("fires onStartFlow when a non-empty deck's start is tapped", async () => {
    const onStartFlow = vi.fn();
    const { deps } = makeDeps({
      content: new FakeContent({ "vi-en": [makeItem("vi-en", "x")] }),
    });

    render(
      <OverviewContainer deps={deps} nowMs={NOW} onStartFlow={onStartFlow} />,
    );

    await waitFor(() => {
      const card = screen.getByTestId("deck-card-vi-en");
      expect(within(card).getByText("1 thẻ mới")).toBeInTheDocument();
    });

    const card = screen.getByTestId("deck-card-vi-en");
    fireEvent.click(within(card).getByRole("button", { name: /Bắt đầu ôn/ }));
    expect(onStartFlow).toHaveBeenCalledWith("vi-en");
  });

  it("loads each flow's settings and persists a daily-limit change", async () => {
    const store = new FakeStore();
    await store.putSettings({
      flow: "vi-en",
      dailyNewLimit: 20,
      dailyReviewLimit: 0,
    });
    const content = new FakeContent({ "vi-en": [makeItem("vi-en", "x")] });
    const deps: SessionDeps = {
      scheduler: new FakeScheduler(),
      store,
      content,
    };

    render(
      <OverviewContainer deps={deps} nowMs={NOW} onStartFlow={() => {}} />,
    );

    // The vi-en daily limit shows the stored value (20).
    await waitFor(() => {
      const inputs = screen.getAllByRole("spinbutton", {
        name: "Số thẻ mới mỗi ngày",
      });
      expect(inputs[0]).toHaveValue(20);
    });

    const inputs = screen.getAllByRole("spinbutton", {
      name: "Số thẻ mới mỗi ngày",
    });
    fireEvent.change(inputs[0], { target: { value: "10" } });

    // Persisted to the store.
    await waitFor(async () => {
      const s = await store.getSettings("vi-en");
      expect(s.dailyNewLimit).toBe(10);
    });
    // Reflected optimistically in the UI.
    await waitFor(() => {
      const refreshed = screen.getAllByRole("spinbutton", {
        name: "Số thẻ mới mỗi ngày",
      });
      expect(refreshed[0]).toHaveValue(10);
    });
  });
});
