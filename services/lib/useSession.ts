import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../clients/supabaseClient";

export function getSessionOnce(
  onSuccess: (session: Session) => void,
  onError: (error: Error) => void
): void {
  void supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (session !== null) {
      onSuccess(session);
    } else {
      onError(Error(error?.message ?? "invalid session"));
    }
  });
}
// Gets the session and if the session updates will recall the function
export function getSession(
  onSuccess: (session: Session) => void,
  onError: (error: Error) => void
): void {
  getSessionOnce(onSuccess, onError);

  // for scenario 2, this will fire a SIGNED_IN event shortly after page load once the session has been loaded from the server.
  void supabase.auth.onAuthStateChange((event, session) => {
    console.log(`Supabase auth event: ${event}`);
    if (session !== null) {
      onSuccess(session);
    } else {
      onError(Error("Invalid session"));
    }
  });
}

export type ComponentSession = Session | "invalid" | "fetching";

export function useSession(): ComponentSession {
  const [session, setSession] = useState<ComponentSession>("fetching");
  useEffect(() => {
    getSession(
      (session) => setSession(session),
      () => {
        setSession("invalid");
      }
    );
  }, []);
  return session;
}
