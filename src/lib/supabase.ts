import { createClient } from "@supabase/supabase-js";

// These come from .env.local (git-ignored) and are safe to expose to the
// browser — the "publishable" key is Supabase's low-privilege public key
// (this used to be called the "anon key"). Real data protection comes from
// Row Level Security policies on the database, not from hiding this key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase environment variables. Check that .env.local has " +
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set.",
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
