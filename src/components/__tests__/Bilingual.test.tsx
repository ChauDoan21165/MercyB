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

import { createRef } from "react";
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

  describe("primaryRef", () => {
    it("forwards to the VI element when primary='vi' (default)", () => {
      const ref = createRef<HTMLElement>();
      const { container } = render(
        <Bilingual vi="A" en="B" primaryRef={ref} />,
      );
      const viNode = container.querySelector("[lang='vi']");
      expect(viNode).toBe(ref.current);
    });

    it("forwards to the EN element when primary='en'", () => {
      const ref = createRef<HTMLElement>();
      const { container } = render(
        <Bilingual primary="en" vi="A" en="B" primaryRef={ref} />,
      );
      const enNode = container.querySelector("[lang='en']");
      expect(enNode).toBe(ref.current);
    });

    it("ref re-points to the new primary side when primary flips between renders", () => {
      // O2's wizard doesn't actually flip mid-render — the
      // headingRef is stable per step. But the wrapper's contract
      // must follow `primary` strictly so a future consumer that
      // does flip (e.g. an A/B brand-experiment toggle) gets the
      // right element.
      const ref = createRef<HTMLElement>();
      const { container, rerender } = render(
        <Bilingual vi="A" en="B" primaryRef={ref} />,
      );
      expect(ref.current).toBe(container.querySelector("[lang='vi']"));

      rerender(
        <Bilingual primary="en" vi="A" en="B" primaryRef={ref} />,
      );
      expect(ref.current).toBe(container.querySelector("[lang='en']"));
    });

    it("ref target supports HTMLElement.focus() — the O2 wizard use case", () => {
      // The whole point of primaryRef is post-step focus management.
      // Smoke-test that the forwarded ref's `.focus()` lands focus on
      // the primary element.
      const ref = createRef<HTMLElement>();
      const { container } = render(
        <Bilingual as="h1" vi="Mới" en="New" primaryRef={ref} tabIndex={-1} />,
      );
      ref.current?.focus();
      const viNode = container.querySelector("[lang='vi']");
      expect(document.activeElement).toBe(viNode);
    });
  });

  describe("tabIndex", () => {
    it("applies to the primary element only (default primary='vi')", () => {
      const { container } = render(
        <Bilingual vi="A" en="B" tabIndex={-1} />,
      );
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(viNode?.getAttribute("tabindex")).toBe("-1");
      expect(enNode?.hasAttribute("tabindex")).toBe(false);
    });

    it("follows primary='en' — applies to EN element, not VI", () => {
      const { container } = render(
        <Bilingual primary="en" vi="A" en="B" tabIndex={0} />,
      );
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(enNode?.getAttribute("tabindex")).toBe("0");
      expect(viNode?.hasAttribute("tabindex")).toBe(false);
    });

    it("is omitted from both sides when prop is undefined (regression for !115 pilots)", () => {
      const { container } = render(<Bilingual vi="A" en="B" />);
      const viNode = container.querySelector("[lang='vi']");
      const enNode = container.querySelector("[lang='en']");
      expect(viNode?.hasAttribute("tabindex")).toBe(false);
      expect(enNode?.hasAttribute("tabindex")).toBe(false);
    });
  });

  describe("separator", () => {
    it("renders between the two sides when present (default primary='vi')", () => {
      const { container } = render(
        <Bilingual
          vi="A"
          en="B"
          separator={<hr data-testid="sep" />}
        />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(3);
      expect(children[0]).toHaveAttribute("lang", "vi");
      expect((children[1] as HTMLElement).getAttribute("data-testid")).toBe(
        "sep",
      );
      expect(children[2]).toHaveAttribute("lang", "en");
    });

    it("renders between sides in primary='en' order too", () => {
      const { container } = render(
        <Bilingual
          primary="en"
          vi="A"
          en="B"
          separator={<hr data-testid="sep" />}
        />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(3);
      expect(children[0]).toHaveAttribute("lang", "en");
      expect((children[1] as HTMLElement).getAttribute("data-testid")).toBe(
        "sep",
      );
      expect(children[2]).toHaveAttribute("lang", "vi");
    });

    it("omitted when undefined — Fragment-of-two-siblings shape preserved (!115 regression guard)", () => {
      // The !115 pilot consumers (W2, P4 BiText, Home) rely on the
      // wrapper rendering exactly two children. Adding the separator
      // prop must not break that default.
      const { container } = render(<Bilingual vi="A" en="B" />);
      expect(container.children).toHaveLength(2);
    });

    it("accepts any ReactNode as separator (string, fragment, element)", () => {
      const { container } = render(
        <Bilingual vi="A" en="B" separator="—" />,
      );
      // String separator becomes a text node — sibling count stays at
      // 2 elements (the text node isn't an HTMLElement), but the text
      // is in the DOM between the two element children.
      expect(container.textContent).toBe("A—B");
    });
  });

  describe("dropEmpty", () => {
    // `dropEmpty=true` skips rendering of empty-content sides — for
    // conditional one-side-missing patterns like LocalWeaknessMap's
    // L1Row examples or Pricing's plan-card bullets. Default false
    // preserves !115's deliberate-no-silent-drop contract.

    it("default (dropEmpty=false): empty vi still renders empty lang-tagged element (!115 regression guard)", () => {
      const { container } = render(<Bilingual vi="" en="Hello" />);
      const children = Array.from(container.children);
      expect(children).toHaveLength(2);
      expect(children[0].getAttribute("lang")).toBe("vi");
      expect(children[0].textContent).toBe("");
      expect(children[1].getAttribute("lang")).toBe("en");
      expect(children[1].textContent).toBe("Hello");
    });

    it("dropEmpty=true: empty-string vi → only EN renders", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="" en="Hello" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(1);
      expect(children[0].getAttribute("lang")).toBe("en");
      expect(children[0].textContent).toBe("Hello");
    });

    it("dropEmpty=true: empty-string en → only VI renders", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="Xin chào" en="" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(1);
      expect(children[0].getAttribute("lang")).toBe("vi");
      expect(children[0].textContent).toBe("Xin chào");
    });

    it("dropEmpty=true: undefined vi → only EN renders (handles `string | undefined` callers)", () => {
      const { container } = render(
        <Bilingual dropEmpty vi={undefined} en="Hello" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(1);
      expect(children[0].getAttribute("lang")).toBe("en");
    });

    it("dropEmpty=true: null en → only VI renders", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="Xin chào" en={null} />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(1);
      expect(children[0].getAttribute("lang")).toBe("vi");
    });

    it("dropEmpty=true: both empty → renders null (no DOM children)", () => {
      const { container } = render(<Bilingual dropEmpty vi="" en="" />);
      expect(container.children).toHaveLength(0);
      expect(container.textContent).toBe("");
    });

    it("dropEmpty=true: both populated → renders both sides (regression — dropEmpty must not break the common case)", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="Xin chào" en="Hello" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(2);
      expect(children[0].getAttribute("lang")).toBe("vi");
      expect(children[1].getAttribute("lang")).toBe("en");
    });

    it("dropEmpty=true + separator: separator is omitted when one side is dropped (no stray divider)", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="" en="Hello" separator={<hr data-testid="sep" />} />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(1);
      // The separator must NOT appear when only one side rendered.
      expect(container.querySelector("hr")).toBeNull();
    });

    it("dropEmpty=true + separator: separator IS rendered when both sides render", () => {
      const { container } = render(
        <Bilingual dropEmpty vi="Xin chào" en="Hello" separator={<hr data-testid="sep" />} />,
      );
      expect(container.querySelector("hr")).not.toBeNull();
      expect(container.children).toHaveLength(3);
    });

    it("`0` is NOT empty (renders as visible text)", () => {
      const { container } = render(
        <Bilingual dropEmpty vi={0} en="Hello" />,
      );
      const children = Array.from(container.children);
      expect(children).toHaveLength(2);
      expect(children[0].textContent).toBe("0");
    });
  });

  describe("viProps / enProps", () => {
    // Arbitrary per-side props (id, aria-*, data-*, role, etc.) flow
    // onto the rendered element via the viProps/enProps escape hatch.
    // Explicit Bilingual props win over viProps to protect the
    // wrapper's per-side contracts (lang, className, style, ref).

    it("viProps id flows through to the VI element only", () => {
      const { container } = render(
        <Bilingual vi="Xin chào" en="Hello" viProps={{ id: "vi-heading" }} />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.getAttribute("id")).toBe("vi-heading");
      expect(second.getAttribute("id")).toBeNull();
    });

    it("enProps aria-label flows through to the EN element only", () => {
      const { container } = render(
        <Bilingual
          vi="Xin chào"
          en="Hello"
          enProps={{ "aria-label": "english greeting" }}
        />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.getAttribute("aria-label")).toBeNull();
      expect(second.getAttribute("aria-label")).toBe("english greeting");
    });

    it("viProps and enProps coexist without leaking into each other", () => {
      const { container } = render(
        <Bilingual
          vi="Xin chào"
          en="Hello"
          viProps={{ id: "vi-id", "data-vi": "1" }}
          enProps={{ id: "en-id", "data-en": "1" }}
        />,
      );
      const [first, second] = Array.from(container.children);
      expect(first.getAttribute("id")).toBe("vi-id");
      expect(first.getAttribute("data-vi")).toBe("1");
      expect(first.getAttribute("data-en")).toBeNull();
      expect(second.getAttribute("id")).toBe("en-id");
      expect(second.getAttribute("data-en")).toBe("1");
      expect(second.getAttribute("data-vi")).toBeNull();
    });

    it("explicit Bilingual props win over viProps (lang / className / style protected from accidental override)", () => {
      const { container } = render(
        <Bilingual
          vi="Xin chào"
          en="Hello"
          viLang="vi-VN"
          viClassName="explicit"
          viStyle={{ color: "rgb(1, 2, 3)" }}
          viProps={{
            // These should ALL be defeated by the explicit Bilingual props.
            lang: "fr",
            className: "from-props",
            style: { color: "rgb(99, 99, 99)" },
          }}
        />,
      );
      const [first] = Array.from(container.children);
      // viLang wins.
      expect(first.getAttribute("lang")).toBe("vi-VN");
      // viClassName wins.
      expect(first.getAttribute("class")).toBe("explicit");
      // viStyle wins.
      expect((first as HTMLElement).style.color).toBe("rgb(1, 2, 3)");
    });

    it("viProps role flows through (a11y use case)", () => {
      const { container } = render(
        <Bilingual vi="Tiếng Việt" en="English" viProps={{ role: "note" }} />,
      );
      const [first] = Array.from(container.children);
      expect(first.getAttribute("role")).toBe("note");
    });

    it("viProps + dropEmpty: when the VI side is dropped, viProps don't render anywhere", () => {
      const { container } = render(
        <Bilingual
          dropEmpty
          vi=""
          en="Hello"
          viProps={{ id: "should-not-exist" }}
          enProps={{ id: "en-target" }}
        />,
      );
      expect(container.querySelector("#should-not-exist")).toBeNull();
      expect(container.querySelector("#en-target")).not.toBeNull();
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

    it("matches the O2 inline shape (OnboardingPage pre-pick StepHeader title pair)", () => {
      // Inline pattern (OnboardingPage.tsx pre-pick StepHeader):
      //   <h1 lang="vi" ref={headingRef} tabIndex={-1} style={stepTitleStyle}>{title.vi}</h1>
      //   <PeerDivider />
      //   <div lang="en" style={stepTitleStyle}>{title.en}</div>
      const stepTitleStyle = { fontSize: "22px", fontWeight: 800 };
      const headingRef = createRef<HTMLElement>();
      const { container } = render(
        <Bilingual
          viAs="h1"
          enAs="div"
          vi="Mới bắt đầu"
          en="Just starting"
          viStyle={stepTitleStyle}
          enStyle={stepTitleStyle}
          primaryRef={headingRef}
          tabIndex={-1}
          separator={
            <div
              data-testid="peer-divider"
              aria-hidden
              style={{ height: 1, background: "rgba(0,0,0,0.10)" }}
            />
          }
        />,
      );
      const [first, second, third] = Array.from(container.children);
      // VI side: h1 with ref + tabIndex
      expect(first.tagName).toBe("H1");
      expect(first.getAttribute("lang")).toBe("vi");
      expect(first.getAttribute("tabindex")).toBe("-1");
      expect(headingRef.current).toBe(first);
      // Separator: divider div
      expect((second as HTMLElement).getAttribute("data-testid")).toBe(
        "peer-divider",
      );
      // EN side: div with same style; NO ref, NO tabIndex
      expect(third.tagName).toBe("DIV");
      expect(third.getAttribute("lang")).toBe("en");
      expect(third.hasAttribute("tabindex")).toBe(false);
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
