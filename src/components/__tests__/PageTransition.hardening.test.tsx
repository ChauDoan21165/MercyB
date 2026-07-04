// PATH: src/components/__tests__/PageTransition.hardening.test.tsx
//
// Hardening tests for src/components/PageTransition.tsx
//
// The component is a thin wrapper around framer-motion's <AnimatePresence>
// and <motion.div>, keyed off react-router's useLocation().pathname.
//
// To keep these tests deterministic (framer-motion's real exit animations are
// async / RAF-driven and flaky in jsdom) we mock framer-motion with a tiny
// passthrough that records every prop it is handed. That lets us assert the
// exact animation contract (initial / animate / exit / transition / className)
// each exported variant declares — the part that actually matters for a
// presentational wrapper — without depending on animation timing.

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ComponentType, ReactNode } from "react";

type ReactModule = typeof import("react");
type AnimatePresenceProps = Record<string, unknown> & {
  children?: ReactNode;
  mode?: string;
};
type MotionProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
};
type MotionRender = {
  tag: string;
  className?: string;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
};

// ---------------------------------------------------------------------------
// Mock framer-motion deterministically. We capture every render so individual
// tests can inspect what props PageTransition / PageFade declared.
// ---------------------------------------------------------------------------
const captured = vi.hoisted(() => ({
  motionRenders: [] as MotionRender[],
  presenceRenders: [] as AnimatePresenceProps[],
}));

vi.mock("framer-motion", async () => {
  const ReactMod: ReactModule = await import("react");
  const React = ReactMod;

  const AnimatePresence = ({ children, mode, ...rest }: AnimatePresenceProps) => {
    captured.presenceRenders.push({ mode, ...rest });
    return React.createElement(React.Fragment, null, children);
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        const Comp = ({
          children,
          className,
          initial,
          animate,
          exit,
          transition,
          ...rest
        }: MotionProps) => {
          captured.motionRenders.push({
            tag,
            className,
            initial,
            animate,
            exit,
            transition,
          });
          return React.createElement(
            tag,
            { className, "data-testid": `motion-${tag}`, ...rest },
            children,
          );
        };
        Comp.displayName = `motion.${tag}`;
        return Comp as ComponentType<MotionProps>;
      },
    },
  );

  return { AnimatePresence, motion };
});

// Import AFTER the mock is registered.
import { PageTransition, PageFade } from "../PageTransition";

const renderAt = (ui: React.ReactNode, path = "/") =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);

beforeEach(() => {
  captured.motionRenders.length = 0;
  captured.presenceRenders.length = 0;
  cleanup();
});

describe("PageTransition — exports", () => {
  it("exports PageTransition and PageFade as functions", () => {
    expect(typeof PageTransition).toBe("function");
    expect(typeof PageFade).toBe("function");
  });

  it("are distinct components", () => {
    expect(PageTransition).not.toBe(PageFade);
  });
});

