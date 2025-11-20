import { supabase } from "@/integrations/supabase/client";

/**
 * Admin utility functions for user management
 * IMPORTANT: These functions should only be called by authenticated admin users.
 */

/**
 * Get all users with their subscription and payment info
 */
export async function getAllUsersWithDetails() {
  try {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (profileError) throw profileError;

    const { data: subscriptions, error: subError } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        subscription_tiers (name, name_vi)
      `);
    
    if (subError) throw subError;

    const { data: transactions, error: txError } = await supabase
      .from("payment_transactions")
      .select("user_id, amount");
    
    if (txError) throw txError;

    const { data: sessions, error: sessionError } = await supabase
      .from("user_sessions")
      .select("user_id, last_activity")
      .order("last_activity", { ascending: false });
    
    if (sessionError) throw sessionError;

    // Calculate total paid and last active for each user
    const usersWithDetails = profiles?.map(profile => {
      const userSub = subscriptions?.find(s => s.user_id === profile.id && s.status === 'active');
      const userTxs = transactions?.filter(t => t.user_id === profile.id) || [];
      const totalPaid = userTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
      const lastSession = sessions?.find(s => s.user_id === profile.id);
      
      return {
        ...profile,
        tier: userSub?.subscription_tiers?.name || 'Free',
        totalPaid,
        lastActive: lastSession?.last_activity || profile.created_at,
        subscriptionId: userSub?.id,
        currentPeriodEnd: userSub?.current_period_end,
      };
    }) || [];

    return { success: true, data: usersWithDetails };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get detailed user information including transactions, notes, and top rooms
 */
export async function getUserDetail(userId: string) {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (profileError) throw profileError;

    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        subscription_tiers (*)
      `)
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    
    if (subError) throw subError;

    const { data: transactions, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (txError) throw txError;

    const { data: notes, error: notesError } = await supabase
      .from("user_notes")
      .select(`
        *,
        profiles!user_notes_admin_id_fkey(username, full_name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (notesError) throw notesError;

    const { data: roomUsage, error: roomError } = await supabase
      .from("room_usage_analytics")
      .select("room_id, messages_sent, time_spent_seconds")
      .eq("user_id", userId);
    
    if (roomError) throw roomError;

    // Aggregate room usage
    const roomStats = roomUsage?.reduce((acc: any, usage) => {
      if (!acc[usage.room_id]) {
        acc[usage.room_id] = { messages: 0, timeSpent: 0 };
      }
      acc[usage.room_id].messages += usage.messages_sent || 0;
      acc[usage.room_id].timeSpent += usage.time_spent_seconds || 0;
      return acc;
    }, {});

    const topRooms = Object.entries(roomStats || {})
      .map(([roomId, stats]: [string, any]) => ({
        roomId,
        messages: stats.messages,
        timeSpent: stats.timeSpent,
      }))
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 5);

    return {
      success: true,
      data: {
        profile,
        subscription,
        transactions,
        notes,
        topRooms,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Add bonus days to a user's subscription
 */
export async function addBonusDays(userId: string, days: number, reason: string) {
  try {
    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    
    if (subError) throw subError;
    if (!subscription) throw new Error("No active subscription found");

    const currentEnd = new Date(subscription.current_period_end || Date.now());
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);

    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({ current_period_end: newEnd.toISOString() })
      .eq("id", subscription.id);
    
    if (updateError) throw updateError;

    // Log the bonus as a transaction
    const { error: txError } = await supabase
      .from("payment_transactions")
      .insert({
        user_id: userId,
        tier_id: subscription.tier_id,
        amount: 0,
        payment_method: "admin_bonus",
        transaction_type: "bonus",
        period_days: days,
        status: "completed",
        metadata: { reason },
      });
    
    if (txError) throw txError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Change a user's subscription tier
 */
export async function changeUserTier(userId: string, tierId: string, days: number) {
  try {
    const periodEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const { data: existing, error: checkError } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    
    if (checkError) throw checkError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          tier_id: tierId,
          current_period_end: periodEnd.toISOString(),
        })
        .eq("id", existing.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: userId,
          tier_id: tierId,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
        });
      
      if (insertError) throw insertError;
    }

    // Log the tier change
    const { error: txError } = await supabase
      .from("payment_transactions")
      .insert({
        user_id: userId,
        tier_id: tierId,
        amount: 0,
        payment_method: "admin_change",
        transaction_type: "tier_change",
        period_days: days,
        status: "completed",
      });
    
    if (txError) throw txError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate an access code for a specific user
 */
export async function generateCodeForUser(
  userId: string,
  tierId: string,
  days: number,
  maxUses: number = 1,
  notes?: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: tier, error: tierError } = await supabase
      .from("subscription_tiers")
      .select("name")
      .eq("id", tierId)
      .single();
    
    if (tierError) throw tierError;

    const tierShort = tier.name.replace("VIP", "").replace(" ", "").toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `MB-${tierShort}-${days}-${random}`;

    const { error } = await supabase
      .from("access_codes")
      .insert({
        code,
        tier_id: tierId,
        days,
        max_uses: maxUses,
        created_by: user.id,
        for_user_id: userId,
        notes: notes || `Generated for user ${userId}`,
      });

    if (error) throw error;

    return { success: true, code };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Add a note about a user
 */
export async function addUserNote(userId: string, note: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("user_notes")
      .insert({
        user_id: userId,
        admin_id: user.id,
        note,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
