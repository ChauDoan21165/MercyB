// src/lib/referral/familyInviteTelemetry.ts
//
// Read-only stats for the inviter dashboard. RLS gates rows to the
// inviter's own — same primitive the bulk-invite UI uses to render
// "Bạn đã mời 8 người. 5 đã đăng ký. 2 đã trả phí."

import { supabase } from "@/lib/supabaseClient";

export interface FamilyInviteStats {
  total_invited: number;
  sent: number;
  clicked: number;
  signed_up: number;
  converted: number;
  failed: number;
  pending: number;
  revoked: number;
}

export async function loadFamilyInviteStats(
  userId: string,
): Promise<FamilyInviteStats> {
  const empty: FamilyInviteStats = {
    total_invited: 0,
    sent: 0,
    clicked: 0,
    signed_up: 0,
    converted: 0,
    failed: 0,
    pending: 0,
    revoked: 0,
  };
  if (!userId) return empty;

  const { data, error } = await supabase
    .from("family_invitations")
    .select("status")
    .eq("inviter_user_id", userId);
  if (error || !Array.isArray(data)) return empty;

  const stats: FamilyInviteStats = { ...empty };
  for (const row of data) {
    const status = (row as { status?: string }).status;
    stats.total_invited += 1;
    switch (status) {
      case "sent":
        stats.sent += 1;
        break;
      case "clicked":
        stats.clicked += 1;
        break;
      case "signed_up":
        stats.signed_up += 1;
        break;
      case "converted":
        stats.converted += 1;
        break;
      case "failed":
        stats.failed += 1;
        break;
      case "pending":
        stats.pending += 1;
        break;
      case "revoked":
        stats.revoked += 1;
        break;
      default:
        break;
    }
  }
  return stats;
}
