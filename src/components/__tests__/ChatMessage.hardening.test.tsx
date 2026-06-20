// @vitest-environment jsdom
//
// Hardening tests for src/components/ChatMessage.tsx
//
// ChatMessage is a presentational chat-bubble component. It exposes exactly one
// named export: `ChatMessage`. The `ChatMessageProps` interface is not exported,
// so it cannot be imported by name — instead these tests exercise the public
// surface (props -> rendered DOM) which fully covers the prop contract.
//
// External dependencies that are mocked / controlled for determinism:
//   - framer-motion        -> mocked to a plain <div> so no animation timing leaks
//   - window.matchMedia    -> stubbed (getVariants() reads prefers-reduced-motion)
//   - date-fns formatDistanceToNow is real but compared against the same call,
//     keeping the assertion deterministic relative to the test clock.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { formatDistanceToNow } from "date-fns";

// ---------------------------------------------------------------------------
// Mock framer-motion: render a plain <div> and surface the animation props as
// data-* attributes so we can assert the component wired them up correctly,
// without depending on real animation behavior.
// ---------------------------------------------------------------------------
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, variants, initial, animate }: any) => (
      <div
        data-testid="motion-div"
        className={className}
        data-variants={JSON.stringify(variants)}
        data-initial={initial}
        data-animate={animate}
      >
        {children}
      </div>
    ),
  },
}));

// Imported AFTER the mock declaration (vi.mock is hoisted, so order is safe).
import { ChatMessage } from "@/components/ChatMessage";

