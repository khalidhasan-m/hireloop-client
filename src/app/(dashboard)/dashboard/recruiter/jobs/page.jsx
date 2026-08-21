"use client";

import React, { useState, useEffect, useCallback } from "react";
import { JobListTable } from "./_components/JobListTable";
import { CreateJobModal } from "./_components/CreateJobModal";
import { HiPlus, HiMagnifyingGlass } from "react-icons/hi2";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RecruiterJobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async () => {
    try {
      const { data } = await authClient.getSession();
      return data?.session?.token || null;
    } catch {
      return null;
    }
  };

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error("Please log in again.");
        return;
      }
      const response = await api.getMyJobs(token);
      setJobs(response?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your job postings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const handleCreateJob = async (newJobData) => {
    try {
      const token = await getAuthToken();
      const response = await api.createJob(newJobData, token);
      if (response?.success !== false) {
        toast.success("Job posted successfully!");
        setIsModalOpen(false);
        fetchMyJobs();
      } else {
        toast.error(response?.message || "Failed to create job.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while posting the job.");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      const token = await getAuthToken();
      await api.deleteJob(job._id, token);
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete job.");
    }
  };

  const handleCloseJob = async (job) => {
    try {
      const token = await getAuthToken();
      await api.closeJob(job._id, token);
      toast.success("Job closed.");
      fetchMyJobs();
    } catch (error) {
      toast.error(error.message || "Failed to close job.");
    }
  };

  const handleReopenJob = async (job) => {
    try {
      const token = await getAuthToken();
      await api.reopenJob(job._id, token);
      toast.success("Job reopened.");
      fetchMyJobs();
    } catch (error) {
      toast.error(error.message || "Failed to reopen job.");
    }
  };

  const handleViewApplicants = (job) => {
    router.push(`/dashboard/recruiter/applications?jobId=${job._id}`);
  };

  const filteredJobs = jobs.filter((job) =>
    (job.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
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

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
          Loading your job postings...
        </div>
      ) : (
        <JobListTable
          jobs={filteredJobs}
          onViewApplicants={handleViewApplicants}
          onDeleteJob={handleDeleteJob}
          onCloseJob={handleCloseJob}
          onReopenJob={handleReopenJob}
        />
      )}

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
