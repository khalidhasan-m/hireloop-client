import { apiRequest } from "./client"; // Adjust path if client.js is in a different folder

// Same-origin backend proxy (see src/app/api/backend/[...path]/route.js).
// No NEXT_PUBLIC_ var: the server reads BACKEND_URL, the browser only calls /api/backend.
const BACKEND_URL = "/api/backend";

/**
 * Checks if the response content type is JSON
 */
function isJsonResponse(response) {
  const contentType = response.headers.get("content-type");
  return contentType && contentType.includes("application/json");
}

export const api = {
  // ==========================================
  // PUBLIC ROUTES (No Token Required)
  // ==========================================

  // Fetches all jobs for the homepage
  getAllActiveJobs: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/jobs`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      
      // Check if response is JSON before parsing
      if (!isJsonResponse(res)) {
        throw new Error("Server returned non-JSON response. Please ensure the backend API is running.");
      }
      
      return await res.json(); // Expected: { success: true, data: [...] }
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, data: [] };
    }
  },

  // Fetches a single job for the details page
  getJobById: async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/jobs/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      
      // Check if response is JSON before parsing
      if (!isJsonResponse(res)) {
        throw new Error("Server returned non-JSON response. Please ensure the backend API is running.");
      }
      
      return await res.json(); // Expected: { success: true, data: {...} }
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, data: null };
    }
  },

  // ==========================================
  // PROTECTED RECRUITER ROUTES (Token Required)
  // ==========================================

  // Fetch recruiter's own jobs
  getMyJobs: async (token) => {
    return apiRequest("GET", "/jobs/my", null, token);
  },

  // Create a new job
  createJob: async (jobData, token) => {
    return apiRequest("POST", "/jobs", jobData, token);
  },

  // Delete a job
  deleteJob: async (jobId, token) => {
    return apiRequest("DELETE", `/jobs/${jobId}`, null, token);
  },
};
