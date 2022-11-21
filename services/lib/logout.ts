import { supabase } from "../clients/supabaseClient";

export function logout(): void {
  void supabase.auth.signOut();
}
