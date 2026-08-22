"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HiMapPin,
  HiBriefcase,
  HiBanknotes,
  HiArrowRight,
} from "react-icons/hi2";
// UPDATED IMPORT
import { api } from "@/lib/api";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        // UPDATED CALL
        const response = await api.getAllActiveJobs();

        // Assuming your API returns { success: true, data: [...] }
        if (response && response.success) {
          setJobs(response.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedJobs();
  }, []);

  return (
    <section className="relative py-28 bg-[#030305] text-white overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-105 w-212.5 rounded-full bg-indigo-500/4.5 blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131318]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(0,0,0,.25)] backdrop-blur-md">
              <span className="text-[10px]">✨</span>
              <span className="text-[9px] uppercase tracking-[0.17em] text-gray-400 font-medium">
                Smart Job Discovery
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[32px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.045em] leading-[1.1]"
          >
            The roles you'd never find by searching
          </motion.h2>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
            Loading featured open roles...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-[#0b0b0e] rounded-2xl border border-white/10">
            No featured jobs available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, index) => (
              <Link
                href={`/jobs/${job._id}`}
                key={job._id}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-[0_15px_45px_rgba(0,0,0,.35)] backdrop-blur-xl transition duration-300"
                >
                  <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-indigo-400 transition">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {job.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111116]/80 text-[11px] font-medium text-gray-300">
                        <HiMapPin className="text-indigo-400 text-xs" />
                        {job.location || "Location not specified"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111116]/80 text-[11px] font-medium text-gray-300">
                        <HiBriefcase className="text-purple-400 text-xs" />
                        {job.jobType || "Job type not specified"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#111116]/80 text-[11px] font-medium text-gray-300">
                        <HiBanknotes className="text-emerald-400 text-xs" />
                        {job.salaryRange || "Salary not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-indigo-300">
                    <span>Apply Now</span>
                    <HiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            View all jobs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
