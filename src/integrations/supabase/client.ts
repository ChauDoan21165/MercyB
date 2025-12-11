// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// DIRECTLY point to the new Mercy Blade Real Supabase project
const SUPABASE_URL = 'https://buemdfyxhuxnzgdoqjn.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZW1kZnh5aHh1bnpwZ2RvcWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzQ5MzQsImV4cCI6MjA4MDc1MDkzNH0.u7MQmlz6HTt9Rrm99X9l6srVVdLqD7Yugi1UVGdxqR0'

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
