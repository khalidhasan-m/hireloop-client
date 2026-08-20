"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiEnvelope,
  HiPhone,
  HiDocumentText,
  HiCheckCircle,
  HiEllipsisVertical,
} from "react-icons/hi2";

const DEMO_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

export default function RecruiterApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Mock candidates applications state
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Julianne Moore",
      role: "Senior Product Designer",
      email: "julianne.m@example.com",
      phone: "+1 (555) 382-9102",
      appliedDate: "Oct 24, 2026",
      experience: "6 years",
      status: "Interviewing",
    },
    {
      id: 2,
      name: "Robert Downey",
      role: "Backend Engineer",
      email: "rdowney@example.com",
      phone: "+1 (555) 491-2834",
      appliedDate: "Oct 23, 2026",
      experience: "4 years",
      status: "New",
    },
    {
      id: 3,
      name: "Emma Stone",
      role: "Marketing Lead",
      email: "emma.stone@example.com",
      phone: "+1 (555) 839-2041",
      appliedDate: "Oct 22, 2026",
      experience: "8 years",
      status: "Reviewing",
    },
    {
      id: 4,
      name: "Chris Pratt",
      role: "Product Manager",
      email: "cpratt@example.com",
      phone: "+1 (555) 192-8374",
      appliedDate: "Oct 21, 2026",
      experience: "5 years",
      status: "Rejected",
    },
    {
      id: 5,
      name: "Sarah Jenkins",
      role: "Senior Full Stack Engineer",
      email: "sarah.j@example.com",
      phone: "+1 (555) 923-4810",
      appliedDate: "Oct 20, 2026",
      experience: "7 years",
      status: "Interviewing",
    },
  ]);

  const statuses = ["All", "New", "Reviewing", "Interviewing", "Rejected"];

  // Filter candidates based on status and search query
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Interviewing":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Reviewing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "New":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Talent Pipeline & Applications
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review, screen, and advance candidates across your active job
          openings.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search candidate name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0b0b0f] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-white/2">
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Applied Role</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Applied Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions / Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500 text-xs"
                  >
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-white/2 transition group"
                  >
                    {/* Candidate Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-linear-to-tr from-indigo-500 to-purple-500 shrink-0">
                          <Image
                            src={DEMO_AVATAR}
                            alt={app.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition">
                            {app.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6 text-gray-300 font-medium">
                      {app.role}
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6 text-gray-300">
                      {app.experience}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                      {app.appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(
                          app.status,
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Actions & Status Changer */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value)
                          }
                          className="h-9 px-3 rounded-xl bg-[#121218] border border-white/10 text-[11px] text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                        >
                          <option value="New">Set: New</option>
                          <option value="Reviewing">Set: Reviewing</option>
                          <option value="Interviewing">
                            Set: Interviewing
                          </option>
                          <option value="Rejected">Set: Rejected</option>
                        </select>

                        <button
                          onClick={() =>
                            alert(`Opening resume for ${app.name}`)
                          }
                          className="p-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition border border-white/10 cursor-pointer"
                          title="View Resume"
                        >
                          <HiDocumentText className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
