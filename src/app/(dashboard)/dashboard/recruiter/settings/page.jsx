"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { HiUser, HiBell, HiShieldCheck, HiCheck } from "react-icons/hi2";

export default function RecruiterSettingsPage() {
  const { data: session, isPending } = authClient.useSession();

  // Better Auth user
  const user = session?.user;

  // Show loading while Better Auth checks the session
  if (isPending) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  // If there is no logged-in user
  if (!user) {
    return (
      <div className="text-white text-center py-20">
        Please log in to access account settings.
      </div>
    );
  }

  return <RecruiterSettingsContent user={user} />;
}

function RecruiterSettingsContent({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // PROFILE FORM
  // =========================
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    title: "Senior Technical Recruiter",
    phone: "",
  });

  // =========================
  // PASSWORD FORM
  // =========================
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // =========================
  // NOTIFICATIONS
  // =========================
  const [notifications, setNotifications] = useState({
    newApplicantEmail: true,
    weeklyDigest: true,
    interviewReminders: true,
    marketingUpdates: false,
  });

  // =========================
  // PROFILE INPUT CHANGE
  // =========================
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PASSWORD INPUT CHANGE
  // =========================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // NOTIFICATION TOGGLE
  // =========================
  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // =========================
  // SUCCESS MESSAGE
  // =========================
  const showSuccessMessage = () => {
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // =========================
  // UPDATE PROFILE
  // Better Auth
  // =========================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: profileData.name.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");

      showSuccessMessage();
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("Something went wrong while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // Better Auth
  // =========================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
        return;
      }

      toast.success("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

      showSuccessMessage();
    } catch (error) {
      console.error("Password change error:", error);

      toast.error("Something went wrong while changing your password");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE NOTIFICATIONS
  // Currently UI only
  // =========================
  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");

    showSuccessMessage();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Account Settings
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage your recruiter profile, notification triggers, and security
          preferences.
        </p>
      </div>

      {/* =========================
          SUCCESS BANNER
      ========================= */}
      {isSaved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fadeIn">
          <HiCheck className="text-base" />
          Settings updated successfully!
        </div>
      )}

      {/* =========================
          TABS
      ========================= */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        {/* PROFILE TAB */}
        <button
          type="button"
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

        {/* NOTIFICATIONS TAB */}
        <button
          type="button"
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

        {/* SECURITY TAB */}
        <button
          type="button"
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

      {/* =====================================================
          PROFILE TAB
      ===================================================== */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleUpdateProfile}
          className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Recruiter Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* FULL NAME */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-gray-500 cursor-not-allowed"
              />

              <p className="text-[10px] text-gray-500 mt-2">
                Email address cannot be changed from this page.
              </p>
            </div>

            {/* JOB TITLE */}
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

            {/* PHONE */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+880..."
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================================
          NOTIFICATIONS TAB
      ===================================================== */}
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
              type="button"
              onClick={handleSaveNotifications}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          SECURITY TAB
      ===================================================== */}
      {activeTab === "security" && (
        <form
          onSubmit={handleChangePassword}
          className="rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Security & Authentication
          </h2>

          <div className="space-y-5">
            {/* CURRENT PASSWORD */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className="w-full h-12 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />

              <p className="text-[10px] text-gray-500 mt-2">
                Password must be at least 8 characters.
              </p>
            </div>
          </div>

          {/* UPDATE PASSWORD BUTTON */}
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
