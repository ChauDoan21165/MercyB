import { supabase } from "@/lib/supabaseClient";

export const ADULT_CONFIRMATION_MIN_AGE = 18;

export type AdultConfirmationReason =
  | "missing_birth_date"
  | "invalid_birth_date"
  | "underage"
  | "not_attested"
  | "write_failed";

type AdultConfirmationValidation =
  | { ok: true }
  | { ok: false; reason: Exclude<AdultConfirmationReason, "write_failed"> };

type SupabaseProfilesUpdater = {
  from: (table: "profiles") => {
    update: (values: { is_adult_confirmed: true }) => {
      eq: (
        column: "id",
        value: string,
      ) => PromiseLike<{ error: { message?: string } | null }>;
    };
  };
};

function parseBirthDateParts(birthDateIso: string):
  | { year: number; month: number; day: number }
  | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function getAgeInYears(
  birthDateIso: string,
  now: Date = new Date(),
): number | null {
  const birth = parseBirthDateParts(birthDateIso);
  if (!birth) return null;

  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;
  const currentDay = now.getUTCDate();
  let age = currentYear - birth.year;
  if (
    currentMonth < birth.month ||
    (currentMonth === birth.month && currentDay < birth.day)
  ) {
    age -= 1;
  }
  return age;
}

export function validateAdultConfirmation({
  birthDateIso,
  attested,
  now = new Date(),
}: {
  birthDateIso: string;
  attested: boolean;
  now?: Date;
}): AdultConfirmationValidation {
  if (!birthDateIso) return { ok: false, reason: "missing_birth_date" };
  const age = getAgeInYears(birthDateIso, now);
  if (age === null) return { ok: false, reason: "invalid_birth_date" };
  if (age < ADULT_CONFIRMATION_MIN_AGE) {
    return { ok: false, reason: "underage" };
  }
  if (!attested) return { ok: false, reason: "not_attested" };
  return { ok: true };
}

export async function confirmAdultProfile({
  userId,
  birthDateIso,
  attested,
  now = new Date(),
  client,
}: {
  userId: string;
  birthDateIso: string;
  attested: boolean;
  now?: Date;
  client?: SupabaseProfilesUpdater;
}): Promise<
  | { ok: true }
  | { ok: false; reason: AdultConfirmationReason; message?: string }
> {
  const validation = validateAdultConfirmation({ birthDateIso, attested, now });
  if (!validation.ok) return validation;

  const profilesClient = client ?? (supabase as unknown as SupabaseProfilesUpdater);
  const { error } = await profilesClient
    .from("profiles")
    .update({ is_adult_confirmed: true })
    .eq("id", userId);

  if (error) {
    return {
      ok: false,
      reason: "write_failed",
      message: error.message ?? "Unable to update profile.",
    };
  }
  return { ok: true };
}
