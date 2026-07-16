import { describe, expect, it, vi } from "vitest";
import {
  confirmAdultProfile,
  getAgeInYears,
  validateAdultConfirmation,
} from "../adultConfirmation";

function makeClient() {
  const eq = vi.fn(async () => ({ error: null }));
  const update = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ update }));
  return { client: { from }, from, update, eq };
}

describe("adult confirmation", () => {
  const now = new Date(Date.UTC(2026, 6, 15));

  it("calculates age from an ISO birth date", () => {
    expect(getAgeInYears("2008-07-15", now)).toBe(18);
    expect(getAgeInYears("2008-07-16", now)).toBe(17);
    expect(getAgeInYears("not-a-date", now)).toBeNull();
  });

  it("requires adult age and explicit attestation", () => {
    expect(
      validateAdultConfirmation({
        birthDateIso: "2008-07-15",
        attested: true,
        now,
      }),
    ).toEqual({ ok: true });
    expect(
      validateAdultConfirmation({
        birthDateIso: "2009-07-15",
        attested: true,
        now,
      }),
    ).toEqual({ ok: false, reason: "underage" });
    expect(
      validateAdultConfirmation({
        birthDateIso: "2008-07-15",
        attested: false,
        now,
      }),
    ).toEqual({ ok: false, reason: "not_attested" });
  });

  it("writes only profiles.is_adult_confirmed for a valid adult confirmation", async () => {
    const { client, from, update, eq } = makeClient();

    await expect(
      confirmAdultProfile({
        userId: "user-1",
        birthDateIso: "2000-01-01",
        attested: true,
        now,
        client,
      }),
    ).resolves.toEqual({ ok: true });

    expect(from).toHaveBeenCalledWith("profiles");
    expect(update).toHaveBeenCalledWith({ is_adult_confirmed: true });
    expect(eq).toHaveBeenCalledWith("id", "user-1");
  });

  it("does not write when the visitor is underage", async () => {
    const { client, update } = makeClient();

    await expect(
      confirmAdultProfile({
        userId: "user-1",
        birthDateIso: "2009-01-01",
        attested: true,
        now,
        client,
      }),
    ).resolves.toEqual({ ok: false, reason: "underage" });

    expect(update).not.toHaveBeenCalled();
  });
});
