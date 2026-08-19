"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  HiDocumentText,
  HiUsers,
  HiBolt,
  HiCheckCircle,
  HiPlus, // Added plus icon
} from "react-icons/hi2";
import { StatsGrid } from "./_components/StatsGrid";
import { RecentApplicationsTable } from "./_components/RecentApplicationsTable";
import { TopCompaniesCard } from "./_components/TopCompaniesCard";
import { useRouter } from "next/navigation";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name || "Alex Sterling";

  // State for optional quick modal if you want to pop up a form
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      title: "Total Job Posts",
      value: "48",
      icon: HiDocumentText,
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Total Applicants",
      value: "1,284",
      icon: HiUsers,
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      title: "Active Jobs",
      value: "18",
      icon: HiBolt,
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Jobs Closed",
      value: "32",
      icon: HiCheckCircle,
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  const recentApplications = [
    {
      name: "Julianne Moore",
      role: "Senior Product Designer",
      date: "Oct 24, 2023",
      experience: "6 years",
      status: "Interviewing",
      statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      name: "Robert Downey",
      role: "Backend Engineer",
      date: "Oct 23, 2023",
      experience: "4 years",
      status: "New",
      statusColor: "bg-white/10 text-gray-300 border-white/10",
    },
    {
      name: "Emma Stone",
      role: "Marketing Lead",
      date: "Oct 22, 2023",
      experience: "8 years",
      status: "Reviewing",
      statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      name: "Chris Pratt",
      role: "Product Manager",
      date: "Oct 21, 2023",
      experience: "5 years",
      status: "Rejected",
      statusColor: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  ];

  const topCompanies = [
    { name: "Google Inc.", category: "Technology • Mountain View", jobs: "24 ACTIVE JOBS" },
    { name: "Meta Platforms", category: "Social Media • Mountain View", jobs: "18 ACTIVE JOBS" },
    { name: "Stripe", category: "Fintech • San Francisco", jobs: "12 ACTIVE JOBS" },
    { name: "Tesla", category: "Automotive • Austin", jobs: "31 ACTIVE JOBS" },
  ];

  return (
    <div className="space-y-8 relative pb-16">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          Here is what&apos;s happening with your job listings and applicants today.
        </p>
      </div>

      {/* Stats Cards Component */}
      <StatsGrid stats={stats} />

      {/* Main Section: Applications & Top Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentApplicationsTable applications={recentApplications} />
        <TopCompaniesCard companies={topCompanies} />
      </div>

      {/* =====================================================
          FLOATING ACTION BUTTON (MATCHING SCREENSHOT)
      ====================================================== */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => {
            // You can either open a modal or route to a create job page
            // Example: router.push('/dashboard/recruiter/jobs/new')
            setIsModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
          title="Post a new job"
        >
          <HiPlus className="text-2xl font-bold" />
        </button>
      </div>

      {/* =====================================================
          OPTIONAL QUICK MODAL 
      ====================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0b0f] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Quick Action</h3>
            <p className="text-xs text-gray-400 mb-6">
              What would you like to do today?
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/dashboard/recruiter/jobs"); // or post job page
                }}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
              >
                Create a New Job Listing
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold hover:bg-white/10 transition border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}