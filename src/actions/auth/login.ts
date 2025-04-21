import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import { handleApiError } from "@/Clients/postclips/server/errorHandler";
import { toast } from "react-toastify";

export const login = async (
  provider: "email" | "google" | "facebook" | "apple",
  email?: string
) => {
  try {
    if (provider === "email" && email) {
      // Email login
      const result = await fetchAPI("POST", "/auth/login", { email });
      
      if (result.success) {
        toast.success("OTP sent successfully! Please check your email.");
        return result.data;
      } else {
        throw new Error(handleApiError(result.error));
      }
    } else {
      // For OAuth providers, we'll need to handle them differently
      // as they require client-side redirects
      throw new Error("OAuth login not implemented yet");
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
