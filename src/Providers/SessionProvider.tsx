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

  // Add a function to verify and refresh tokens if needed
  const verifyAndRefreshToken = useCallback(async () => {
    if (!session?.access_token || !session?.refresh_token) return;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'X-Refresh-Token': session.refresh_token
        }
      });

      // Check if response is ok before proceeding
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newAccessToken = response.headers.get('X-New-Access-Token');
      const newRefreshToken = response.headers.get('X-New-Refresh-Token');

      if (newAccessToken && newRefreshToken) {
        console.log('Received new tokens, updating session...');

        // Update session with new tokens
        const updatedSession = {
          ...session,
          access_token: newAccessToken,
          refresh_token: newRefreshToken
        };

        // Update supabase session first
        await supabase.auth.setSession({
          access_token: newAccessToken,
          refresh_token: newRefreshToken
        });

        // Then update local state
        setSession(updatedSession);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      // If we get an authentication error, trigger a logout
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      }
    }
  }, [session]);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Modify the token check interval to be more frequent
  useEffect(() => {
    if (!session) return;

    const checkTokenInterval = setInterval(() => {
      // Check token every 2 minutes regardless of activity
      verifyAndRefreshToken();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(checkTokenInterval);
  }, [session, verifyAndRefreshToken]);

  // Listen for window focus events
  useEffect(() => {
    const handleWindowFocus = () => {
      if (session) {
        verifyAndRefreshToken();
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [session, verifyAndRefreshToken]);

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
      if (session?.user && !rolesFetched) {
        try {
          const data = await fetchAPI(
            session.access_token,
            "GET",
            "/auth/roles"
          );
          console.log("fetching roles 3", { data });
          if (!data) {
            setUserRoles([]);
            return;
          }

          setUserRoles(data?.roles ?? []);
          setBrand(data?.brand ?? null);
          setPermissions(data?.permissions![0] ?? "");

          const roleNames = data?.roles ?? [];

          if (roleNames.includes("ADMIN")) {
            setSelectedRole("ADMIN");
          } else if (roleNames.includes("BRAND")) {
            setSelectedRole("BRAND");
          } else if (roleNames.includes("CLIPPER")) {
            setSelectedRole("CLIPPER");
          }
        } catch (error) {
          console.log("Failed to fetch roles:", error);
        } finally {
          setRolesFetched(true);
        }
      }
      setLoading(false);
    };
    fetchRoles();
  }, [session, rolesFetched]);

  return (
    <AuthContext.Provider
      value={{ session, user, userRoles, selectedRole, loading, brand, permissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};
