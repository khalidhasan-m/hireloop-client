"use client";

import React, { useState } from "react";
import { JobListTable } from "./_components/JobListTable";
import { CreateJobModal } from "./_components/CreateJobModal";
import { HiPlus, HiMagnifyingGlass } from "react-icons/hi2";

export default function RecruiterJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock initial jobs list
  const [jobs, setJobs] = useState([
    {
      title: "Senior Distributed Systems Engineer",
      category: "Engineering • Full-time",
      location: "SF / Remote",
      applicantsCount: 24,
      salary: "$180k - $240k",
      status: "Active",
    },
    {
      title: "Product Design Lead",
      category: "Design • Full-time",
      location: "New York",
      applicantsCount: 18,
      salary: "$160k - $210k",
      status: "Active",
    },
    {
      title: "DevOps Architect (Infra)",
      category: "Infrastructure • Full-time",
      location: "Remote",
      applicantsCount: 12,
      salary: "$190k+",
      status: "Active",
    },
    {
      title: "Junior Frontend Developer",
      category: "Engineering • Contract",
      location: "Austin, TX",
      applicantsCount: 45,
      salary: "$90k - $120k",
      status: "Closed",
    },
  ]);

  const handleCreateJob = (newJobData) => {
    const formattedJob = {
      title: newJobData.title,
      category: `${newJobData.category} • Full-time`,
      location: newJobData.location,
      applicantsCount: 0,
      salary: newJobData.salary,
      status: "Active",
    };
    setJobs([formattedJob, ...jobs]);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Create Button Header */}
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

      {/* Search & Filter Bar */}
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

      {/* Job Listings Table */}
      <JobListTable
        jobs={filteredJobs}
        onViewApplicants={(job) => console.log("View applicants for:", job.title)}
        onEditJob={(job) => console.log("Edit job:", job.title)}
        onDeleteJob={(job) => {
          setJobs(jobs.filter((j) => j.title !== job.title));
        }}
      />

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}