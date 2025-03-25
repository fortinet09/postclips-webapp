"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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
      
      const data = await response.json();
      
      if (data.refreshed && data.newAccessToken && data.newRefreshToken) {
        // Update session with new tokens
        const updatedSession = {
          ...session,
          access_token: data.newAccessToken,
          refresh_token: data.newRefreshToken
        };
        setSession(updatedSession);
        
        // Update supabase session
        await supabase.auth.setSession({
          access_token: data.newAccessToken,
          refresh_token: data.newRefreshToken
        });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
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
  
  // Periodically check token when user is active
  useEffect(() => {
    if (!session) return;
    
    const checkTokenInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      
      // If user has been active in the last 5 minutes, check token
      if (inactiveTime < 5 * 60 * 1000) {
        verifyAndRefreshToken();
      }
    }, 4 * 60 * 1000); // Check every 4 minutes
    
    return () => clearInterval(checkTokenInterval);
  }, [session, lastActivity, verifyAndRefreshToken]);

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
          console.log("fetching roles 2", {
            accessToken: session.access_token,
            rolesFetched,
          });
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
          console.log("Failed to fetch roles:", error);
        } finally {
          setRolesFetched(true);
        }
      }
      setLoading(false);
    };

    console.log("fetching roles 1", {
      accessToken: session?.access_token,
    });
    fetchRoles();
  }, [session, rolesFetched]);

  return (
    <AuthContext.Provider
      value={{ session, user, userRoles, selectedRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
