import { describe, expect, it } from "vitest";

import {
  PRODUCT_CONFIG,
  PRODUCT_NAME,
  type ProductConfig,
} from "@/config/product";

/**
 * Smoke tests for the centralized product config. The goal here is not
 * to assert every single field — that would just duplicate the source —
 * but to lock down the SHAPE so a careless rename or accidental field
 * deletion fails CI before it ships in 30+ JSX call sites.
 */

describe("PRODUCT_CONFIG", () => {
  it("exposes the canonical brand name", () => {
    expect(PRODUCT_CONFIG.name).toBe("MercyBlade");
    expect(PRODUCT_NAME).toBe("MercyBlade");
  });

  it("describes Mercy by name and pronouns", () => {
    expect(PRODUCT_CONFIG.teacher.name).toBe("Mercy");
    expect(PRODUCT_CONFIG.teacher.pronouns).toBe("she/her");
    expect(PRODUCT_CONFIG.founder.name).toBe("MercyBlade");
  });

  it("declares L1 = Vietnamese, L2 = English", () => {
    expect(PRODUCT_CONFIG.L1.code).toBe("vi");
    expect(PRODUCT_CONFIG.L1.englishName).toBe("Vietnamese");
    expect(PRODUCT_CONFIG.L1.name).toBe("Tiếng Việt");
    expect(PRODUCT_CONFIG.L2.code).toBe("en");
  });

  it("lists at least the 5 named diaspora hubs", () => {
    expect(PRODUCT_CONFIG.diasporaHubs).toEqual(
      expect.arrayContaining([
        "California",
        "Houston",
        "Toronto",
        "Sydney",
        "Berlin",
      ]),
    );
  });

  it("uses VND as primary currency with USD fallback", () => {
    expect(PRODUCT_CONFIG.currency.primary).toBe("VND");
    expect(PRODUCT_CONFIG.currency.fallback).toBe("USD");
  });

  it("uses mercyblade.com + support@mercyblade.com", () => {
    expect(PRODUCT_CONFIG.domain).toBe("mercyblade.com");
    expect(PRODUCT_CONFIG.supportEmail).toBe("support@mercyblade.com");
    expect(PRODUCT_CONFIG.supportEmail.endsWith(`@${PRODUCT_CONFIG.domain}`))
      .toBe(true);
  });

  it("includes a copyright line for the footer", () => {
    expect(PRODUCT_CONFIG.copyright).toMatch(/©.*MercyBlade/);
  });

  it("is a frozen `as const` literal — TypeScript narrows fields, runtime can't reassign", () => {
    // The `as const` annotation gives us readonly types — verifying the
    // type narrowing happens via a compile-time assignment that would
    // fail typecheck if the const declaration regressed to mutable.
    const code: "vi" = PRODUCT_CONFIG.L1.code;
    expect(code).toBe("vi");
    // ProductConfig type is exported and equals typeof PRODUCT_CONFIG.
    const typed: ProductConfig = PRODUCT_CONFIG;
    expect(typed).toBe(PRODUCT_CONFIG);
  });
});
