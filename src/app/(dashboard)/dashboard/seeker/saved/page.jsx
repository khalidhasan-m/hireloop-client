"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { HiBookmark, HiClock, HiMapPin, HiCurrencyDollar } from "react-icons/hi2";
import toast from "react-hot-toast";

function relativeTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (hours < 24) return `Saved ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days === 1) return "Saved yesterday";
  return `Saved ${days} days ago`;
}

export default function SavedJobsPage() {
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"}/saved-jobs/my`,
          { headers: { Authorization: `Bearer ${token}` }, credentials: "include" },
        );
        if (res.ok) {
          const json = await res.json();
          setSavedJobs(json?.data || []);
        }
      } catch {
        setSavedJobs([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (savedId) => {
    try {
      const token = await getToken();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"}/saved-jobs/${savedId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, credentials: "include" },
      );
      setSavedJobs((prev) => prev.filter((j) => j._id !== savedId));
      toast.success("Removed from saved jobs");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const categories = ["All Saved", "Design", "Engineering", "Product"];
  const closingSoon = savedJobs.filter((j) => {
    if (!j.deadline) return false;
    const days = (new Date(j.deadline) - new Date()) / 86400000;
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Saved Jobs</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage and track your bookmarked opportunities.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 px-4 py-3 text-center min-w-[90px]">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1"><HiBookmark className="text-indigo-400" /> Total Saved</p>
            <p className="text-xl font-bold text-white mt-0.5">{loading ? "…" : savedJobs.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 px-4 py-3 text-center min-w-[90px]">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1"><HiClock className="text-amber-400" /> Closing Soon</p>
            <p className="text-xl font-bold text-white mt-0.5">{loading ? "…" : closingSoon}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat === "All Saved" ? "all" : cat.toLowerCase())}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-medium border transition cursor-pointer ${
                (filter === "all" && cat === "All Saved") || filter === cat.toLowerCase()
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-gray-400 border-white/10 hover:text-white"
              }`}>{cat}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span>Sort by:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-[#0b0b0f] border border-white/10 rounded-lg px-2 py-1 text-white text-[11px] focus:outline-none">
            <option value="recent">Recently Saved</option>
            <option value="deadline">Closing Soon</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-12 text-center text-gray-500 text-xs animate-pulse">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-12 text-center text-gray-500 text-xs">
            No saved jobs yet. Browse jobs and bookmark the ones you like!
            <div className="mt-4">
              <Link href="/dashboard/seeker/jobs" className="inline-flex px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition">Browse Jobs</Link>
            </div>
          </div>
        ) : (
          savedJobs.map((job) => {
            const isClosed = job.status === "closed";
            return (
              <div key={job._id} className={`rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isClosed ? "opacity-60" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-gray-400">{(job.companyName || "J")[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{job.title || "Untitled Job"}</h3>
                    {job.companyName && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">{job.companyName}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        <HiMapPin className="text-[10px]" />{job.location}
                      </span>
                    )}
                    {(job.salaryMin || job.salaryRange) && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        <HiCurrencyDollar className="text-[10px]" />
                        {job.salaryRange || `$${job.salaryMin || 0}k - $${job.salaryMax || 0}k`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] ${isClosed ? "text-red-400" : "text-gray-500"}`}>
                    {isClosed ? "Closed" : relativeTime(job.savedAt || job.createdAt)}
                  </span>
                  {isClosed ? (
                    <button onClick={() => handleRemove(job._id)} className="px-3 py-1.5 rounded-xl text-[11px] font-medium text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer">Remove from List</button>
                  ) : (
                    <Link href={job.jobId ? `/jobs/${job.jobId}` : `/jobs/${job._id}`} className="px-4 py-1.5 rounded-xl text-[11px] font-bold bg-white text-black hover:bg-gray-200 transition">Apply Now</Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
