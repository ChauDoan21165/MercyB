import { supabase } from "@/integrations/supabase/client";

export type DiagnosticContactType = "email" | "zalo";

export type DiagnosticLeadInput = {
  contact: string;
  profileRef: string;
};

export type ParsedDiagnosticContact = {
  contact: string;
  contactType: DiagnosticContactType;
};

type DiagnosticLeadsTable = {
  from(table: "diagnostic_leads"): {
    insert(row: {
      contact: string;
      contact_type: DiagnosticContactType;
      profile_ref: string;
    }): Promise<{ error: { message?: string } | null }>;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZALO_RE = /^\+?[0-9][0-9 .-]{6,20}$/;

export function isDiagnosticContactGateEnabled(): boolean {
  return import.meta.env.VITE_DIAGNOSTIC_CONTACT_GATE === "true";
}

export function parseDiagnosticContact(value: string): ParsedDiagnosticContact | null {
  const contact = value.trim();
  if (!contact) return null;
  if (EMAIL_RE.test(contact)) return { contact, contactType: "email" };
  if (ZALO_RE.test(contact)) return { contact, contactType: "zalo" };
  return null;
}

export async function submitDiagnosticLead(input: DiagnosticLeadInput): Promise<void> {
  const parsed = parseDiagnosticContact(input.contact);
  if (!parsed) {
    throw new Error("Enter an email or Zalo phone number.");
  }

  const client = supabase as unknown as DiagnosticLeadsTable;
  const { error } = await client.from("diagnostic_leads").insert({
    contact: parsed.contact,
    contact_type: parsed.contactType,
    profile_ref: input.profileRef,
  });

  if (error) {
    throw new Error(error.message || "Could not save diagnostic contact.");
  }
}
