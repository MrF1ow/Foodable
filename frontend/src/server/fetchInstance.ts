"use server";

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

// Define a base URL for your API
const BASE_URL = "http://localhost:8000/api";

export async function fetchWithAuth(url: string, options = {}) {
  const authHeader = await getAuthHeader();

  const headers = {
    "Content-Type": "application/json",
    ...authHeader, // include the Authorization header dynamically
    ...options, // merge any additional headers passed in options
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...headers,
    ...options, // include the method, body, etc.
  });

  // Handle response
  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Network response was not ok: ${errorDetails}`);
  }
  return response.json();
}

export default fetchWithAuth;
