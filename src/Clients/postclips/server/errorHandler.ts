import { ErrorResponse } from "./ApiClient";
import { toast } from "react-toastify";

export const handleApiError = (error: any): string => {
  // Handle API response error
  if (error?.response?.data) {
    const apiError = error.response.data;
    const errorMessage = typeof apiError === 'string' 
      ? apiError 
      : apiError.error || apiError.message || "An error occurred";
    toast.error(errorMessage);
    return errorMessage;
  }

  // Handle our custom ApiResponse error
  if (typeof error === 'object' && 'error' in error) {
    const errorMessage = typeof error.error === 'string'
      ? error.error
      : error.error?.error || error.error?.message || "An error occurred";
    toast.error(errorMessage);
    return errorMessage;
  }

  // Handle general errors
  const errorMessage = error?.message || "An error occurred";
  toast.error(errorMessage);
  return errorMessage;
}; 