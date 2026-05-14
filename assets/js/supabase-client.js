// assets/js/supabase-client.js
window.CAMINFO_SUPABASE_URL = "https://wrksctcpxmxyzbqjcsnn.supabase.co";
window.CAMINFO_SUPABASE_ANON_KEY = "sb_publishable_sPlKgTjyA00Sqay2jU98wg_tsFIbVcb";

window.caminfoSupabase = window.supabase.createClient(
  window.CAMINFO_SUPABASE_URL,
  window.CAMINFO_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);
