import { apiRequest } from "./client";

export const api = {
  // ==================== COMPANIES ====================
  createCompany: (data, token) => apiRequest("POST", "/companies", data, token),
  getMyCompany: (token) => apiRequest("GET", "/companies/my", null, token),
  updateMyCompany: (id, data, token) =>
    apiRequest("PATCH", `/companies/${id}`, data, token),
  getCompanyById: (id) => apiRequest("GET", `/companies/${id}`),

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
