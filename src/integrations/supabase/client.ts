import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// ✅ Your correct Supabase project URL
const SUPABASE_URL = 'https://buemdfyxhuxnzgdoqjn.supabase.co'

// ⚠️ IMPORTANT: Use your actual public anon key (publishable key)
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZW1kZnh5aHh1bnpnZG9xam4iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2NTE3NDkzNCwiZXhwIjoyMDgwNzUwOTM0fQ.u7MQmlz6HTt9Rrm99X9l6srVVdLqD7Yugi1UVGdxqR0'

// Debug logs — helps verify at runtime
console.log('SUPABASE CLIENT LOADED AT', new Date().toISOString())
console.log('USING SUPABASE URL →', SUPABASE_URL)

// Cache buster to force rebuild (manual version tag)
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
