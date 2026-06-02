import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

describe("ui/Pagination", () => {
  it("renders a <nav> with role=navigation and aria-label", () => {
    render(<Pagination data-testid="nav" />);
    const nav = screen.getByRole("navigation", { name: /pagination/i });
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe("NAV");
  });

  it("PaginationContent renders a <ul>", () => {
    render(
      <Pagination>
        <PaginationContent data-testid="list" />
      </Pagination>,
    );
    expect(screen.getByTestId("list").tagName).toBe("UL");
  });

  it("PaginationItem renders a <li>", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-testid="item" />
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByTestId("item").tagName).toBe("LI");
  });

  it("PaginationLink renders an <a> without aria-current by default", () => {
    render(<PaginationLink href="/2">2</PaginationLink>);
    const link = screen.getByRole("link", { name: "2" });
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("PaginationLink with isActive sets aria-current=page", () => {
    render(
      <PaginationLink href="/3" isActive>
        3
      </PaginationLink>,
    );
    const link = screen.getByRole("link", { name: "3" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("PaginationLink isActive applies outline variant class", () => {
    render(
      <PaginationLink href="/3" isActive data-testid="active">
        3
      </PaginationLink>,
    );
    expect(screen.getByTestId("active").className).toContain("border");
  });

  it("PaginationPrevious has accessible label and renders text", () => {
    render(<PaginationPrevious href="/1" />);
    const link = screen.getByRole("link", { name: /previous/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("aria-label", "Go to previous page");
  });

  it("PaginationNext has accessible label and renders text", () => {
    render(<PaginationNext href="/3" />);
    const link = screen.getByRole("link", { name: /next/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("aria-label", "Go to next page");
  });

  it("PaginationEllipsis is aria-hidden with sr-only text", () => {
    render(<PaginationEllipsis data-testid="ellipsis" />);
    const el = screen.getByTestId("ellipsis");
    expect(el).toHaveAttribute("aria-hidden");
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });

  it("accepts custom className and forwards it", () => {
    render(<Pagination className="my-custom" data-testid="nav2" />);
    expect(screen.getByTestId("nav2").className).toContain("my-custom");
  });

  it("renders a full pagination bar with correct structure", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/4" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next/i })).toBeInTheDocument();
  });
});
