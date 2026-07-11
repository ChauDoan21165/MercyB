import { describe, expect, it } from "vitest";

import { parseDiagnosticContact } from "@/lib/diagnosticLeads";

describe("diagnostic lead contact parsing", () => {
  it("classifies email contacts", () => {
    expect(parseDiagnosticContact(" learner@example.com ")).toEqual({
      contact: "learner@example.com",
      contactType: "email",
    });
  });

  it("classifies Zalo phone contacts", () => {
    expect(parseDiagnosticContact("+84 912 345 678")).toEqual({
      contact: "+84 912 345 678",
      contactType: "zalo",
    });
  });

  it("rejects unsupported contact strings", () => {
    expect(parseDiagnosticContact("not a contact")).toBeNull();
  });
});
