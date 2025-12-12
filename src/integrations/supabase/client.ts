import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// IMPORTANT: correct project URL with "i"
const SUPABASE_URL = 'https://buemdfxyhxunzpgdoqin.supabase.co'

// This is your anon public key (safe to use in frontend)
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZW1kZnh5aHh1bnpwZ2RvcWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzQ5MzQsImV4cCI6MjA4MDc1MDkzNH0.u7MQmlz6HTt9Rrm99X9l6srVVdLqD7Yugi1UVGdxqR0'

console.log('SUPABASE CLIENT LOADED AT', new Date().toISOString())
console.log('USING SUPABASE URL →', SUPABASE_URL)
// CACHE BUSTER v1003-correct-i-url-and-ref

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
