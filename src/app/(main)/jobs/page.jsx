"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HiMagnifyingGlass,
  HiBookmark,
  HiOutlineBookmark,
  HiChevronDown,
  HiMapPin,
  HiBriefcase,
  HiBanknotes,
  HiBolt,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { api } from "@/lib/api";

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    FullTime: true,
    Contract: false,
    Remote: false,
  });

  // Fetch real jobs from Express backend on mount
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await api.getAllActiveJobs();
        if (response.success) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const toggleBookmark = (id, e) => {
    e.preventDefault(); // Prevent triggering the card link
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden pb-24">
      {/* Background ambient glows matching the site design */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-105 w-212.5 rounded-full bg-indigo-500/4.5 blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        {/* Top Search Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl"
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full flex items-center">
              <HiMagnifyingGlass className="absolute left-4 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, keywords..."
                className="w-full bg-[#111116] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition"
              />
            </div>
            <button className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.15)] cursor-pointer">
              Search Jobs
            </button>
          </div>
        </motion.div>

        {/* Main Content Grid (Filters Sidebar + Job Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-6">
              <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

              <h2 className="text-base font-semibold tracking-tight text-white">
                Filters
              </h2>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Job Type
                </h3>

                <div className="space-y-3">
                  {["Full-time", "Contract", "Remote"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters[type] || false}
                          onChange={() => handleCheckboxChange(type)}
                          className="w-4 h-4 rounded border-white/20 bg-[#111116] text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white transition">
                          {type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Results List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header & Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                {loading
                  ? "Loading jobs..."
                  : `Found ${filteredJobs.length} Professional Jobs`}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Sort by:</span>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-[#0b0b0e] text-white font-medium hover:border-white/20 transition cursor-pointer">
                  Most Recent
                  <HiChevronDown className="text-xs text-gray-400" />
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  Loading open roles from database...
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-[#0b0b0e] rounded-2xl border border-white/10">
                  No active job listings found matching your search.
                </div>
              ) : (
                filteredJobs.map((job, index) => {
                  const isSaved = (savedIds) => savedJobs[job._id];

                  return (
                    <Link
                      href={`/jobs/${job._id}`}
                      key={job._id}
                      className="block"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ y: -2 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                      >
                        {/* Top border shine */}
                        <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

                        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                          {/* Company Logo Box */}
                          <div className="w-12 h-12 rounded-xl bg-[#111116] border border-white/10 flex items-center justify-center shrink-0">
                            <HiBriefcase className="text-indigo-400 text-lg" />
                          </div>

                          {/* Job Info */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold tracking-tight text-white group-hover:text-indigo-400 transition">
                                {job.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">
                              {job.location || "Remote"} •{" "}
                              {job.jobType || "Full-time"}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              {job.salaryRange && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111116]/80 text-[11px] font-medium text-gray-300">
                                  <HiBanknotes className="text-emerald-400 text-xs" />
                                  {job.salaryRange}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111116]/80 text-[11px] font-medium text-gray-300">
                                <HiBriefcase className="text-purple-400 text-xs" />
                                {job.jobType || "Full-time"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bookmark Action */}
                        <div className="self-end sm:self-center">
                          <button
                            onClick={(e) => toggleBookmark(job._id, e)}
                            className="w-10 h-10 rounded-xl bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition cursor-pointer"
                          >
                            {savedJobs[job._id] ? (
                              <HiBookmark className="text-indigo-400 text-base" />
                            ) : (
                              <HiOutlineBookmark className="text-base" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
