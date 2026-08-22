"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HiMagnifyingGlass,
  HiBookmark,
  HiOutlineBookmark,
  HiMapPin,
  HiBriefcase,
  HiBanknotes,
  HiChevronLeft,
  HiChevronRight,
  HiAdjustmentsHorizontal,
} from "react-icons/hi2";
import { api } from "@/lib/api";
import { JOB_TYPES, JOB_CATEGORIES } from "@/lib/constants";

const LIMIT = 12;

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchJobs() {
      setLoading(true);
      try {
        const response = await api.getAllActiveJobs({
          q: submittedSearch,
          jobType: jobType || undefined,
          location: location || undefined,
          category: category || undefined,
          minSalary: minSalary || undefined,
          maxSalary: maxSalary || undefined,
          page: currentPage,
          limit: LIMIT,
        });
        if (active && response.success) {
          setJobs(response.data || []);
          setPagination(response.pagination || { page: currentPage, limit: LIMIT, total: response.data?.length || 0, totalPages: 1 });
        }
      } catch (error) {
        if (active) {
          setJobs([]);
          setPagination({ page: 1, limit: LIMIT, total: 0, totalPages: 1 });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchJobs();
    return () => { active = false; };
  }, [submittedSearch, currentPage, jobType, location, category, minSalary, maxSalary]);

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setJobType("");
    setLocation("");
    setCategory("");
    setMinSalary("");
    setMaxSalary("");
    setSubmittedSearch("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFilterCount = useMemo(
    () => [jobType, location, category, minSalary, maxSalary, submittedSearch].filter(Boolean).length,
    [jobType, location, category, minSalary, maxSalary, submittedSearch],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030305] pb-24 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Find your next role</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Browse Jobs</h1>
          <p className="mt-3 text-sm text-gray-400">Search by keyword and filter by type, location, category, and salary.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmittedSearch(searchQuery.trim()); setCurrentPage(1); }}
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search title, company, skills…" className="h-11 w-full rounded-xl border border-white/10 bg-[#101014] pl-10 pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/50" />
          </div>
          <button type="submit" className="h-11 rounded-xl bg-white px-6 text-xs font-semibold text-black hover:bg-gray-200">Search</button>
        </form>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><HiAdjustmentsHorizontal className="text-indigo-400" /> Filters{activeFilterCount > 0 && <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">{activeFilterCount}</span>}</h2>
              {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="text-[10px] text-gray-400 hover:text-white">Clear all</button>}
            </div>
            <label className="mb-1 block text-[11px] font-medium text-gray-400">Job type</label>
            <select value={jobType} onChange={(e) => { setJobType(e.target.value); setCurrentPage(1); }} className="mb-4 h-10 w-full rounded-xl border border-white/10 bg-[#101014] px-3 text-xs text-white outline-none">
              <option value="">All types</option>
              {(JOB_TYPES || []).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="mb-1 block text-[11px] font-medium text-gray-400">Category</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }} className="mb-4 h-10 w-full rounded-xl border border-white/10 bg-[#101014] px-3 text-xs text-white outline-none">
              <option value="">All categories</option>
              {(JOB_CATEGORIES || []).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="mb-1 block text-[11px] font-medium text-gray-400">Location</label>
            <div className="relative mb-4">
              <HiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={location} onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }} placeholder="City or Remote" className="h-10 w-full rounded-xl border border-white/10 bg-[#101014] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600" />
            </div>
            <label className="mb-1 block text-[11px] font-medium text-gray-400">Min salary</label>
            <input type="number" min={0} value={minSalary} onChange={(e) => { setMinSalary(e.target.value); setCurrentPage(1); }} placeholder="e.g. 50000" className="mb-4 h-10 w-full rounded-xl border border-white/10 bg-[#101014] px-3 text-xs text-white outline-none placeholder:text-gray-600" />
            <label className="mb-1 block text-[11px] font-medium text-gray-400">Max salary</label>
            <input type="number" min={0} value={maxSalary} onChange={(e) => { setMaxSalary(e.target.value); setCurrentPage(1); }} placeholder="e.g. 120000" className="h-10 w-full rounded-xl border border-white/10 bg-[#101014] px-3 text-xs text-white outline-none placeholder:text-gray-600" />
          </aside>

          <div>
            <p className="mb-4 text-xs text-gray-500">{loading ? "Loading…" : `${pagination.total || jobs.length} jobs found`}</p>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">{[1,2,3,4].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]" />)}</div>
            ) : jobs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center"><p className="text-sm text-gray-400">No jobs match your filters.</p><button type="button" onClick={clearFilters} className="mt-4 text-xs text-indigo-400">Clear filters</button></div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {jobs.map((job, index) => {
                  const id = job._id || job.id;
                  return (
                    <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                      <Link href={`/jobs/${id}`} className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/40">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-200">{job.title}</h3>
                            <p className="mt-1 text-xs text-gray-400">{job.companyName || "Company"}</p>
                          </div>
                          <button type="button" onClick={(e) => toggleBookmark(id, e)} className="rounded-lg p-1.5 text-gray-500 hover:text-indigo-400" aria-label="Save job">
                            {savedJobs[id] ? <HiBookmark className="text-indigo-400" /> : <HiOutlineBookmark />}
                          </button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-gray-400">
                          {job.location && <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1"><HiMapPin /> {job.location}</span>}
                          {(job.jobType || job.type) && <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1"><HiBriefcase /> {job.jobType || job.type}</span>}
                          {(job.salaryRange || job.salaryMin) && <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1"><HiBanknotes />{job.salaryRange || `${job.salaryMin || ""}${job.salaryMax ? `–${job.salaryMax}` : ""}`}</span>}
                          {job.category && <span className="rounded-lg bg-indigo-500/10 px-2 py-1 text-indigo-300">{job.category}</span>}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
            {!loading && (pagination.totalPages || 1) > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2">
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((v) => Math.max(1, v - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 disabled:opacity-30"><HiChevronLeft /></button>
                {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((n) => (
                  <button type="button" key={n} onClick={() => setCurrentPage(n)} className={`h-10 min-w-10 rounded-lg px-3 text-xs font-semibold ${n === currentPage ? "bg-white text-black" : "border border-white/10 text-gray-400"}`}>{n}</button>
                ))}
                <button type="button" disabled={currentPage >= (pagination.totalPages || 1)} onClick={() => setCurrentPage((v) => Math.min(pagination.totalPages || 1, v + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 disabled:opacity-30"><HiChevronRight /></button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
