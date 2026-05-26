import { supabase } from "./supabaseClient";

export async function getMeEntitlement() {
  const { data, error } = await supabase.functions.invoke("me-entitlement", {
    method: "GET",
  });

  if (error) {
    console.error("me-entitlement failed:", error);
    throw error;
  }

  return data;
}