// src/languages/thai/__tests__/thaiBusinessCustomerService.test.ts
//
// Guards for the Thai business / customer-service pack
// (businessCustomerService.ts): count, every required topic covered, Thai-with-
// bilingual-glosses on every item, a formal/casual caution everywhere, and a
// real register spread (service Thai leans formal, with a few flagged casual
// peer/internal lines).

import { describe, it, expect } from "vitest";
import customerServiceItems, {
  customerServiceItems as named,
  type ThaiCsItem,
} from "../businessCustomerService";

const THAI_RE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RE.test(s);

const REQUIRED_TOPICS = [
  "customer_complaint",
  "refund",
  "discount",
  "schedule_change",
  "delivery_issue",
  "supplier",
  "invoice",
  "polite_refusal",
  "escalation",
  "negotiation",
  "follow_up",
] as const;
const VALID_REGISTERS = new Set(["casual", "polite", "formal"]);

describe("Thai business/CS — wiring & coverage", () => {
  it("default and named exports are the same array", () => {
    expect(customerServiceItems).toBe(named);
    expect(Array.isArray(customerServiceItems)).toBe(true);
  });

  it("ships 50–100 items", () => {
    expect(customerServiceItems.length).toBeGreaterThanOrEqual(50);
    expect(customerServiceItems.length).toBeLessThanOrEqual(100);
  });

  it("every id is unique", () => {
    const ids = customerServiceItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic", () => {
    const seen = new Set(customerServiceItems.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) expect(seen.has(t)).toBe(true);
  });

  it("leans formal but includes a flagged casual item (register caution)", () => {
    const registers = customerServiceItems.map((i) => i.register);
    expect(registers.includes("formal")).toBe(true);
    expect(registers.includes("casual")).toBe(true);
  });
});

describe("Thai business/CS — every item is well-formed", () => {
  it.each(customerServiceItems.map((i) => [i.id, i] as const))(
    "%s has Thai, VI+EN glosses, a formal/casual note, and a valid register",
    (_id, item: ThaiCsItem) => {
      expect(hasThai(item.th)).toBe(true);
      expect(item.vi.trim().length).toBeGreaterThan(0);
      expect(item.en.trim().length).toBeGreaterThan(0);
      expect(item.note_vi.trim().length).toBeGreaterThan(0);
      expect(item.note_en.trim().length).toBeGreaterThan(0);
      expect(VALID_REGISTERS.has(item.register)).toBe(true);

      if (item.romanization !== undefined) {
        expect(item.romanization.trim().length).toBeGreaterThan(0);
        expect(hasThai(item.romanization)).toBe(false);
      }
    },
  );
});
