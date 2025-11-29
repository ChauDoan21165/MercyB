import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuditEvent {
  type: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Log audit event to database
 * Use for tracking sensitive operations like payments, manual approvals, etc.
 */
export async function auditLog(event: AuditEvent): Promise<void> {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabaseAdmin.from('audit_logs').insert({
      type: event.type,
      user_id: event.user_id || null,
      metadata: event.metadata || {},
    });

    if (error) {
      console.error('Failed to write audit log:', error);
    }
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
