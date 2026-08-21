const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
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
};
