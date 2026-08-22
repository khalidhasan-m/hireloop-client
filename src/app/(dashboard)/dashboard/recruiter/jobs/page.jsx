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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    if (!deleteTarget) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape" && !deleting) setDeleteTarget(null); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteTarget, deleting]);

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

  const handleDeleteJob = (job) => setDeleteTarget(job);

  const confirmDeleteJob = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = await getAuthToken();
      await api.deleteJob(deleteTarget._id, token);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete job.");
    } finally {
      setDeleting(false);
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

      {deleteTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null); }}><div role="alertdialog" aria-modal="true" aria-labelledby="delete-job-title" aria-describedby="delete-job-description" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151519] p-6 shadow-2xl"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-400/10 text-rose-300">!</div><div><h2 id="delete-job-title" className="text-base font-semibold text-white">Delete job?</h2><p id="delete-job-description" className="mt-2 text-sm leading-6 text-gray-400">This permanently deletes <span className="font-medium text-gray-200">{deleteTarget.title || "this job"}</span> and cannot be undone.</p></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50">Cancel</button><button type="button" disabled={deleting} onClick={confirmDeleteJob} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50">{deleting ? "Deleting…" : "Delete Job"}</button></div></div></div>}
    </div>
  );
}
