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
  it("shows the visibly new English AI Tutor CTA and routes to English Tutor", () => {
    renderBanner("en");

    expect(screen.getByText("🤖 Practice with AI Tutor")).toBeInTheDocument();
    expect(screen.getByText("Real AI correction · memory · review")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice with AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor?target=en",
    );
  });

  it("shows the visibly new Vietnamese AI Tutor CTA and routes to the requested target", () => {
    render(
      <MemoryRouter>
        <AITutorCtaBanner uiLang="vi" target="fr" />
      </MemoryRouter>,
    );

    expect(screen.getByText("🤖 Luyện với AI Tutor / Practice with AI Tutor")).toBeInTheDocument();
    expect(screen.getByText("Sửa lỗi bằng AI thật · ghi nhớ · ôn tập")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor?target=fr",
    );
  });

  it("does not show the old Adult launcher copy", () => {
    const { container } = render(
      <MemoryRouter>
        <AITutorCtaBanner uiLang="vi" target="en" />
      </MemoryRouter>,
    );

    expect(container).not.toHaveTextContent(/\bAdult\b|adult learner|Me — an adult learner/i);
    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor?target=en",
    );
  });
});
