import { vi } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabaseMock";

export const supabaseMock = createSupabaseMock();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: supabaseMock,
}));