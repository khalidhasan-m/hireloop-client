"use client";

import React from "react";
import Image from "next/image";
import { HiEllipsisVertical, HiEye, HiPencilSquare, HiTrash } from "react-icons/hi2";

const DEMO_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

export function JobListTable({ jobs, onViewApplicants, onEditJob, onDeleteJob }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-white/2">
              <th className="py-4 px-6">Job Title & Role</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Applicants</th>
              <th className="py-4 px-6">Salary Range</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {jobs.map((job, idx) => (
              <tr key={idx} className="hover:bg-white/2 transition group">
                {/* Title & Category */}
                <td className="py-4 px-6">
                  <p className="font-bold text-white group-hover:text-indigo-400 transition">
                    {job.title}
                  </p>
                  <p className="text-[10px] text-gray-500">{job.category || "Engineering • Full-time"}</p>
                </td>

                {/* Location */}
                <td className="py-4 px-6 text-gray-300 font-medium">
                  {job.location}
                </td>

                {/* Applicants Count + Avatars */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <div className="relative w-5 h-5 rounded-full border border-black overflow-hidden">
                        <Image src={DEMO_AVATAR} alt="Applicant" fill className="object-cover" />
                      </div>
                    </div>
                    <span className="text-gray-300 font-semibold">{job.applicantsCount}</span>
                  </div>
                </td>

                {/* Salary */}
                <td className="py-4 px-6 text-gray-300 font-mono text-[11px]">
                  {job.salary}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      job.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewApplicants?.(job)}
                      className="p-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition border border-white/10"
                      title="View Applicants"
                    >
                      <HiEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => onEditJob?.(job)}
                      className="p-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition border border-white/10"
                      title="Edit Job"
                    >
                      <HiPencilSquare className="text-sm" />
                    </button>
                    <button
                      onClick={() => onDeleteJob?.(job)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition border border-red-500/20"
                      title="Delete Job"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}