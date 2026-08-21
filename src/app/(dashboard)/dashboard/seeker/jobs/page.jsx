"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { HiMagnifyingGlass, HiMapPin, HiBookmark, HiBriefcase } from "react-icons/hi2";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function SeekerBrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAllActiveJobs().catch(() => ({ data: [] }));
      setJobs(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        (j.title || "").toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) ||
        (j.category || "").toLowerCase().includes(q) ||
        (j.companyName || "").toLowerCase().includes(q),
    );
  }, [jobs, search]);

  const handleApply = (job) => { setSelectedJob(job); setCoverLetter(""); setCoverLetterFile(null); };
  const submitApplication = async (event) => {
    event.preventDefault();
    if (!selectedJob) return;
    try {
      setApplyingId(selectedJob._id);
      const token = await getToken();
      if (!token) { toast.error("Please log in to apply"); return; }
      let coverLetterValue = coverLetter.trim();
      if (coverLetterFile) {
        const uploaded = await api.uploadCoverLetter(coverLetterFile, token);
        coverLetterValue = uploaded?.data?.url || coverLetterValue;
      }
      await api.createApplication({ jobId: String(selectedJob._id), coverLetter: coverLetterValue || null }, token);
      toast.success("Application submitted!");
      setSelectedJob(null);
    } catch (err) { toast.error(err.message || "Failed to submit application"); }
    finally { setApplyingId(null); }
  };

  const handleSave = async (job) => {
    try {
      setSavingId(job._id);
      const token = await getToken();
      if (!token) {
        toast.error("Please log in to save jobs");
        return;
      }
      const res = await fetch(`${API}/saved-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ jobId: String(job._id) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save");
      toast.success("Job saved!");
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Browse Jobs
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Discover open roles and apply in one click.
        </p>
      </div>

      <div className="relative max-w-md">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search title, company, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0b0b0f] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500 text-sm animate-pulse">
          Loading jobs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-12 text-center text-gray-500 text-xs">
          No active jobs found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <div
              key={job._id}
              className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <HiBriefcase className="text-indigo-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{job.title}</h3>
                  {job.jobType && (
                    <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {job.jobType}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] text-gray-400">
                  {job.location && (
                    <span className="inline-flex items-center gap-1">
                      <HiMapPin className="text-[10px]" />
                      {job.location}
                    </span>
                  )}
                  {job.category && <span>{job.category}</span>}
                  {(job.salaryMin != null || job.salaryRange) && (
                    <span>
                      {job.salaryRange ||
                        `$${job.salaryMin || 0}k – $${job.salaryMax || "?"}k`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSave(job)}
                  disabled={savingId === job._id}
                  className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
                  title="Save job"
                >
                  <HiBookmark className="text-sm" />
                </button>
                <Link
                  href={`/jobs/${job._id}`}
                  className="px-3 py-2 rounded-xl border border-white/10 text-[11px] text-gray-300 hover:bg-white/5 transition"
                >
                  Details
                </Link>
                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  disabled={applyingId === job._id}
                  className="px-4 py-2 rounded-xl bg-white text-black text-[11px] font-bold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
                >
                  {applyingId === job._id ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="apply-job-title"><form onSubmit={submitApplication} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151519] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-widest text-indigo-400">Job application</p><h2 id="apply-job-title" className="mt-1 text-lg font-bold text-white">Apply for {selectedJob.title}</h2><p className="mt-1 text-xs text-gray-400">{selectedJob.companyName || "Hiring company"}</p></div><button type="button" aria-label="Close application dialog" onClick={() => setSelectedJob(null)} className="text-xl text-gray-400 hover:text-white">×</button></div><label className="mt-6 block text-xs font-medium text-gray-300">Cover letter<textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} rows={6} placeholder="Tell the hiring team why you are a strong fit..." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs text-white outline-none focus:border-indigo-400" /></label><label className="mt-4 block text-xs font-medium text-gray-300">Attach cover letter file <span className="text-gray-500">(PDF, DOC, DOCX, or TXT)</span><input type="file" accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(event) => setCoverLetterFile(event.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-dashed border-white/15 bg-white/[.03] p-3 text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black" />{coverLetterFile && <span className="mt-2 block text-[10px] text-indigo-300">Selected: {coverLetterFile.name}</span>}</label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setSelectedJob(null)} className="rounded-xl border border-white/10 px-4 py-2 text-xs text-gray-300 hover:bg-white/5">Cancel</button><button type="submit" disabled={applyingId === selectedJob._id || (!coverLetter.trim() && !coverLetterFile)} className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black disabled:opacity-50">{applyingId === selectedJob._id ? "Submitting…" : "Submit application"}</button></div></form></div>}
    </div>
  );
}
