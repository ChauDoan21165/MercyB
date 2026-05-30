import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ParentAskMercyCta } from "../ParentAskMercyCta";

describe("ParentAskMercyCta", () => {
  it("links to the existing weak-at surface", () => {
    render(
      <MemoryRouter>
        <ParentAskMercyCta />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("parent-ask-mercy")).toHaveAttribute(
      "href",
      "/weak-at",
    );
  });
});
