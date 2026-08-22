"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { HiUser, HiDocumentText } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function SeekerSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [resumeName, setResumeName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setHeadline(user.headline || "");
      setBio(user.bio || "");
      setSkills(Array.isArray(user.skills) ? user.skills : []);
      setAvatarUrl(user.image || "");
      if (user.resumeUrl) {
        setResumeName(user.resumeUrl.split("/").pop() || "Resume.pdf");
      }
    }
  }, [user]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((x) => x !== skill));
  };

  const upload = async (kind, file) => { if (!file) return; setUploading(true); try { const { data } = await authClient.getSession(); const result = kind === "resume" ? await api.uploadResume(file, data?.session?.token) : await api.uploadAvatar(file, data?.session?.token); if (kind === "resume") setResumeName(file.name); else if (result?.data?.url) { setAvatarUrl(result.data.url); await authClient.updateUser({ image: result.data.url }); } toast.success(`${kind === "resume" ? "Resume" : "Avatar"} uploaded`); } catch (error) { toast.error(error.message || "Upload failed"); } finally { setUploading(false); } };
  const handleSaveDetails = async () => { setSaving(true); try { const { data } = await authClient.getSession(); const result = await api.updateProfile({ headline, bio, skills }, data?.session?.token); if (result?.data) toast.success("Professional details saved"); } catch (error) { toast.error(error.message || "Failed to save details"); } finally { setSaving(false); } };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) return toast.error("Enter your current and new password");
    if (passwordData.newPassword.length < 8) return toast.error("New password must be at least 8 characters");
    setPasswordSaving(true);
    try {
      const { error } = await authClient.changePassword(passwordData);
      if (error) throw new Error(error.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) { toast.error(error.message || "Failed to change password"); }
    finally { setPasswordSaving(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authClient.getSession();
      const result = await api.updateProfile({ name, image: avatarUrl || null }, data?.session?.token);
      if (result?.data) {
        setName(result.data.name || name);
        await authClient.updateUser({ name: result.data.name || name, image: result.data.image || avatarUrl || null });
      }
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  if (isPending) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account details and professional profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Profile Information</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <HiUser className="text-2xl" />
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium text-gray-300 hover:bg-white/10 transition">{uploading ? "Uploading…" : "Change Avatar"}<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(event) => upload("avatar", event.target.files?.[0])} /></label>
              <p className="text-[10px] text-gray-500 mt-1">JPG, GIF or PNG. Max size of 5MB.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#08080c] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1.5">Email Address</label>
                <input type="email" value={email} disabled
                  className="w-full h-10 px-3 rounded-xl bg-[#08080c] border border-white/10 text-xs text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer">
                {saving ? "Saving..." : "Update Profile"}
              </button>
              <button type="button" onClick={() => document.getElementById("seeker-password-form")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer">Change Password</button>
            </div>
          </form>
          <form id="seeker-password-form" onSubmit={handleChangePassword} className="mt-6 border-t border-white/10 pt-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Security</h4>
            <div className="grid gap-4 sm:grid-cols-2"><input type="password" autoComplete="current-password" placeholder="Current password" value={passwordData.currentPassword} onChange={(event) => setPasswordData((value) => ({ ...value, currentPassword: event.target.value }))} className="h-10 rounded-xl border border-white/10 bg-[#08080c] px-3 text-xs text-white outline-none focus:border-indigo-500" /><input type="password" autoComplete="new-password" placeholder="New password (8+ characters)" value={passwordData.newPassword} onChange={(event) => setPasswordData((value) => ({ ...value, newPassword: event.target.value }))} className="h-10 rounded-xl border border-white/10 bg-[#08080c] px-3 text-xs text-white outline-none focus:border-indigo-500" /></div>
            <button type="submit" disabled={passwordSaving} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50">{passwordSaving ? "Updating…" : "Update Password"}</button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Resume</h3>
          <p className="text-[11px] text-gray-500 mb-4">Upload your most recent resume to enable one-click applications.</p>

          {resumeName ? (
            <div className="rounded-xl border border-white/10 bg-white/3 p-4 text-center">
              <HiDocumentText className="text-2xl text-indigo-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-white truncate">{resumeName}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Last updated recently</p>
              <div className="flex gap-2 justify-center mt-3">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-300 hover:bg-white/5 transition">Replace<input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(event) => upload("resume", event.target.files?.[0])} /></label>
                <button type="button" onClick={async () => { const { data } = await authClient.getSession(); await api.updateProfile({ resumeUrl: null }, data?.session?.token); setResumeName(null); }}
                  className="px-3 py-1.5 rounded-lg border border-red-500/20 text-[11px] text-red-400 hover:bg-red-500/10 transition cursor-pointer">Remove</button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/2 p-8 cursor-pointer hover:border-indigo-500/40 transition">
              <HiDocumentText className="text-2xl text-gray-500 mb-2" />
              <span className="text-[11px] text-gray-400">Click to upload PDF resume</span>
              <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(event) => upload("resume", event.target.files?.[0])} />
            </label>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
        <h3 className="text-sm font-semibold text-white mb-5">Professional Details</h3>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Professional Headline</label>
            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior UX/UI Designer"
              className="w-full h-10 px-3 rounded-xl bg-[#08080c] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition" />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
              placeholder="Tell recruiters about yourself..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#08080c] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none" />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400 cursor-pointer">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="flex-1 h-9 px-3 rounded-xl bg-[#08080c] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition" />
              <button type="button" onClick={addSkill}
                className="px-3 h-9 rounded-xl border border-white/10 text-[11px] text-gray-300 hover:bg-white/5 transition cursor-pointer">Add</button>
            </div>
          </div>

          <button type="button" onClick={handleSaveDetails} disabled={saving}
            className="mt-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer">
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