describe("PageTransition — rendering", () => {
  it("renders its children", () => {
    renderAt(
      <PageTransition>
        <span>hello world</span>
      </PageTransition>,
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("wraps content in a single motion.div", () => {
    renderAt(
      <PageTransition>
        <p>body</p>
      </PageTransition>,
    );
    const wrappers = screen.getAllByTestId("motion-div");
    expect(wrappers).toHaveLength(1);
    expect(wrappers[0]).toContainElement(screen.getByText("body"));
  });

  it("applies the full-bleed sizing className", () => {
    renderAt(
      <PageTransition>
        <p>x</p>
      </PageTransition>,
    );
    expect(captured.motionRenders).toHaveLength(1);
    expect(captured.motionRenders[0].className).toBe("w-full h-full");
  });

  it("declares the slide-up animation contract (initial/animate/exit)", () => {
    renderAt(
      <PageTransition>
        <p>x</p>
      </PageTransition>,
    );
    const r = captured.motionRenders[0];
    expect(r.initial).toEqual({ opacity: 0, y: 20 });
    expect(r.animate).toEqual({ opacity: 1, y: 0 });
    expect(r.exit).toEqual({ opacity: 0, y: -20 });
  });

  it("declares a 0.3s transition with the custom cubic-bezier easing", () => {
    renderAt(
      <PageTransition>
        <p>x</p>
      </PageTransition>,
    );
    const r = captured.motionRenders[0];
    const transition = r.transition as { duration?: number; ease?: unknown[] };
    expect(transition.duration).toBe(0.3);
    expect(transition.ease).toEqual([0.4, 0, 0.2, 1]);
  });

  it("wraps the page in AnimatePresence with mode='wait'", () => {
    renderAt(
      <PageTransition>
        <p>x</p>
      </PageTransition>,
    );
    expect(captured.presenceRenders).toHaveLength(1);
    expect(captured.presenceRenders[0].mode).toBe("wait");
  });
});

describe("PageFade — rendering", () => {
  it("renders its children", () => {
    renderAt(
      <PageFade>
        <span>fade me</span>
      </PageFade>,
    );
    expect(screen.getByText("fade me")).toBeInTheDocument();
  });

  it("applies the full-bleed sizing className", () => {
    renderAt(
      <PageFade>
        <p>x</p>
      </PageFade>,
    );
    expect(captured.motionRenders[0].className).toBe("w-full h-full");
  });

  it("declares an opacity-only animation contract (no y translation)", () => {
    renderAt(
      <PageFade>
        <p>x</p>
      </PageFade>,
    );
    const r = captured.motionRenders[0];
    const initial = r.initial as { y?: unknown };
    const exit = r.exit as { y?: unknown };
    expect(r.initial).toEqual({ opacity: 0 });
    expect(r.animate).toEqual({ opacity: 1 });
    expect(r.exit).toEqual({ opacity: 0 });
    // Distinct from PageTransition: no y axis movement.
    expect(initial.y).toBeUndefined();
    expect(exit.y).toBeUndefined();
  });

  it("declares the faster 0.2s transition without custom easing", () => {
    renderAt(
      <PageFade>
        <p>x</p>
      </PageFade>,
    );
    const r = captured.motionRenders[0];
    const transition = r.transition as { duration?: number; ease?: unknown };
    expect(transition.duration).toBe(0.2);
    expect(transition.ease).toBeUndefined();
  });

  it("wraps the page in AnimatePresence with mode='wait'", () => {
    renderAt(
      <PageFade>
        <p>x</p>
      </PageFade>,
    );
    expect(captured.presenceRenders[0].mode).toBe("wait");
  });
});

describe("PageTransition / PageFade — edge cases", () => {
  it("renders nothing harmful when children is null", () => {
    expect(() => renderAt(<PageTransition>{null}</PageTransition>)).not.toThrow();
    // Wrapper still mounts even with empty content.
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("renders nothing harmful when children is undefined", () => {
    expect(() =>
      renderAt(<PageFade>{undefined}</PageFade>),
    ).not.toThrow();
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();
  });

  it("renders nothing harmful when children is false", () => {
    expect(() => renderAt(<PageTransition>{false}</PageTransition>)).not.toThrow();
  });

  it("renders multiple children", () => {
    renderAt(
      <PageTransition>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </PageTransition>,
    );
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();
  });

  it("renders a plain string child", () => {
    renderAt(<PageFade>just text</PageFade>);
    expect(screen.getByText("just text")).toBeInTheDocument();
  });

  it("renders a numeric/zero child without dropping it", () => {
    renderAt(<PageTransition>{0}</PageTransition>);
    expect(screen.getByTestId("motion-div")).toHaveTextContent("0");
  });

  it("renders nested component trees", () => {
    const Inner = () => <article data-testid="inner">deep</article>;
    renderAt(
      <PageTransition>
        <div>
          <Inner />
        </div>
      </PageTransition>,
    );
    expect(screen.getByTestId("inner")).toHaveTextContent("deep");
  });
});

describe("PageTransition / PageFade — routing dependence", () => {
  it("renders at a non-root pathname", () => {
    renderAt(
      <PageTransition>
        <span>routed</span>
      </PageTransition>,
      "/room/abc",
    );
    expect(screen.getByText("routed")).toBeInTheDocument();
    expect(captured.motionRenders).toHaveLength(1);
  });

  it("throws if used outside a router (useLocation has no context)", () => {
    // useLocation requires a Router ancestor; rendering bare must fail loudly.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <PageTransition>
          <span>no router</span>
        </PageTransition>,
      ),
    ).toThrow();
    spy.mockRestore();
  });

  it("produces independent renders for two different routes", () => {
    renderAt(<PageTransition>a</PageTransition>, "/first");
    expect(captured.motionRenders).toHaveLength(1);

    captured.motionRenders.length = 0;
    cleanup();

    renderAt(<PageTransition>b</PageTransition>, "/second");
    expect(captured.motionRenders).toHaveLength(1);
  });
});
