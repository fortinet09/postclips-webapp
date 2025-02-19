import { supabase } from "@/Clients/supabase/SupabaseClient";
import { Provider } from "@supabase/supabase-js";

export const login = async (
  provider: "email" | "google" | "facebook" | "apple",
  email?: string
) => {
  try {
    let result;
    if (provider === "email" && email) {
      // Email login
      result = await supabase.auth.signInWithOtp({ email });
    } else {
      // OAuth login
      result = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
      });
    }

    if (result.error) {
      throw result.error;
    }

    return result.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
