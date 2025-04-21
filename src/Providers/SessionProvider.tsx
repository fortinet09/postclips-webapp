"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/Clients/supabase/SupabaseClient";
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import { Brand } from "@/Types/(postclips)/Brand";

type UserRole = {
  role: string;
};

// Define types for context
interface AuthContextProps {
  session: Session | null;
  user: UserMetadata | null;
  userRoles: UserRole[];
  selectedRole: string;
  brand: Brand | null;
  permissions: string;
  loading: boolean;
  token: string | null;
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
  brand: null,
  permissions: "",
  loading: true,
  token: null,
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
  const [brand, setBrand] = useState<Brand | null>(null);
  const [permissions, setPermissions] = useState<string>("");
  const [rolesFetched, setRolesFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize token from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const storedToken = getCookie("auth_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Fetch user roles when token is available
    const fetchRoles = async () => {
      if (token && !rolesFetched) {
        try {
          const { data, error } = await fetchAPI(
            "GET",
            "/auth/roles"
          );
          if (!data) {
            setUserRoles([]);
            return;
          }

          setUserRoles(data?.roles ?? []);
          setBrand(data?.brand ?? null);
          setPermissions(data?.permissions ? data?.permissions[0] : "");

          const roleNames = data?.roles ?? [];

          if (roleNames.includes("ADMIN")) {
            setSelectedRole("ADMIN");
          } else if (roleNames.includes("BRAND")) {
            setSelectedRole("BRAND");
          } else if (roleNames.includes("CLIPPER")) {
            setSelectedRole("CLIPPER");
          }
        } catch (error: any) {
          console.log("Failed to fetch roles:", error);
          if (error.message === "UNAUTHORIZED") {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }
        } finally {
          setRolesFetched(true);
        }
      }
      setLoading(false);
    };
    fetchRoles();
  }, [token, rolesFetched]);

  return (
    <AuthContext.Provider
      value={{ session, user, userRoles, selectedRole, loading, brand, permissions, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
