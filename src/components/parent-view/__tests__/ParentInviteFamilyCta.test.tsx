import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ParentInviteFamilyCta } from "../ParentInviteFamilyCta";

describe("ParentInviteFamilyCta", () => {
  it("links to the existing bulk-invite (create) surface — closes the loop", () => {
    render(
      <MemoryRouter>
        <ParentInviteFamilyCta />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("parent-invite-family")).toHaveAttribute(
      "href",
      "/referral/invite-family",
    );
  });

  it("renders the VI-first invite label", () => {
    render(
      <MemoryRouter>
        <ParentInviteFamilyCta />
      </MemoryRouter>,
    );
    expect(screen.getByText("Mời gia đình")).toBeInTheDocument();
    expect(screen.getByText("Invite family")).toBeInTheDocument();
  });
});
