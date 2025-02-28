"use server";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";

// Function to get the Clerk.js auth token
export async function getAuthHeader() {
  const { getToken } = await auth();
  const template = "testing-template"; // Adjust the template if needed
  const token = await getToken({ template });
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// Create the axios instance with the base URL and default headers
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to dynamically set the authorization header on each request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the authorization header by calling the getAuthHeader function
    const authHeader = await getAuthHeader();

    // Attach the auth header to the request config
    if (authHeader?.headers?.Authorization) {
      config.headers["Authorization"] = authHeader.headers["Authorization"];
    }

    return config;
  },
  (error) => {
    // Handle any errors in the request interceptor
    return Promise.reject(error);
  }
);

export default axiosInstance;
