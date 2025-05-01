"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import { Brand } from "@/Types/(postclips)/Brand";
import { toast } from "react-toastify";
import { handleApiError } from "@/Clients/postclips/server/errorHandler";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: UserMetadata | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  errorOtp: string | null;
  selectedRole: string | null;
  userRoles: string[];
  config: {
    direct_clips_posting: boolean;
    no_social_media_account_verification: boolean;
    upload_clip_option: boolean;
  } | null;
  signIn: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<{ token: string; user: UserMetadata } | void>;
  refreshUser: () => Promise<boolean>;
}

interface UserMetadata {
  avatar: string;
  email: string;
  phone?: string;
  name: string;
  user_metadata?: {
    name?: string;
    profile_picture?: string;
    sub?: string;
    email?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    role?: string;
    roles?: string[];
  };
  config?: {
    direct_clips_posting: boolean;
    no_social_media_account_verification: boolean;
    upload_clip_option: boolean;
  };
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  initialized: false,
  errorOtp: null,
  selectedRole: null,
  userRoles: [],
  config: null,
  signIn: async () => { },
  signOut: async () => { },
  verifyOtp: async () => { },
  refreshUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const hasInitialized = useRef(false);
  const [errorOtp, setErrorOtp] = useState<string | null>(null);
  const [user, setUser] = useState<UserMetadata | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [config, setConfig] = useState<{
    direct_clips_posting: boolean;
    no_social_media_account_verification: boolean;
    upload_clip_option: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const fetchUserConfig = async (authToken: string) => {
    try {
      const result = await fetchAPI("GET", "/config", undefined, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (result.success && result.data) {
        setConfig(result.data);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const result = await fetchAPI("GET", "/auth/verify-token");

      if (result.success && result.data) {
        const { user: userData } = result.data;
        setUser(userData);
        await fetchUserConfig(token!);
        return true;
      } else {
        handleApiError(result.error);
        return false;
      }
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    let isMounted = true;

    const setVariables = async () => {
      const storedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      const storedUserData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_data="))
        ?.split("=")[1];

      setToken(storedToken || null);
      const userData = storedUserData ? JSON.parse(decodeURIComponent(storedUserData)) : null;
      setUser(userData);

      if (storedToken) {
        try {
          // Fetch user roles
          const { data: rolesData, error: rolesError } = await fetchAPI("GET", "/auth/roles");
          if (rolesError) {
            handleApiError(rolesError);
          } else if (rolesData?.roles) {
            setUserRoles(rolesData.roles);
            // Set the primary role (assuming the first role is the primary one)
            if (rolesData.roles.length > 0) {
              setSelectedRole(rolesData.roles[0]);
            }
          }
          await fetchUserConfig(storedToken);
        } catch (error) {
          handleApiError(error);
        }
      }

      if (isMounted) {
        setLoading(false);
        setInitialized(true);
      }
    };

    setVariables();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    setErrorOtp(null);

    try {
      const result = await fetchAPI("POST", "/auth/login-web", { email });

      if (result.success && result.data) {
        const { token: newToken, user: userData } = result.data;
        
        document.cookie = `auth_token=${newToken}; path=/; max-age=2592000`;
        document.cookie = `user_data=${JSON.stringify(userData)}; path=/; max-age=2592000`;
        setToken(newToken);
        setUser(userData);
        
        toast.success("OTP sent successfully!");
        return { email, showVerification: true };
      } else {
        handleApiError(result.error);
        return null;
      }
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setErrorOtp(null);

    try {
      const result = await fetchAPI("POST", "/auth/verify-otp", { email, otp });

      if (result.success && result.data) {
        const { token: newToken, user: userData } = result.data;

        document.cookie = `auth_token=${newToken}; path=/; max-age=2592000`;
        document.cookie = `user_data=${JSON.stringify(userData)}; path=/; max-age=2592000`;
        setToken(newToken);
        setUser(userData);
        await fetchUserConfig(newToken);

        // Fetch user roles after successful verification
        const { data: rolesData, error: rolesError } = await fetchAPI("GET", "/auth/roles");
        if (rolesError) {
          handleApiError(rolesError);
        } else if (rolesData?.roles) {
          setUserRoles(rolesData.roles);
          // Set the primary role (assuming the first role is the primary one)
          if (rolesData.roles.length > 0) {
            const primaryRole = rolesData.roles[0];
            setSelectedRole(primaryRole);
            console.log("OTP Verified roles", rolesData.roles, "primary role", primaryRole);

            // Check user role and redirect accordingly
            if (primaryRole === 'ADMIN') {
              router.push('/admin/home');
            } else if (primaryRole === 'BRAND') {
              router.push('/brand/campaigns');
            } else {
              router.push('/');
            }
          }
        }

        toast.success("Login successful!");
        return { token: newToken, user: userData };
      } else {
        setErrorOtp("Incorrect verification code");
        handleApiError(result.error);
      }
    } catch (error) {
      setErrorOtp("Failed to verify code. Please try again.");
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const result = await fetchAPI("POST", "/auth/logout");

      if (result.success) {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setToken(null);
        setUser(null);
        setConfig(null);
        router.push("/login");
      } else {
        handleApiError(result.error);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initialized,
        errorOtp,
        selectedRole,
        userRoles,
        config,
        signIn,
        signOut,
        verifyOtp,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
