import { apiRequest } from "./client"; // Adjust path if client.js is in a different folder

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export const api = {
  // ==========================================
  // PUBLIC ROUTES (No Token Required)
  // ==========================================

  // Fetches all jobs for the homepage
  getAllActiveJobs: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/jobs`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
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
