import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AITutorCtaBanner from "../AITutorCtaBanner";

function renderBanner(uiLang: string) {
  return render(
    <MemoryRouter>
      <AITutorCtaBanner uiLang={uiLang} />
    </MemoryRouter>,
  );
}

describe("AITutorCtaBanner", () => {
  it("shows the visibly new English AI Tutor CTA and routes to /ai-tutor", () => {
    renderBanner("en");

    expect(screen.getByText("🤖 Practice with AI Tutor")).toBeInTheDocument();
    expect(screen.getByText("Real AI correction · memory · review")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice with AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor",
    );
  });

  it("shows the visibly new Vietnamese AI Tutor CTA and routes to /ai-tutor", () => {
    renderBanner("vi");

    expect(screen.getByText("🤖 Luyện với AI Tutor / Practice with AI Tutor")).toBeInTheDocument();
    expect(screen.getByText("Sửa lỗi bằng AI thật · ghi nhớ · ôn tập")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor",
    );
  });
});
