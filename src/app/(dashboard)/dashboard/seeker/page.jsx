"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import {
  HiBookmark,
  HiDocumentText,
  HiCalendarDays,
  HiTrophy,
  HiUser,
  HiArrowPath,
  HiPencilSquare,
} from "react-icons/hi2";
import toast from "react-hot-toast";

const STATUS_ORDER = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Offered",
];

const STATUS_COLORS = {
  Applied: "bg-white",
  "Under Review": "bg-amber-400",
  Shortlisted: "bg-blue-400",
  Rejected: "bg-red-400",
  Offered: "bg-emerald-400",
};

function relativeTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function SeekerHomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const appsRes = await api
        .getMyApplications(token)
        .catch(() => ({ data: [] }));
      const apps = appsRes?.data || [];
      setApplications(apps);

      try {
        const savedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"}/saved-jobs/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        );
        if (savedRes.ok) {
          const savedJson = await savedRes.json();
          setSavedCount((savedJson?.data || []).length);
        }
      } catch {
        // saved jobs API not ready yet
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalApplied = applications.length;
  const interviews = applications.filter((a) =>
    ["Shortlisted", "Under Review"].includes(a.status),
  ).length;
  const offers = applications.filter((a) => a.status === "Offered").length;

  const statusCounts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status).length;
    return acc;
  }, {});

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  const recentActivity = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt),
    )
    .slice(0, 5)
    .map((app) => ({
      id: app._id,
      text: `Application for ${app.jobTitle || "a position"} at ${app.companyName || "a company"} updated to '${app.status}'`,
      status: app.status,
      time: relativeTime(app.updatedAt || app.createdAt),
    }));

  const stats = [
    {
      title: "Saved Jobs",
      value: loading ? "…" : String(savedCount),
      icon: HiBookmark,
      iconColor: "text-indigo-400",
    },
    {
      title: "Applications Submitted",
      value: loading ? "…" : String(totalApplied),
      icon: HiDocumentText,
      iconColor: "text-purple-400",
    },
    {
      title: "Interviews Scheduled",
      value: loading ? "…" : String(interviews),
      icon: HiCalendarDays,
      iconColor: "text-amber-400",
    },
    {
      title: "Offers Received",
      value: loading ? "…" : String(offers),
      icon: HiTrophy,
      iconColor: "text-emerald-400",
    },
  ];

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  return (
    <div className="space-y-8 pb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400">
                  {stat.title}
                </span>
                <Icon className={`text-lg ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
            {user?.image ? (
              <img
                src={user.image}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <HiUser className="text-3xl" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{userName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>
          </div>
          <Link
            href="/dashboard/seeker/settings"
            className="mt-2 w-full max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <HiPencilSquare className="text-sm" />
            Edit Profile
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
          <h3 className="text-sm font-semibold text-white mb-5">
            Application Status
          </h3>
          <div className="space-y-3.5">
            {STATUS_ORDER.map((status) => {
              const count = statusCounts[status] || 0;
              const pct = Math.round((count / maxStatusCount) * 100);
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-24 shrink-0">
                    {status}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${STATUS_COLORS[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-300 w-6 text-right">
                    {loading ? "…" : count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <Link
            href="/dashboard/seeker/applications"
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
          >
            View All Activity
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-8 text-center text-gray-500 text-xs animate-pulse">
              Loading activity...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-8 text-center text-gray-500 text-xs">
              No recent activity yet. Start applying to jobs!
            </div>
          ) : (
            recentActivity.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 px-5 py-4 flex items-start gap-4"
              >
                <div className="mt-0.5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {item.status === "Offered" ? (
                    <HiTrophy className="text-emerald-400 text-sm" />
                  ) : item.status === "Rejected" ? (
                    <HiDocumentText className="text-red-400 text-sm" />
                  ) : (
                    <HiArrowPath className="text-indigo-400 text-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">
                  {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
