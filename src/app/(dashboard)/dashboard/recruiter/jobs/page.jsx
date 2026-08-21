"use client";

import React, { useState, useEffect } from "react";
import { JobListTable } from "./_components/JobListTable";
import { CreateJobModal } from "./_components/CreateJobModal";
import { HiPlus, HiMagnifyingGlass } from "react-icons/hi2";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function RecruiterJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get Better Auth token dynamically
  const getAuthToken = async () => {
    try {
      const { data } = await authClient.getSession();
      return (
        data?.session?.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken")
      );
    } catch {
      return localStorage.getItem("token") || localStorage.getItem("authToken");
    }
  };

  // Fetch recruiter's jobs on mount
  useEffect(() => {
    async function fetchMyJobs() {
      try {
        const token = await getAuthToken();
        const response = await api.getMyJobs(token);
        if (response && response.success) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch recruiter jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyJobs();
  }, []);

  const handleCreateJob = async (newJobData) => {
    try {
      const token = await getAuthToken();

      const response = await api.createJob(newJobData, token);
      console.log("Create Job Response:", response);

      const createdJob = response?.data || response;

      if (createdJob && response.success !== false) {
        setJobs([createdJob, ...jobs]);
        setIsModalOpen(false);
      } else {
        alert(response?.message || "Failed to create job. Check console.");
      }
    } catch (error) {
      console.error("Failed to create job error:", error);
      alert(
        "An error occurred while posting the job. Check console for details.",
      );
    }
  };

  const handleDeleteJob = async (job) => {
    try {
      const token = await getAuthToken();
      const response = await api.deleteJob(job._id, token);
      if (response && response.success) {
        setJobs(jobs.filter((j) => j._id !== job._id));
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Create Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Manage Jobs
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Create, monitor, and manage your active company job openings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
        >
          <HiPlus className="text-base font-bold" />
          Post New Job
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search job postings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0b0b0f] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Job Listings Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
          Loading your job postings...
        </div>
      ) : (
        <JobListTable
          jobs={filteredJobs}
          onViewApplicants={(job) =>
            console.log("View applicants for:", job.title)
          }
          onEditJob={(job) => console.log("Edit job:", job.title)}
          onDeleteJob={handleDeleteJob}
        />
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
