"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export default function AdminSettings() {
  const [form, setForm] = useState({ name: "", email: "", image: "" }); const [saving, setSaving] = useState(false);
  useEffect(() => { authClient.getSession().then(({ data }) => setForm({ name: data?.user?.name || "", email: data?.user?.email || "", image: data?.user?.image || "" })); }, []);
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { const { data } = await authClient.getSession(); await api.updateProfile(form, data?.session?.token); toast.success("Profile updated"); } catch (error) { toast.error(error.message || "Unable to update profile"); } finally { setSaving(false); } };
  return <main className="max-w-xl space-y-6 text-white"><div><h1 className="text-2xl font-bold">Admin settings</h1><p className="text-sm text-gray-400">Update your platform operator profile.</p></div><form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[.03] p-6">{[["name", "Name"], ["email", "Email"], ["image", "Avatar URL"]].map(([name, label]) => <label key={name} className="grid gap-2 text-sm text-gray-300">{label}<input name={name} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /></label>)}<button disabled={saving} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black">{saving ? "Saving…" : "Save changes"}</button></form></main>;
}
