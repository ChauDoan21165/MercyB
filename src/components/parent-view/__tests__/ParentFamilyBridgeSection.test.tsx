import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ParentFamilyBridgeSection } from "../ParentFamilyBridgeSection";

const VI_DIACRITIC = /[À-ỹ]/u;

describe("ParentFamilyBridgeSection", () => {
  it("renders the section with VI heading", () => {
    render(<ParentFamilyBridgeSection />);
    expect(screen.getByTestId("parent-family-bridge-section")).toBeInTheDocument();
    expect(screen.getByText("Cùng học với con")).toBeInTheDocument();
  });

  it("renders all three curated script entries", () => {
    render(<ParentFamilyBridgeSection />);
    expect(
      screen.getByTestId("parent-family-bridge-script-fb-s02-health-checkin"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("parent-family-bridge-script-fb-s01-explain-job"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("parent-family-bridge-script-fb-s05-asking-about-vietnam"),
    ).toBeInTheDocument();
  });

  it("script titles use Vietnamese diacritics", () => {
    render(<ParentFamilyBridgeSection />);
    const section = screen.getByTestId("parent-family-bridge-section");
    expect(section.textContent).toMatch(VI_DIACRITIC);
  });

  it("accordion body is hidden before click", () => {
    render(<ParentFamilyBridgeSection />);
    expect(
      screen.queryByTestId("parent-family-bridge-body-fb-s02-health-checkin"),
    ).not.toBeInTheDocument();
  });

  it("accordion opens on click and shows the cultural note with VN diacritics", () => {
    render(<ParentFamilyBridgeSection />);
    const item = screen.getByTestId(
      "parent-family-bridge-script-fb-s02-health-checkin",
    );
    fireEvent.click(item.querySelector("button")!);
    const body = screen.getByTestId(
      "parent-family-bridge-body-fb-s02-health-checkin",
    );
    expect(body).toBeInTheDocument();
    expect(body.textContent).toMatch(VI_DIACRITIC);
  });

  it("accordion closes on second click", () => {
    render(<ParentFamilyBridgeSection />);
    const item = screen.getByTestId(
      "parent-family-bridge-script-fb-s01-explain-job",
    );
    const btn = item.querySelector("button")!;
    fireEvent.click(btn);
    expect(
      screen.getByTestId("parent-family-bridge-body-fb-s01-explain-job"),
    ).toBeInTheDocument();
    fireEvent.click(btn);
    expect(
      screen.queryByTestId("parent-family-bridge-body-fb-s01-explain-job"),
    ).not.toBeInTheDocument();
  });
});
