// Same-origin proxy → src/app/api/backend/[...path]/route.js forwards to BACKEND_URL.
// No NEXT_PUBLIC_ var needed: the browser never sees the real backend origin.
const API_BASE_URL = "/api/backend";

/**
 * Checks if the response content type is JSON
 */
function isJsonResponse(response) {
  const contentType = response.headers.get("content-type");
  return contentType && contentType.includes("application/json");
}

export async function apiRequest(method, endpoint, data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    credentials: "include", // <--- Crucial: Sends Better Auth cookies across ports
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Check if response is JSON before parsing
    if (!isJsonResponse(response)) {
      const text = await response.text();
      throw new Error(
        `Server returned non-JSON response (${response.status}). ` +
        `The backend API at ${API_BASE_URL}${endpoint} may not be running. ` +
        `Please ensure the server is started on port 5050.`
      );
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    throw error;
  }
}