// ---------------------------------------------------------------------------
// matchMedia control — getVariants() in @/lib/motion calls
// window.matchMedia('(prefers-reduced-motion: reduce)'). jsdom does not provide
// it by default, so we install a controllable stub.
// ---------------------------------------------------------------------------
function setReducedMotion(reduce: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

beforeEach(() => {
  setReducedMotion(false);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// A fixed point in the past used across timestamp tests.
const PAST = new Date("2020-01-01T00:00:00.000Z");

describe("ChatMessage — exports", () => {
  it("exports ChatMessage as a function component", () => {
    expect(typeof ChatMessage).toBe("function");
  });

  it("is named 'ChatMessage'", () => {
    expect(ChatMessage.name).toBe("ChatMessage");
  });
});

describe("ChatMessage — content rendering", () => {
  it("renders plain string content", () => {
    render(<ChatMessage content="Hello world" timestamp={PAST} isUser={false} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders ReactNode (element) content", () => {
    render(
      <ChatMessage
        content={<span data-testid="rich">Rich node</span>}
        timestamp={PAST}
        isUser={false}
      />,
    );
    expect(screen.getByTestId("rich")).toBeInTheDocument();
    expect(screen.getByText("Rich node")).toBeInTheDocument();
  });

  it("renders numeric content (ReactNode allows numbers)", () => {
    render(<ChatMessage content={0} timestamp={PAST} isUser={false} />);
    // React renders the number 0 as text "0".
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders without crashing when content is an empty string", () => {
    const { container } = render(
      <ChatMessage content="" timestamp={PAST} isUser={false} />,
    );
    // Bubble div still present even with empty content.
    expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
  });

  it("renders without crashing when content is null", () => {
    const { container } = render(
      <ChatMessage content={null} timestamp={PAST} isUser={false} />,
    );
    expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
  });

  it("renders multi-child ReactNode content", () => {
    render(
      <ChatMessage
        content={
          <>
            <strong>Bold</strong> and <em>italic</em>
          </>
        }
        timestamp={PAST}
        isUser={false}
      />,
    );
    expect(screen.getByText("Bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });
});

describe("ChatMessage — isUser alignment branch", () => {
  it("uses end-alignment and primary bubble styling for user messages", () => {
    const { container } = render(
      <ChatMessage content="mine" timestamp={PAST} isUser={true} />,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("items-end");
    expect(wrapper.className).not.toContain("items-start");

    const bubble = container.querySelector(".rounded-2xl") as HTMLElement;
    expect(bubble.className).toContain("bg-primary");
    expect(bubble.className).toContain("text-primary-foreground");
    expect(bubble.className).toContain("ml-auto");
  });

  it("uses start-alignment and muted bubble styling for non-user messages", () => {
    const { container } = render(
      <ChatMessage content="theirs" timestamp={PAST} isUser={false} />,
    );
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.className).toContain("items-start");
    expect(wrapper.className).not.toContain("items-end");

    const bubble = container.querySelector(".rounded-2xl") as HTMLElement;
    expect(bubble.className).toContain("bg-muted");
    expect(bubble.className).toContain("text-foreground");
    expect(bubble.className).toContain("mr-auto");
  });

  it("applies shared bubble classes regardless of isUser", () => {
    for (const isUser of [true, false]) {
      const { container, unmount } = render(
        <ChatMessage content="x" timestamp={PAST} isUser={isUser} />,
      );
      const bubble = container.querySelector(".rounded-2xl") as HTMLElement;
      expect(bubble.className).toContain("rounded-2xl");
      expect(bubble.className).toContain("max-w-[85%]");
      expect(bubble.className).toContain("md:max-w-[70%]");
      expect(bubble.className).toContain("shadow-sm");
      unmount();
    }
  });
});

describe("ChatMessage — timestamp behavior", () => {
  it("shows the timestamp by default (showTimestamp omitted)", () => {
    render(<ChatMessage content="hi" timestamp={PAST} isUser={false} />);
    const expected = formatDistanceToNow(PAST, { addSuffix: true });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("shows the timestamp when showTimestamp is explicitly true", () => {
    render(
      <ChatMessage content="hi" timestamp={PAST} isUser={false} showTimestamp />,
    );
    const expected = formatDistanceToNow(PAST, { addSuffix: true });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("hides the timestamp when showTimestamp is false", () => {
    const { container } = render(
      <ChatMessage
        content="hi"
        timestamp={PAST}
        isUser={false}
        showTimestamp={false}
      />,
    );
    const expected = formatDistanceToNow(PAST, { addSuffix: true });
    expect(screen.queryByText(expected)).not.toBeInTheDocument();
    // No <span> timestamp node rendered.
    expect(container.querySelector("span")).toBeNull();
  });

  it("formats the timestamp with the relative 'ago' suffix", () => {
    render(<ChatMessage content="hi" timestamp={PAST} isUser={false} />);
    // PAST is far in the past, so date-fns appends 'ago'.
    expect(screen.getByText(/ago$/)).toBeInTheDocument();
  });

  it("right-aligns the timestamp margin for user messages", () => {
    const { container } = render(
      <ChatMessage content="hi" timestamp={PAST} isUser={true} />,
    );
    const span = container.querySelector("span") as HTMLElement;
    expect(span).not.toBeNull();
    expect(span.className).toContain("mr-2");
    expect(span.className).not.toContain("ml-2");
  });

  it("left-aligns the timestamp margin for non-user messages", () => {
    const { container } = render(
      <ChatMessage content="hi" timestamp={PAST} isUser={false} />,
    );
    const span = container.querySelector("span") as HTMLElement;
    expect(span).not.toBeNull();
    expect(span.className).toContain("ml-2");
    expect(span.className).not.toContain("mr-2");
  });

  it("handles a future timestamp without crashing", () => {
    const future = new Date(PAST.getTime() + 1000 * 60 * 60 * 24 * 365 * 100);
    render(<ChatMessage content="hi" timestamp={future} isUser={false} />);
    const expected = formatDistanceToNow(future, { addSuffix: true });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});

describe("ChatMessage — animation wiring", () => {
  it("passes initial='hidden' and animate='visible' to the motion wrapper", () => {
    render(<ChatMessage content="hi" timestamp={PAST} isUser={false} />);
    const wrapper = screen.getByTestId("motion-div");
    expect(wrapper.getAttribute("data-initial")).toBe("hidden");
    expect(wrapper.getAttribute("data-animate")).toBe("visible");
  });

  it("provides variants with hidden + visible states (normal motion)", () => {
    setReducedMotion(false);
    render(<ChatMessage content="hi" timestamp={PAST} isUser={false} />);
    const wrapper = screen.getByTestId("motion-div");
    const variants = JSON.parse(wrapper.getAttribute("data-variants") || "{}");
    expect(variants).toHaveProperty("hidden");
    expect(variants).toHaveProperty("visible");
    // messageEnter (full motion) animates the y axis.
    expect(variants.hidden).toHaveProperty("y");
  });

  it("provides simplified opacity-only variants when reduced motion is preferred", () => {
    setReducedMotion(true);
    render(<ChatMessage content="hi" timestamp={PAST} isUser={false} />);
    const wrapper = screen.getByTestId("motion-div");
    const variants = JSON.parse(wrapper.getAttribute("data-variants") || "{}");
    // getVariants() collapses to opacity-only when reduced motion is on.
    expect(variants.hidden).toEqual({ opacity: 0 });
    expect(variants.visible).toEqual({ opacity: 1 });
    expect(variants.hidden).not.toHaveProperty("y");
  });
});

describe("ChatMessage — structure", () => {
  it("renders a single bubble and (by default) a single timestamp span", () => {
    const { container } = render(
      <ChatMessage content="hi" timestamp={PAST} isUser={false} />,
    );
    expect(container.querySelectorAll(".rounded-2xl")).toHaveLength(1);
    expect(container.querySelectorAll("span")).toHaveLength(1);
  });

  it("nests the content inside the bubble inside the motion wrapper", () => {
    render(
      <ChatMessage
        content={<span data-testid="payload">deep</span>}
        timestamp={PAST}
        isUser={false}
      />,
    );
    const wrapper = screen.getByTestId("motion-div");
    const payload = screen.getByTestId("payload");
    expect(wrapper.contains(payload)).toBe(true);
  });
});
