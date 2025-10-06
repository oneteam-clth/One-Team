import { createClient, SupabaseClient } from '@supabase/supabase-js'


let client: SupabaseClient | null = null


export function getSupabase() {
if (!client) {
const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
client = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
}
return client
}