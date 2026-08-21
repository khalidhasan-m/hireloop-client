import { apiRequest } from "./client";

export const api = {
  // ==================== COMPANIES ====================
  createCompany: (data, token) => apiRequest("POST", "/companies", data, token),
  getMyCompany: (token) => apiRequest("GET", "/companies/my", null, token),
  updateMyCompany: (id, data, token) =>
    apiRequest("PATCH", `/companies/${id}`, data, token),
  getCompanies: (industry) => apiRequest("GET", `/companies${industry && industry !== "all" ? `?industry=${encodeURIComponent(industry)}` : ""}`),
  getCompanyById: (id) => apiRequest("GET", `/companies/${id}`),
  getProfile: (token) => apiRequest("GET", "/profile/me", null, token),
  updateProfile: (data, token) => apiRequest("PATCH", "/profile/me", data, token),
  uploadFile: async (path, file, token) => { const form = new FormData(); form.append("file", file); const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"}${path}`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, credentials: "include", body: form }); const json = await response.json(); if (!response.ok) throw new Error(json.message || "Upload failed"); return json; },
  uploadResume: (file, token) => api.uploadFile("/uploads/resume", file, token),
  uploadAvatar: (file, token) => api.uploadFile("/uploads/avatar", file, token),
  uploadCompanyLogo: (id, file, token) => api.uploadFile(`/uploads/company-logo/${id}`, file, token),
  getNotifications: (token) => apiRequest("GET", "/notifications", null, token),
  getInterviews: (token) => apiRequest("GET", "/interviews/my", null, token),
  scheduleInterview: (data, token) => apiRequest("POST", "/interviews", data, token),
  cancelInterview: (id, token) => apiRequest("PATCH", `/interviews/${id}/cancel`, null, token),

  // ==================== JOBS ====================
  createJob: (data, token) => apiRequest("POST", "/jobs", data, token),
  getAllActiveJobs: () => apiRequest("GET", "/jobs"),
  getJobById: (id) => apiRequest("GET", `/jobs/${id}`),
  getMyJobs: (token) => apiRequest("GET", "/jobs/my", null, token),
  updateJob: (id, data, token) =>
    apiRequest("PATCH", `/jobs/${id}`, data, token),
  deleteJob: (id, token) => apiRequest("DELETE", `/jobs/${id}`, null, token),
  closeJob: (id, token) =>
    apiRequest("PATCH", `/jobs/${id}/close`, null, token),
  reopenJob: (id, token) =>
    apiRequest("PATCH", `/jobs/${id}/reopen`, null, token),

  // ==================== APPLICATIONS ====================
  createApplication: (data, token) =>
    apiRequest("POST", "/applications", data, token),
  getMyApplications: (token) =>
    apiRequest("GET", "/applications/my", null, token),
  getJobApplications: (jobId, token) =>
    apiRequest("GET", `/applications/job/${jobId}`, null, token),
  updateApplicationStatus: (id, status, token) =>
    apiRequest("PATCH", `/applications/${id}/status`, { status }, token),
};
