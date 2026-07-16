import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({
  value: { user: null as { id: string } | null, isLoading: false },
}));

const profileState = vi.hoisted(() => ({
  value: {
    data: null as { is_adult_confirmed?: boolean } | null,
    isLoading: false,
    isFetching: false,
  },
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => authState.value,
}));

vi.mock("@/lib/queries/useProfileQuery", () => ({
  useProfileQuery: () => profileState.value,
}));

import {
  isKidsRoomId,
  RequireKidsParentGate,
  RequireKidsTierParentGate,
} from "../KidsParentGate";

function renderKidsRoute(path = "/kids/vi-english") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/kids/vi-english"
          element={
            <RequireKidsParentGate>
              <div data-testid="kids-content">kids</div>
            </RequireKidsParentGate>
          }
        />
        <Route path="/kids/parent-gate" element={<div data-testid="parent-gate">gate</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderTierRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/tiers/:tierId"
          element={
            <RequireKidsTierParentGate>
              <div data-testid="tier-content">tier</div>
            </RequireKidsTierParentGate>
          }
        />
        <Route path="/kids/parent-gate" element={<div data-testid="parent-gate">gate</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RequireKidsParentGate", () => {
  beforeEach(() => {
    authState.value = { user: null, isLoading: false };
    profileState.value = { data: null, isLoading: false, isFetching: false };
  });

  it("redirects anonymous visitors to the parent gate", () => {
    renderKidsRoute();
    expect(screen.getByTestId("parent-gate")).toBeInTheDocument();
    expect(screen.queryByTestId("kids-content")).not.toBeInTheDocument();
  });

  it("redirects signed-in visitors whose profile is not adult-confirmed", () => {
    authState.value = { user: { id: "user-1" }, isLoading: false };
    profileState.value = {
      data: { is_adult_confirmed: false },
      isLoading: false,
      isFetching: false,
    };

    renderKidsRoute();
    expect(screen.getByTestId("parent-gate")).toBeInTheDocument();
    expect(screen.queryByTestId("kids-content")).not.toBeInTheDocument();
  });

  it("allows signed-in adult-confirmed visitors through", () => {
    authState.value = { user: { id: "user-1" }, isLoading: false };
    profileState.value = {
      data: { is_adult_confirmed: true },
      isLoading: false,
      isFetching: false,
    };

    renderKidsRoute();
    expect(screen.getByTestId("kids-content")).toBeInTheDocument();
    expect(screen.queryByTestId("parent-gate")).not.toBeInTheDocument();
  });

  it("gates kids tier detail routes while leaving non-kids tiers alone", () => {
    renderTierRoute("/tiers/kids_1");
    expect(screen.getByTestId("parent-gate")).toBeInTheDocument();

    authState.value = { user: null, isLoading: false };
    profileState.value = { data: null, isLoading: false, isFetching: false };
    renderTierRoute("/tiers/a1");
    expect(screen.getByTestId("tier-content")).toBeInTheDocument();
  });

  it("identifies kids room IDs by the existing kids suffixes", () => {
    expect(isKidsRoomId("alphabet_adventure_kids_l1")).toBe(true);
    expect(isKidsRoomId("school_mystery_kids_l2")).toBe(true);
    expect(isKidsRoomId("space_story_kids_l3")).toBe(true);
    expect(isKidsRoomId("a101")).toBe(false);
  });
});
