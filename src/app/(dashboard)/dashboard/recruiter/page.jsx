"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import {
  HiDocumentText,
  HiUsers,
  HiBolt,
  HiCheckCircle,
  HiPlus,
} from "react-icons/hi2";
import { StatsGrid } from "./_components/StatsGrid";
import { RecentApplicationsTable } from "./_components/RecentApplicationsTable";
import { TopCompaniesCard } from "./_components/TopCompaniesCard";
import { CreateJobModal } from "./jobs/_components/CreateJobModal";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  applied: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  pending: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "under review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  reviewing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  shortlisted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  interviewing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  offered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecruiterDashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name || "Recruiter";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState(null);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const companyRes = await api.getMyCompany(token).catch(() => ({ data: null }));
      setCompany(companyRes?.data || null);
      const jobsRes = await api.getMyJobs(token).catch(() => ({ data: [] }));
      const myJobs = jobsRes?.data || [];
      setJobs(myJobs);

      const appPromises = myJobs.map((job) =>
        api.getJobApplications(job._id, token).catch(() => ({ data: [] })),
      );
      const appResults = await Promise.all(appPromises);

      const allApps = [];
      appResults.forEach((res, idx) => {
        const job = myJobs[idx];
        (res?.data || []).forEach((app) => {
          const statusRaw = (app.status || "Applied").toLowerCase();
          allApps.push({
            ...app,
            role: job.title || app.jobTitle || "Unknown Role",
            name: app.candidateName || app.name || "Candidate",
            experience: app.experience || "—",
            date: formatDate(app.createdAt),
            status:
              (app.status || "Applied").charAt(0).toUpperCase() +
              (app.status || "Applied").slice(1),
            statusColor:
              STATUS_COLORS[statusRaw] ||
              "bg-gray-500/10 text-gray-400 border-gray-500/20",
          });
        });
      });

      allApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(allApps);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => (j.status || "active") === "active").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;
  const totalApplicants = applications.length;

  const stats = [
    {
      title: "Total Job Posts",
      value: loading ? "…" : String(totalJobs),
      icon: HiDocumentText,
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Total Applicants",
      value: loading ? "…" : String(totalApplicants),
      icon: HiUsers,
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Active Jobs",
      value: loading ? "…" : String(activeJobs),
      icon: HiBolt,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Jobs Closed",
      value: loading ? "…" : String(closedJobs),
      icon: HiCheckCircle,
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  const recentApplications = applications.slice(0, 4);

  const handleCreateJobSubmit = async (jobData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("You must be logged in to post a job.");
        return;
      }
      await api.createJob(jobData, token);
      toast.success("Job posted successfully!");
      setIsModalOpen(false);
      loadDashboard();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to post job.");
    }
  };

  const topCompanies = company ? [{ name: company.name, category: company.industry || "Company", jobs: `${activeJobs} ACTIVE JOBS`, logo: company.logo || company.logoUrl }] : [];

  return (
    <div className="space-y-8 relative pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          Here is what&apos;s happening with your job listings and applicants today.
        </p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentApplicationsTable applications={recentApplications} />
        <TopCompaniesCard companies={topCompanies} />
      </div>

      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 cursor-pointer"
          title="Post a new job"
        >
          <HiPlus className="text-2xl font-bold" />
        </button>
      </div>

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJobSubmit}
      />
    </div>
  );
}
