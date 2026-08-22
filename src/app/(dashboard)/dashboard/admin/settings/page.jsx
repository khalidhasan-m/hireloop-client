"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { HiCheckCircle, HiShieldCheck, HiUser, HiCloudArrowUp } from "react-icons/hi2";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function AdminSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setAvatarUrl(user.image || "");
  }, [user]);

  const uploadAvatar = async (file) => {
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, GIF, or WebP image.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Avatar images must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const { data } = await authClient.getSession();
      const result = await api.uploadAvatar(file, data?.session?.token);
      const nextUrl = result?.data?.url;
      if (!nextUrl) throw new Error("The server did not return an avatar URL");
      setAvatarUrl(nextUrl);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error.message || "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const { data } = await authClient.getSession();
      const result = await api.updateProfile({ name: name.trim(), email, image: avatarUrl }, data?.session?.token);
      if (!result?.success) throw new Error(result?.message || "Unable to update profile");
      toast.success("Admin profile saved");
    } catch (error) {
      toast.error(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (!password.currentPassword || !password.newPassword) {
      toast.error("Enter your current and new password");
      return;
    }
    if (password.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await authClient.changePassword(password);
      if (error) throw new Error(error.message);
      setPassword({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.message || "Unable to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isPending) return <div className="py-20 text-center text-sm text-gray-500">Loading settings…</div>;
  if (!user) return <div className="py-20 text-center text-sm text-gray-400">Please log in to access Admin Settings.</div>;

  return (
    <div className="w-full space-y-7 pb-12 text-white">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-indigo-400">Admin Console</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-2 text-xs text-gray-400 sm:text-sm">Manage your administrator profile, profile picture, and account security.</p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <form onSubmit={saveProfile} className="rounded-xl border border-white/10 bg-[#171719] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[.07] pb-4">
            <div>
              <h2 className="text-sm font-medium">Administrator Profile</h2>
              <p className="mt-1 text-[11px] text-gray-500">Your identity shown across the admin console.</p>
            </div>
            <HiShieldCheck className="text-lg text-indigo-400" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-lg border border-white/[.07] bg-[#111113] p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-tr from-indigo-500 to-purple-500 text-xl font-semibold text-white">
              {avatarUrl ? <img src={avatarUrl} alt={`${name || "Admin"} profile`} className="h-full w-full object-cover" /> : <HiUser />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white">Profile picture</p>
              <p className="mt-1 text-[10px] text-gray-500">JPG, PNG, GIF, or WebP. Maximum file size: 5MB.</p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[.05] px-3 py-2 text-[10px] font-semibold text-gray-200 transition hover:bg-white/10">
                <HiCloudArrowUp className="text-sm" />
                {uploading ? "Uploading…" : "Upload new picture"}
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" disabled={uploading} onChange={(event) => uploadAvatar(event.target.files?.[0])} />
              </label>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-[11px] text-gray-400">Full Name<input aria-label="Full name" type="text" value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0d0d10] px-3 text-xs text-white outline-none transition focus:border-indigo-500" /></label>
            <label className="grid gap-2 text-[11px] text-gray-400">Email Address<input aria-label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0d0d10] px-3 text-xs text-white outline-none transition focus:border-indigo-500" /></label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[.07] pt-4">
            <span className="text-[10px] text-gray-500">Changes are saved to your live administrator profile.</span>
            <button type="submit" disabled={saving} className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>

        <section className="rounded-xl border border-white/10 bg-[#171719] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[.07] pb-4"><div><h2 className="text-sm font-medium">Account Status</h2><p className="mt-1 text-[11px] text-gray-500">Current administrator access.</p></div><HiCheckCircle className="text-lg text-emerald-400" /></div>
          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-[#111113] px-3 py-3"><span className="text-gray-400">Role</span><span className="rounded border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[9px] font-semibold uppercase text-amber-300">Administrator</span></div>
            <div className="flex items-center justify-between rounded-lg bg-[#111113] px-3 py-3"><span className="text-gray-400">Access</span><span className="text-emerald-400">Full platform access</span></div>
            <div className="flex items-center justify-between rounded-lg bg-[#111113] px-3 py-3"><span className="text-gray-400">Account</span><span className="text-emerald-400">Active</span></div>
          </div>
        </section>
      </div>

      <form onSubmit={changePassword} className="rounded-xl border border-white/10 bg-[#171719] p-5 sm:p-6">
        <div className="border-b border-white/[.07] pb-4"><h2 className="text-sm font-medium">Security &amp; Access</h2><p className="mt-1 text-[11px] text-gray-500">Update the password used to access the administrator account.</p></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[11px] text-gray-400">Current Password<input aria-label="Current password" type="password" autoComplete="current-password" value={password.currentPassword} onChange={(event) => setPassword((value) => ({ ...value, currentPassword: event.target.value }))} className="h-10 rounded-lg border border-white/10 bg-[#0d0d10] px-3 text-xs text-white outline-none focus:border-indigo-500" /></label>
          <label className="grid gap-2 text-[11px] text-gray-400">New Password<input aria-label="New password" type="password" autoComplete="new-password" value={password.newPassword} onChange={(event) => setPassword((value) => ({ ...value, newPassword: event.target.value }))} className="h-10 rounded-lg border border-white/10 bg-[#0d0d10] px-3 text-xs text-white outline-none focus:border-indigo-500" /></label>
        </div>
        <div className="mt-5 flex justify-end border-t border-white/[.07] pt-4"><button type="submit" disabled={passwordSaving} className="rounded-lg border border-white/10 bg-white/[.05] px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 disabled:opacity-50">{passwordSaving ? "Updating…" : "Update Password"}</button></div>
      </form>
    </div>
  );
}
