"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/Clients/supabase/SupabaseClient";
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";

type UserRole = {
  role: string;
};

// Define types for context
interface AuthContextProps {
  session: Session | null;
  user: UserMetadata | null;
  userRoles: UserRole[];
  selectedRole: string;
  loading: boolean;
}

// Define user metadata structure
interface UserMetadata {
  avatar: string;
  avatarColor: string;
  email: string;
  sub: string;
  username: string;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  userRoles: [],
  selectedRole: "",
  loading: true,
});

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserMetadata | null>(null);
  const [userRoles, setUserRoles] = useState<[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser((session?.user?.user_metadata as UserMetadata) ?? null);
      }
    );

    // Fetch initial session and user data
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser((data.session?.user?.user_metadata as UserMetadata) ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe(); // Cleanup listener on unmount
    };
  }, []);

  useEffect(() => {
    // Fetch user roles when session is ready
    const fetchRoles = async () => {
      if (session?.user) {
        try {
          const data = await fetchAPI(
            session.access_token,
            "GET",
            "/auth/roles"
          );
          if (!data) {
            setUserRoles([]);
            return;
          }
          setUserRoles(data);
          const roleNames = data.map((r: { role: string }) => r.role);

          if (roleNames.includes("ADMIN")) {
            setSelectedRole("ADMIN");
          } else if (roleNames.includes("BRAND")) {
            setSelectedRole("BRAND");
          } else if (roleNames.includes("CLIPPER")) {
            setSelectedRole("CLIPPER");
          }
        } catch (error) {
          console.error("Failed to fetch roles:", error);
        }
      }
      setLoading(false);
    };

    fetchRoles();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, user, userRoles, selectedRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
