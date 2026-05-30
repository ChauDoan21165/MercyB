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

  it("expands and renders an example when an item has example copy", () => {
    render(<ParentCategoryBucket category={categoryFixture} locale="vi" />);

    expect(screen.getByText("Xem ví dụ")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Xem ví dụ"));

    expect(screen.getAllByText("She likes music.")).toHaveLength(2);
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
