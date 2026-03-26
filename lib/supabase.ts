import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return url;
}

function getAnonKey(): string {
  // Support both the legacy ANON_KEY and the newer PUBLISHABLE_DEFAULT_KEY naming
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!key)
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is not set"
    );
  return key;
}

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(getSupabaseUrl(), getAnonKey());
  }
  return _supabase;
}

export function createServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(getSupabaseUrl(), serviceKey);
}

// Kept for convenience in client components
export const supabase = {
  from: (...args: Parameters<SupabaseClient["from"]>) =>
    getSupabase().from(...args),
};

export type Registration = {
  id: string;
  clerk_user_id: string;
  email: string;
  created_at: string;
  // Attribution (added in migration 002)
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  ref?: string | null;
  source_type?: "Paid" | "Referral" | "Organic" | null;
  source_detail?: string | null;
};

export type Order = {
  id: string;
  clerk_user_id: string;
  stripe_session_id: string;
  price_id: string;
  tier: "basic" | "pro";
  amount_eur: number;
  status: "pending" | "paid";
  created_at: string;
};
