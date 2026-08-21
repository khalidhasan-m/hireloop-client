"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiBanknotes,
  HiMapPin,
  HiBriefcase,
  HiChartBar,
  HiCheckBadge,
  HiArrowUpRight,
  HiShieldCheck,
  HiComputerDesktop,
  HiHeart,
  HiCurrencyDollar,
  HiArrowLeft,
} from "react-icons/hi2";
import { api } from "@/lib/api";

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchJobDetails() {
      try {
        const response = await api.getJobById(id);
        if (response && response.success) {
          setJob(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#030305] text-white flex flex-col items-center justify-center px-4 space-y-4">
        <h1 className="text-xl font-semibold text-white">Job Not Found</h1>
        <p className="text-gray-400 text-xs">
          The position you are looking for may have been closed or removed.
        </p>
        <Link
          href="/jobs"
          className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          Back to Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden pb-28">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-105 w-212.5 rounded-full bg-indigo-500/4.5 blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition cursor-pointer"
        >
          <HiArrowLeft className="text-sm" />
          Back to Jobs
        </Link>

        {/* Top Job Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

          <div className="flex items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#111116] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <HiBriefcase className="text-indigo-400 text-2xl" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-medium">
                <span className="text-gray-300">
                  {job.companyName || "Verified Company"}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <HiCheckBadge className="text-sm" />
                  Verified Employer
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="w-11 h-11 rounded-xl bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition cursor-pointer"
            >
              {isSaved ? (
                <HiBookmark className="text-indigo-400 text-lg" />
              ) : (
                <HiOutlineBookmark className="text-lg" />
              )}
            </button>
            <Link
              href="/auth/signup"
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.15)] text-center cursor-pointer"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>

        {/* Quick Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-5 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-2">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <HiCurrencyDollar className="text-indigo-400 text-base" />
              SALARY RANGE
            </div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {job.salaryRange || "Competitive"}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-5 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-2">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <HiMapPin className="text-purple-400 text-base" />
              LOCATION
            </div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {job.location || "Remote"}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-5 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-2">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <HiBriefcase className="text-emerald-400 text-base" />
              JOB TYPE
            </div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {job.jobType || "Full-time"}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-5 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-2">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <HiChartBar className="text-amber-400 text-base" />
              EXPERIENCE
            </div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {job.experience || "Professional Level"}
            </p>
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-4">
              <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Job Description
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium whitespace-pre-line">
                {job.description || "No description provided."}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-4">
                <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Responsibilities
                </h2>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-400 font-medium">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-5">
                <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Requirements
                </h2>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-400 font-medium pt-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-6">
              <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#0b0b0e] border border-white/10 flex items-center justify-center text-emerald-400">
                    <HiHeart className="text-sm" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">
                    Full Health & Dental
                  </span>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#0b0b0e] border border-white/10 flex items-center justify-center text-indigo-400">
                    <HiBanknotes className="text-sm" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">
                    Competitive 401k
                  </span>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#0b0b0e] border border-white/10 flex items-center justify-center text-purple-400">
                    <HiComputerDesktop className="text-sm" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">
                    Latest Hardware Stipend
                  </span>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#0b0b0e] border border-white/10 flex items-center justify-center text-amber-400">
                    <HiShieldCheck className="text-sm" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200">
                    Unlimited PTO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Company Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="top-8 relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-6 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl space-y-6">
              <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
              <h3 className="text-base font-semibold tracking-tight text-white">
                Company Overview
              </h3>

              <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-[#111116] flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
                <HiBriefcase className="text-gray-700 text-6xl relative z-0" />
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-gray-300 font-medium">
                  <span>{job.companyName || "Company Workspace"}</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs text-gray-400 font-medium">
                    SIZE
                  </span>
                  <span className="text-xs font-semibold text-white">
                    250 - 500 Employees
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs text-gray-400 font-medium">
                    INDUSTRY
                  </span>
                  <span className="text-xs font-semibold text-white text-right">
                    SaaS / Technology
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-[#111116] text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer shadow-md"
                >
                  <span>Visit Website</span>
                  <HiArrowUpRight className="text-xs" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
