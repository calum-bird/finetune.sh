import { AuthError } from "@supabase/supabase-js";
import { supabase } from "../clients/supabaseClient";

export function login(
  email: string,
  onSuccess: () => void,
  onError: (error: AuthError) => void
): void {
  void supabase.auth
    .signInWithOtp({
      email: email,
    })
    .then(({ error }) => (error != null ? onError(error) : onSuccess()));
}
