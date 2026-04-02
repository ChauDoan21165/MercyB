/**
 * EMERGENCY BREAK-GLASS ADMIN ACCESS SCRIPT
 * 
 * USE ONLY IN EMERGENCY:
 * - Lost admin access
 * - Need to restore system
 * - Database corruption
 * 
 * REQUIRES:
 * - SUPABASE_SERVICE_ROLE_KEY environment variable
 * - Owner email address
 * 
 * USAGE:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx OWNER_EMAIL=you@example.com tsx scripts/break-glass-admin.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://buemdfxyhxunzpgdoqin.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER_EMAIL = process.env.OWNER_EMAIL;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable required');
  process.exit(1);
}

if (!OWNER_EMAIL) {
  console.error('❌ OWNER_EMAIL environment variable required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function breakGlassAdmin() {
  console.log('🚨 EMERGENCY ADMIN ACCESS SCRIPT');
  console.log('================================\n');

  // 1. Find user by email
  console.log(`🔍 Looking up user: ${OWNER_EMAIL}`);
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('❌ Failed to list users:', userError);
    process.exit(1);
  }

  const user = users?.find(u => u.email === OWNER_EMAIL);
  
  if (!user) {
    console.error(`❌ User not found: ${OWNER_EMAIL}`);
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.id}`);

  // 2. Check if already admin
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (existingRole) {
    console.log('✅ User already has admin role');
    return;
  }

  // 3. Grant admin role
  console.log('🔧 Granting admin role...');
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: 'admin',
    });

  if (roleError) {
    console.error('❌ Failed to grant admin role:', roleError);
    process.exit(1);
  }

  console.log('✅ Admin role granted successfully');
  console.log('\n🎉 EMERGENCY ACCESS RESTORED');
  console.log('================================');
  console.log('You can now log in as admin.');
}

breakGlassAdmin().catch(console.error);