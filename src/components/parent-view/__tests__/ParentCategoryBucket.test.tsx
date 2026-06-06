import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ParentCategoryBucket } from "../ParentCategoryBucket";
import type { ParentCategory } from "@/lib/parent-view/buildParentSummary";

const categoryFixture: ParentCategory = {
  config: {
    id: "grammar",
    titleVi: "Ngữ pháp đang luyện",
    titleEn: "Grammar in progress",
    videoUrl: null,
  },
  isEmpty: false,
  items: [
    {
      key: "grammar:vi_l1_3rd_person_s",
      qualitativeVi: "Con đang luyện chia động từ ngôi thứ ba.",
      qualitativeEn: "Your child is practising third-person verb forms.",
      exampleVi: "She likes music.",
      exampleEn: "She likes music.",
      numeric: { count: 8, severity: "medium" },
    },
  ],
};

describe("ParentCategoryBucket", () => {
  it("renders qualitative items and keeps numbers hidden until toggled", () => {
    render(<ParentCategoryBucket category={categoryFixture} locale="vi" />);

    expect(screen.getByTestId("parent-category-grammar")).toHaveTextContent(
      "Con đang luyện chia động từ ngôi thứ ba.",
    );
    expect(
      screen.queryByTestId("parent-numeric-grammar:vi_l1_3rd_person_s"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("parent-numbers-toggle-grammar"));

    expect(
      screen.getByTestId("parent-numeric-grammar:vi_l1_3rd_person_s"),
    ).toHaveTextContent("8 lần");
  });

  it("expands a validated item and renders the family-bridge explainer + example", () => {
    render(<ParentCategoryBucket category={categoryFixture} locale="vi" />);

    // vi_l1_3rd_person_s is a Chau-approved pilot entry, so the affordance
    // surfaces the explainer (not a bare example).
    expect(screen.getByText("Mercy giải thích")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mercy giải thích"));

    expect(
      screen.getByTestId("parent-familybridge-grammar:vi_l1_3rd_person_s"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mercy giải thích cho con bạn")).toBeInTheDocument();
    expect(screen.getByText("Cách gia đình có thể giúp")).toBeInTheDocument();
    // The example still renders alongside the explainer.
    expect(screen.getAllByText("She likes music.")).toHaveLength(2);
  });

  it("never renders an explainer for an unvalidated tag", () => {
    const pendingFixture: ParentCategory = {
      ...categoryFixture,
      items: [
        {
          // Batch-2b entry — still validated:false until Chau signs off.
          key: "grammar:vi_l1_generic_plural",
          qualitativeVi: "Con đang luyện danh từ số nhiều khái quát.",
          qualitativeEn: "Your child is practising generic plurals.",
          numeric: { count: 5, severity: "low" },
        },
      ],
    };
    render(<ParentCategoryBucket category={pendingFixture} locale="vi" />);

    expect(
      screen.queryByTestId("parent-familybridge-grammar:vi_l1_generic_plural"),
    ).not.toBeInTheDocument();
    // No example + no validated explainer ⇒ row is not expandable.
    expect(screen.queryByText("Mercy giải thích")).not.toBeInTheDocument();
    expect(screen.queryByText("Xem ví dụ")).not.toBeInTheDocument();
  });

  it("renders a video slot only when a category supplies a video URL", () => {
    render(
      <ParentCategoryBucket
        category={{
          ...categoryFixture,
          config: { ...categoryFixture.config, videoUrl: "/video.mp4" },
        }}
        locale="vi"
      />,
    );

    expect(screen.getByTestId("parent-video-grammar")).toBeInTheDocument();
  });
});
