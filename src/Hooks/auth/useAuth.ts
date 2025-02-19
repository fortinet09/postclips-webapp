import { useEffect, useState } from "react";
import { supabase } from "@/Clients/supabase/SupabaseClient";
import { Session } from "@supabase/supabase-js";

interface UserMetadata {
  avatarColor: string;
  email: string;
  sub: string;
  username: string;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user?.user_metadata as any);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { session, user };
};
