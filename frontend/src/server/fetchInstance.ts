"use server";


// Function to get the Clerk.js auth token
export async function getAuthHeader() {
  const { auth } = await import("@clerk/nextjs/server");
  const { getToken } = await auth();
  const token = await getToken({ template: "testing-template" });
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable");
}

export async function fetchWithAuth(url: string, options = {}) {
  const authHeader = await getAuthHeader();

  const headers = {
    "Content-Type": "application/json",
    ...authHeader, // include the Authorization header dynamically
    ...options, // merge any additional headers passed in options
  };

  const response = await fetch(`${baseUrl}${url}`, {
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
