import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// ✅ FINAL CORRECT SUPABASE PROJECT URL
const SUPABASE_URL = 'https://buemdfxyhxunzpgdoqin.supabase.co'

// ✅ This is your anon public key (safe for frontend)
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZW1kZnh5aHh1bnpwZ2RvcWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzQ5MzQsImV4cCI6MjA4MDc1MDkzNH0.u7MQmlz6HTt9Rrm99X9l6srVVdLqD7Yugi1UVGdxqR0'

console.log('SUPABASE CLIENT LOADED AT', new Date().toISOString())
console.log('USING SUPABASE URL →', SUPABASE_URL)
// CACHE BUSTER v1011-clean-2

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
