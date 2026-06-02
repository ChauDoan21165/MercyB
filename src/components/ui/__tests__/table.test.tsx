import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

describe("ui/Table", () => {
  function renderFullTable() {
    return render(
      <Table>
        <TableCaption>Fruit list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Apple</TableCell>
            <TableCell>Red</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Banana</TableCell>
            <TableCell>Yellow</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>2 fruits total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
  }

  it("renders a table element", () => {
    render(<Table data-testid="t" />);
    expect(screen.getByTestId("t").tagName).toBe("TABLE");
  });

  it("renders correct semantic elements", () => {
    const { container } = renderFullTable();
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(container.querySelector("thead")).toBeInTheDocument();
    expect(container.querySelector("tbody")).toBeInTheDocument();
    expect(container.querySelector("tfoot")).toBeInTheDocument();
    expect(container.querySelector("caption")).toBeInTheDocument();
  });

  it("renders table rows", () => {
    renderFullTable();
    const rows = screen.getAllByRole("row");
    // 1 header + 2 body + 1 footer = 4
    expect(rows.length).toBe(4);
  });

  it("renders column headers with columnheader role", () => {
    renderFullTable();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Color" })).toBeInTheDocument();
  });

  it("renders cell data", () => {
    renderFullTable();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Yellow")).toBeInTheDocument();
  });

  it("renders caption text", () => {
    renderFullTable();
    expect(screen.getByText("Fruit list")).toBeInTheDocument();
  });

  it("renders footer content", () => {
    renderFullTable();
    expect(screen.getByText("2 fruits total")).toBeInTheDocument();
  });

  it("Table has w-full class", () => {
    render(<Table data-testid="t2" />);
    expect(screen.getByTestId("t2").className).toContain("w-full");
  });

  it("TableRow has hover class", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="tr">
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("tr").className).toContain("hover:bg-muted");
  });

  it("TableHead has font-medium class", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead data-testid="th">H</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByTestId("th").className).toContain("font-medium");
  });

  it("TableCell has p-4 class", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="td">D</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("td").className).toContain("p-4");
  });

  it("accepts custom className on all subcomponents", () => {
    render(
      <Table className="custom-table" data-testid="ct">
        <TableHeader className="custom-header">
          <TableRow className="custom-row">
            <TableHead className="custom-head" data-testid="ch">H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="custom-cell" data-testid="cc">C</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("ct").className).toContain("custom-table");
    expect(screen.getByTestId("ch").className).toContain("custom-head");
    expect(screen.getByTestId("cc").className).toContain("custom-cell");
  });
});
