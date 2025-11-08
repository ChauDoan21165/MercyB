import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for managing admin roles
 * 
 * IMPORTANT: These functions should only be called by authenticated admin users.
 * The database has RLS policies that prevent unauthorized access.
 */

/**
 * Grant admin role to a user by their user ID
 * @param userId - The UUID of the user to grant admin access
 * @returns Promise with success/error status
 */
export async function grantAdminRole(userId: string) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Revoke admin role from a user by their user ID
 * @param userId - The UUID of the user to revoke admin access
 * @returns Promise with success/error status
 */
export async function revokeAdminRole(userId: string) {
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if a user has admin role
 * @param userId - The UUID of the user to check
 * @returns Promise with boolean indicating admin status
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Get all users with their role information
 * @returns Promise with array of users and their roles
 */
export async function getAllUsersWithRoles() {
  try {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*");
    
    if (profileError) throw profileError;

    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("*");
    
    if (roleError) throw roleError;

    return {
      success: true,
      data: profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || [],
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
