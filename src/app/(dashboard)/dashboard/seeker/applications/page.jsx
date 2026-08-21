"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { HiArrowDownTray } from "react-icons/hi2";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  Applied: "bg-white/10 text-gray-300 border-white/20",
  "Under Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Shortlisted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Offered: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

function relativeTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function MyApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("active");

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const res = await api.getMyApplications(token).catch(() => ({ data: [] }));
      setApplications(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeStatuses = ["Applied", "Under Review", "Review", "Shortlisted", "Offered"];
  const archivedStatuses = ["Rejected"];

  const filtered = applications.filter((app) => {
    const status = app.status || "Applied";
    return tab === "active"
      ? activeStatuses.includes(status)
      : archivedStatuses.includes(status);
  });

  const totalApplied = applications.length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const interviews = applications.filter((a) =>
    ["Shortlisted", "Under Review", "Review"].includes(a.status),
  ).length;
  const successRate =
    totalApplied > 0
      ? Math.round(
          (applications.filter((a) => a.status === "Offered").length / totalApplied) * 100,
        )
      : 0;
  const exportApplications = () => {
    const csv = ["jobId,candidateEmail,status,createdAt,coverLetter", ...applications.map((app) => [app.jobId, app.candidateEmail, app.status, app.createdAt, app.coverLetter].map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(","))].join("\\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "hireloop-applications.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your job applications and interview progress in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/10 overflow-hidden text-xs">
            <button
              onClick={() => setTab("active")}
              className={`px-4 py-2 font-medium transition cursor-pointer ${
                tab === "active"
                  ? "bg-white text-black"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setTab("archived")}
              className={`px-4 py-2 font-medium transition cursor-pointer ${
                tab === "archived"
                  ? "bg-white text-black"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              Archived
            </button>
          </div>
          <button type="button" onClick={exportApplications} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white text-black text-xs font-bold hover:bg-gray-200 transition cursor-pointer">
            <HiArrowDownTray className="text-sm" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: totalApplied },
          { label: "Shortlisted", value: shortlisted },
          { label: "Interviews", value: interviews, accent: "text-amber-400" },
          { label: "Success Rate", value: `${successRate}%`, accent: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-4"
          >
            <p className="text-[11px] text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.accent || "text-white"}`}>
              {loading ? "…" : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Job Title</th>
                <th className="py-3.5 px-5 font-semibold">Company</th>
                <th className="py-3.5 px-5 font-semibold">Applied</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 animate-pulse">
                    Loading applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const status = app.status || "Applied";
                  const style =
                    STATUS_STYLES[status] || "bg-white/10 text-gray-300 border-white/20";
                  return (
                    <tr key={app._id} className="hover:bg-white/2 transition">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-white">
                          {app.jobTitle || "Untitled Role"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {app.jobType || "Full-time"}
                        </p>
                      </td>
                      <td className="py-4 px-5 text-gray-300">
                        {app.companyName || "—"}
                      </td>
                      <td className="py-4 px-5 text-gray-400">
                        {relativeTime(app.createdAt)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={app.jobId ? `/jobs/${app.jobId}` : "#"}
                          className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/10 text-[11px] text-gray-500">
            Showing {filtered.length} of {applications.length} applications
          </div>
        )}
      </div>
    </div>
  );
}
