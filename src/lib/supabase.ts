import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) || "";
const supabaseAnonKey = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — Supabase client will fail");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
