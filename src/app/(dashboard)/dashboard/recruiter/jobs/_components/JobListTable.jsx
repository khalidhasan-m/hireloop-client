"use client";

import React from "react";
import { HiEye, HiTrash, HiLockClosed, HiLockOpen } from "react-icons/hi2";

export function JobListTable({
  jobs,
  onViewApplicants,
  onDeleteJob,
  onCloseJob,
  onReopenJob,
}) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/85 backdrop-blur-xl p-12 text-center text-gray-400 text-xs shadow-2xl">
        No jobs found. Click &quot;Post New Job&quot; above to create your first listing!
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/85 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-white/2">
              <th className="py-4 px-6">Job Title & Role</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Salary Range</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {jobs.map((job) => {
              const isActive = (job.status || "active").toLowerCase() === "active";
              return (
                <tr key={job._id} className="hover:bg-white/2 transition group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white group-hover:text-indigo-400 transition">
                      {job.title}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {job.category || job.jobType || "—"}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-medium">
                    {job.location || "Remote"}
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-mono text-[11px]">
                    {job.salaryRange ||
                      (job.salaryMin != null
                        ? `$${job.salaryMin}k - $${job.salaryMax || "?"}k`
                        : "Competitive")}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}
                    >
                      {isActive ? "Active" : "Closed"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewApplicants?.(job)}
                        className="p-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition border border-white/10 cursor-pointer"
                        title="View Applicants"
                      >
                        <HiEye className="text-sm" />
                      </button>
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => onCloseJob?.(job)}
                          className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition border border-amber-500/20 cursor-pointer"
                          title="Close Job"
                        >
                          <HiLockClosed className="text-sm" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReopenJob?.(job)}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition border border-emerald-500/20 cursor-pointer"
                          title="Reopen Job"
                        >
                          <HiLockOpen className="text-sm" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteJob?.(job)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition border border-red-500/20 cursor-pointer"
                        title="Delete Job"
                      >
                        <HiTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
