import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// embla-carousel calls window.matchMedia and IntersectionObserver — stub both
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

if (!("IntersectionObserver" in window)) {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

describe("Carousel", () => {
  function renderCarousel() {
    return render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious data-testid="prev-btn" />
        <CarouselNext data-testid="next-btn" />
      </Carousel>
    );
  }

  it("renders carousel content", () => {
    renderCarousel();
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
  });

  it("renders previous and next navigation buttons", () => {
    renderCarousel();
    expect(screen.getByTestId("prev-btn")).toBeInTheDocument();
    expect(screen.getByTestId("next-btn")).toBeInTheDocument();
  });

  it("has aria-roledescription=carousel on root region", () => {
    renderCarousel();
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("prev/next buttons have aria-labels", () => {
    renderCarousel();
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("CarouselItem renders with role=group", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem data-testid="slide">Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    const item = screen.getByTestId("slide");
    expect(item).toHaveAttribute("role", "group");
  });

  it("CarouselContent renders as a flex container", () => {
    renderCarousel();
    const content = document.querySelector("[class*='flex']");
    expect(content).toBeInTheDocument();
  });

  it("forwards custom className on CarouselItem", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem className="my-slide" data-testid="slide">S</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(screen.getByTestId("slide").className).toContain("my-slide");
  });
});
