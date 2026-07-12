import { describe, expect, it } from "vitest";
import {
  compareToBaseline,
  parseFindingCounts,
} from "../run-scheduled-hardening-scan.mjs";

describe("run-scheduled-hardening-scan", () => {
  it("parses the scanner Finding counts line", () => {
    const parsed = parseFindingCounts("header\nFinding counts — A:0 B:2 C:0 J:1  (total 3)\n");
    expect(parsed).toEqual({
      checks: { A: 0, B: 2, C: 0, J: 1 },
      total: 3,
    });
  });

  it("fails only when a check exceeds the recorded baseline", () => {
    const baseline = { checks: { A: 0, B: 2, J: 1 }, total: 3 };
    expect(compareToBaseline({ checks: { A: 0, B: 2, J: 1 }, total: 3 }, baseline)).toEqual([]);
    expect(compareToBaseline({ checks: { A: 1, B: 2, J: 1 }, total: 4 }, baseline)).toEqual([
      "A:1>0",
      "total:4>3",
    ]);
  });
});
