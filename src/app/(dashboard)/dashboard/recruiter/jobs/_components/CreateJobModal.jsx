"use client";

import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";

export function CreateJobModal({ isOpen, onClose, onSubmit }) {
  const [jobData, setJobData] = useState({
    title: "",
    category: "Software Engineering",
    location: "Remote / San Francisco",
    salaryRange: "$150k - $200k",
    jobType: "Full-time",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(jobData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0b0b0f] border border-white/10 rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1.5 rounded-full bg-white/5 border border-white/10 cursor-pointer disabled:opacity-50"
        >
          <HiXMark className="text-lg" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Post a New Job
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Fill out the details below to broadcast your opening to thousands of
            candidates.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              required
              disabled={isSubmitting}
              placeholder="e.g. Senior Full Stack Engineer"
              value={jobData.title}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Category / Department
              </label>
              <select
                name="category"
                disabled={isSubmitting}
                value={jobData.category}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-[#121218] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer disabled:opacity-50"
              >
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Product Design">Product Design</option>
                <option value="Product Management">Product Management</option>
                <option value="DevOps & Infrastructure">
                  DevOps & Infrastructure
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                disabled={isSubmitting}
                placeholder="e.g. SF / Remote"
                value={jobData.location}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Salary Range
              </label>
              <input
                type="text"
                name="salaryRange"
                disabled={isSubmitting}
                placeholder="e.g. $180k - $240k"
                value={jobData.salaryRange}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Job Type
              </label>
              <select
                name="jobType"
                disabled={isSubmitting}
                value={jobData.jobType}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-[#121218] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer disabled:opacity-50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Job Description
            </label>
            <textarea
              name="description"
              rows={4}
              disabled={isSubmitting}
              placeholder="Describe responsibilities, requirements, and tech stack..."
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none disabled:opacity-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Job Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}