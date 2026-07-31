import { createClient } from "@supabase/supabase-js";
const PUBLIC_SUPABASE_URL = "https://uavvrzessmalzfzujfjn.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_kcNPq_SuWfs_jk8sRPeF2w_fAmurzVw";
createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);
