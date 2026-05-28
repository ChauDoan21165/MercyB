// src/components/__tests__/Bilingual.test.tsx
//
// Test surface for the <Bilingual> wrapper extracted post-!96/!110.
// Covers the contracts the four pilot consumer shapes (W2 / O2-style /
// P4 / Home) collectively rely on:
//
//   - Both languages render in DOM order matching `primary`.
//   - Both elements carry their `lang` attribute.
//   - Per-side className / style honored.
//   - Per-side element-type override (`viAs` / `enAs`) honored, plus the
//     bulk `as` shorthand.
//   - Lang-tag override (defaults 'vi' / 'en'; accepts BCP 47 variants).
//   - Edge case: empty string on one side renders an empty lang-tagged
//     element (deliberate — surfaces the missing-half as a visible bug
//     at the data layer rather than silently dropping it; documented in
//     the component's "what this wrapper deliberately does NOT do"
//     header).
//
// These tests are the binding spec for any future migration that
// touches the wrapper API. Adding a prop without a test row here is a
// regression-vector.

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Bilingual } from "../Bilingual";

describe("<Bilingual>", () => {
  describe("DOM order (primary)", () => {
    it("renders VI first by default (VI-primary house style)", () => {
      const { container } = render(
        <Bilingual vi="Xin chào" en="Hello" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(2);
      expect(children[0]).toHaveAttribute("lang", "vi");
      expect(children[0]).toHaveTextContent("Xin chào");
      expect(children[1]).toHaveAttribute("lang", "en");
      expect(children[1]).toHaveTextContent("Hello");
    });

    it("renders EN first when primary='en' (P4 Pricing brand-label exception)", () => {
      const { container } = render(
        <Bilingual primary="en" vi="Miễn phí" en="Free" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(2);
      expect(children[0]).toHaveAttribute("lang", "en");
      expect(children[0]).toHaveTextContent("Free");
      expect(children[1]).toHaveAttribute("lang", "vi");
      expect(children[1]).toHaveTextContent("Miễn phí");
    });
  });

  describe("lang attributes", () => {
    it("uses default 'vi' and 'en' when no override is passed", () => {
      const { container } = render(
        <Bilingual vi="A" en="B" />,
      );
      expect(container.querySelector("[lang='vi']")).toBeTruthy();
      expect(container.querySelector("[lang='en']")).toBeTruthy();
    });

    it("honors custom BCP 47 tags via viLang / enLang", () => {
      const { container } = render(
        <Bilingual
          vi="A"
          en="B"
          viLang="vi-VN"
          enLang="en-GB"
        />,
      );
      expect(container.querySelector("[lang='vi-VN']")).toBeTruthy();
      expect(container.querySelector("[lang='en-GB']")).toBeTruthy();
      // The bare defaults must NOT also appear when overrides are set.
      expect(container.querySelector("[lang='vi']")).toBeNull();
      expect(container.querySelector("[lang='en']")).toBeNull();
    });
  });

  describe("element type", () => {
    it("defaults to <p> for both sides", () => {
      const { container } = render(
        <Bilingual vi="A" en="B" />,
      );
      expect(container.children[0].tagName).toBe("P");
      expect(container.children[1].tagName).toBe("P");
    });

    it("applies the `as` shorthand to both sides", () => {
      const { container } = render(
        <Bilingual as="span" vi="A" en="B" />,
      );
      expect(container.children[0].tagName).toBe("SPAN");
      expect(container.children[1].tagName).toBe("SPAN");
    });

    it("honors per-side viAs and enAs overrides", () => {
      const { container } = render(
        <Bilingual viAs="h3" enAs="div" vi="A" en="B" />,
      );
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(viNode?.tagName).toBe("H3");
      expect(enNode?.tagName).toBe("DIV");
    });

    it("per-side override beats the `as` shorthand", () => {
      const { container } = render(
        <Bilingual as="p" viAs="h2" vi="A" en="B" />,
      );
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      // viAs wins for VI side.
      expect(viNode?.tagName).toBe("H2");
      // EN side falls back to `as` default.
      expect(enNode?.tagName).toBe("P");
    });
  });

  describe("styling", () => {
    it("applies viClassName and enClassName to the right sides", () => {
      const { container } = render(
        <Bilingual
          vi="A"
          en="B"
          viClassName="vi-class"
          enClassName="en-class"
        />,
      );
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(viNode?.className).toBe("vi-class");
      expect(enNode?.className).toBe("en-class");
    });

    it("applies viStyle and enStyle to the right sides", () => {
      const { container } = render(
        <Bilingual
          vi="A"
          en="B"
          viStyle={{ color: "rgb(255, 0, 0)" }}
          enStyle={{ color: "rgb(0, 0, 255)" }}
        />,
      );
      const viNode = container.querySelector(
        "[lang='vi']",
      ) as HTMLElement | null;
      const enNode = container.querySelector(
        "[lang='en']",
      ) as HTMLElement | null;
      expect(viNode?.style.color).toBe("rgb(255, 0, 0)");
      expect(enNode?.style.color).toBe("rgb(0, 0, 255)");
    });
  });

  describe("edge cases", () => {
    it("renders an empty lang-tagged element when one side is an empty string", () => {
      // Deliberate per the component header: empty-string handling is
      // NOT silent-drop. The wrapper renders an empty lang-tagged
      // element so a missing half surfaces visibly (and to screen
      // readers as a brief silence on a tagged element) rather than
      // hiding a data-layer bug.
      const { container } = render(<Bilingual vi="" en="Hello" />);
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(viNode).toBeTruthy();
      expect(viNode?.textContent).toBe("");
      expect(enNode).toBeTruthy();
      expect(enNode?.textContent).toBe("Hello");
    });

    it("accepts ReactNode (not just string) on either side", () => {
      const { container } = render(
        <Bilingual
          vi={
            <>
              Xin <strong>chào</strong>
            </>
          }
          en={
            <>
              Hel<em>lo</em>
            </>
          }
        />,
      );
      expect(container.querySelector("[lang='vi'] strong")).toBeTruthy();
      expect(container.querySelector("[lang='en'] em")).toBeTruthy();
    });
  });

  describe("pilot-consumer parity", () => {
    // Shape parity with the four established inline implementations.
    // These tests document that the wrapper's output IS equivalent to
    // what the inline pattern produced — making future migrations
    // mechanical.

    it("matches the W2 inline shape (stage-3a row title pair)", () => {
      // Inline pattern:
      //   <p lang="vi" className="text-sm font-semibold leading-snug text-slate-900">{vi}</p>
      //   <p lang="en" className="mt-0.5 text-[12px] leading-snug text-slate-500">{en}</p>
      const { container } = render(
        <Bilingual
          vi="Lỗi 3rd person -s"
          en="3rd person -s error"
          viClassName="text-sm font-semibold leading-snug text-slate-900"
          enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
        />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.tagName).toBe("P");
      expect(first.getAttribute("lang")).toBe("vi");
      expect(first.className).toBe(
        "text-sm font-semibold leading-snug text-slate-900",
      );
      expect(second.tagName).toBe("P");
      expect(second.getAttribute("lang")).toBe("en");
      expect(second.className).toBe(
        "mt-0.5 text-[12px] leading-snug text-slate-500",
      );
    });

    it("matches the P4 BiText inline shape (Pricing EN-primary brand pair)", () => {
      // Inline pattern (BiText helper in Pricing.tsx):
      //   <span lang="en">{en}</span>
      //   <span lang="vi" style={viStyle}>{vi}</span>
      const viStyle = { fontSize: "11px", color: "#94a3b8" };
      const { container } = render(
        <Bilingual
          primary="en"
          as="span"
          en="Free"
          vi="Miễn phí"
          viStyle={viStyle}
        />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.tagName).toBe("SPAN");
      expect(first.getAttribute("lang")).toBe("en");
      expect(first.textContent).toBe("Free");
      expect(second.tagName).toBe("SPAN");
      expect(second.getAttribute("lang")).toBe("vi");
      expect((second as HTMLElement).style.fontSize).toBe("11px");
    });

    it("matches the Home card inline shape (PracticeRecommendationCard title pair)", () => {
      // Inline pattern:
      //   <div style={titleViStyle}>{rec.title_vi}</div>
      //   <div style={titleEnStyle}>{rec.title_en}</div>
      // (Note: not currently lang-tagged — migrating ADDS lang attrs.)
      const titleViStyle = { fontSize: "18px", fontWeight: 700 };
      const titleEnStyle = { fontSize: "13px", color: "#64748b" };
      const { container } = render(
        <Bilingual
          as="div"
          vi="Luyện phát âm"
          en="Practice pronunciation"
          viStyle={titleViStyle}
          enStyle={titleEnStyle}
        />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.tagName).toBe("DIV");
      expect(first.getAttribute("lang")).toBe("vi");
      expect((first as HTMLElement).style.fontWeight).toBe("700");
      expect(second.tagName).toBe("DIV");
      expect(second.getAttribute("lang")).toBe("en");
      expect((second as HTMLElement).style.color).toBe("rgb(100, 116, 139)");
    });
  });
});
