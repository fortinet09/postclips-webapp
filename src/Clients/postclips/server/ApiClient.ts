"use server";

import axios, { AxiosRequestConfig, Method } from "axios";

// Create an Axios instance for internal API requests
const apiClient = axios.create({
  baseURL: process.env.BACKEND_URL, // Use backend URL (DO NOT expose in NEXT_PUBLIC)
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Secure Server Action for making authenticated requests.
 * @param {Method} method - HTTP method (GET, POST, etc.)
 * @param {string} url - API endpoint
 * @param {any} data - Request body (optional)
 * @param {AxiosRequestConfig} config - Additional Axios config (optional)
 */
export const fetchAPI = async (
  accessToken: string,
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    // Attach Authorization header
    const headers = {
      ...config?.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    // Make API request
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
      headers,
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Could not fetch data");
  } catch (error: any) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
