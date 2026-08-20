"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  HiUser,
  HiBuildingOffice,
  HiBell,
  HiShieldCheck,
  HiCheck,
} from "react-icons/hi2";

export default function RecruiterSettingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || "Alex Sterling",
    email: user?.email || "alex.sterling@luminatech.com",
    title: "Senior Technical Recruiter",
    phone: "+1 (555) 234-5678",
  });

  const [notifications, setNotifications] = useState({
    newApplicantEmail: true,
    weeklyDigest: true,
    interviewReminders: true,
    marketingUpdates: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage your recruiter profile, notification triggers, and security
          preferences.
        </p>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fadeIn">
          <HiCheck className="text-base" />
          Settings updated successfully!
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <HiUser className="text-sm" />
          Personal Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <HiBell className="text-sm" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <HiShieldCheck className="text-sm" />
          Security & Access
        </button>
      </div>

      {/* Tab Content: Profile Settings */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Recruiter Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Job Title / Designation
              </label>
              <input
                type="text"
                name="title"
                value={profileData.title}
                onChange={handleProfileChange}
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab Content: Notifications */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Email & Notification Preferences
          </h2>

          <div className="space-y-4">
            {[
              {
                key: "newApplicantEmail",
                title: "New Applicant Alerts",
                desc: "Receive an email instant notification when a candidate applies to your job listings.",
              },
              {
                key: "weeklyDigest",
                title: "Weekly Talent Pipeline Summary",
                desc: "Get a weekly report outlining active jobs, view counts, and total candidate applications.",
              },
              {
                key: "interviewReminders",
                title: "Interview Reminders",
                desc: "Receive calendar alerts 30 minutes before scheduled candidate interview loops.",
              },
              {
                key: "marketingUpdates",
                title: "Platform & Feature Updates",
                desc: "Receive news about new HireLoop recruiter tools, tips, and enterprise features.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition"
              >
                <div>
                  <p className="font-bold text-white text-xs">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationToggle(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    notifications[item.key]
                      ? "bg-indigo-600 justify-end"
                      : "bg-white/10 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === "security" && (
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Security & Authentication
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
