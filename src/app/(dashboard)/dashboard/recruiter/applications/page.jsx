"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { APPLICATION_STATUS_FLOW } from "@/lib/constants";
import { HiMagnifyingGlass, HiFunnel } from "react-icons/hi2";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  Applied: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Under Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Shortlisted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Offered: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecruiterApplicationsPage() {
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const jobsRes = await api.getMyJobs(token).catch(() => ({ data: [] }));
      const myJobs = jobsRes?.data || [];

      const targetJobs = jobIdFilter
        ? myJobs.filter((j) => j._id === jobIdFilter)
        : myJobs;

      const results = await Promise.all(
        targetJobs.map((job) =>
          api.getJobApplications(job._id, token).catch(() => ({ data: [] })),
        ),
      );

      const all = [];
      results.forEach((res, idx) => {
        const job = targetJobs[idx];
        (res?.data || []).forEach((app) => {
          all.push({
            ...app,
            jobTitle: job?.title || app.jobTitle || "Unknown Role",
            jobId: job?._id || app.jobId,
          });
        });
      });

      all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(all);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [jobIdFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const token = await getToken();
      await api.updateApplicationStatus(appId, newStatus, token);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a)),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const status = app.status || "Applied";
      if (statusFilter !== "All" && status !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (app.candidateName || "").toLowerCase().includes(q) ||
        (app.candidateEmail || "").toLowerCase().includes(q) ||
        (app.jobTitle || "").toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery, statusFilter]);

  const statusOptions = ["All", ...APPLICATION_STATUS_FLOW];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Applications</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Review and manage candidates who applied to your jobs.
          {jobIdFilter && <span className="text-indigo-400"> (filtered by job)</span>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0b0b0f] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <HiFunnel className="text-gray-500 text-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#0b0b0f] border border-white/10 text-xs text-white focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Candidate</th>
                <th className="py-3.5 px-5 font-semibold">Role</th>
                <th className="py-3.5 px-5 font-semibold">Applied</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500 animate-pulse">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500">No applications found.</td></tr>
              ) : (
                filtered.map((app) => {
                  const status = app.status || "Applied";
                  const style = STATUS_STYLES[status] || "bg-white/10 text-gray-300 border-white/20";
                  return (
                    <tr key={app._id} className="hover:bg-white/2 transition">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-white">{app.candidateName || "Candidate"}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{app.candidateEmail || "—"}</p>
                      </td>
                      <td className="py-4 px-5 text-gray-300">{app.jobTitle}</td>
                      <td className="py-4 px-5 text-gray-400">{formatDate(app.createdAt)}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style}`}>{status}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <select
                          value={status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="h-8 px-2 rounded-lg bg-[#08080c] border border-white/10 text-[11px] text-white focus:outline-none disabled:opacity-50 cursor-pointer"
                        >
                          {APPLICATION_STATUS_FLOW.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
