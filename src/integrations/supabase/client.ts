// src/integrations/supabase/client.ts
// FORCED REAL PROJECT + DEBUG MODE

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = 'https://buemdfyxhuxnzgdoqjn.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZW1kZnh5aHh1bnpwZ2RvcWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzQ5MzQsImV4cCI6MjA4MDc1MDkzNH0.u7MQmlz6HTt9Rrm99X9l6srVVdLqD7Yugi1UVGdxqR0'

// THIS LINE WILL PROVE WE ARE USING THE CORRECT FILE
console.log('Supabase client initialised for →', SUPABASE_URL)

// CACHE BUSTER — remove after it works
// v6-2025-12-12-force-real-project

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'mercy-blade-web',
    },
  },
})
