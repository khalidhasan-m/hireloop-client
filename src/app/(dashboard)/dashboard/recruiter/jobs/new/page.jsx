"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export default function PostNewJob() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "", jobType: "Full-time", salaryMin: "", salaryMax: "", currency: "USD", location: "", remote: false, deadline: "", description: "", responsibilities: "", requirements: "", benefits: "" });
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { const { data } = await authClient.getSession(); const token = data?.session?.token; await api.createJob(form, token); toast.success("Job posted"); router.push("/dashboard/recruiter/jobs"); } catch (error) { toast.error(error.message || "Unable to post job. Confirm your company is approved and within its plan limit."); } finally { setSaving(false); } };
  const field = (name, label, type = "text") => <label className="grid gap-2 text-sm text-gray-300">{label}<input required={!["benefits", "salaryMin", "salaryMax", "deadline"].includes(name)} name={name} type={type} value={form[name]} onChange={update} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400" /></label>;
  return <main className="max-w-4xl space-y-7 text-white"><div><h1 className="text-2xl font-bold">Post a new job</h1><p className="mt-1 text-sm text-gray-400">Your approved company and active-job plan limit are checked when submitting.</p></div><form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="grid gap-5 md:grid-cols-2">{field("title", "Job title")}{field("category", "Category")}<label className="grid gap-2 text-sm text-gray-300">Job type<select name="jobType" value={form.jobType} onChange={update} className="rounded-xl border border-white/10 bg-[#111118] px-4 py-3 text-white"><option>Full-time</option><option>Part-time</option><option>Remote</option><option>Contract</option><option>Internship</option></select></label>{field("location", "Location")}{field("salaryMin", "Minimum salary", "number")}{field("salaryMax", "Maximum salary", "number")}{field("deadline", "Application deadline", "date")}<label className="flex items-center gap-3 pt-8 text-sm text-gray-300"><input name="remote" type="checkbox" checked={form.remote} onChange={update} /> Remote position</label></div><div className="grid gap-5">{field("description", "Job description")}{field("responsibilities", "Responsibilities")}{field("requirements", "Requirements")}{field("benefits", "Benefits (optional)")}</div><button disabled={saving} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black disabled:opacity-50">{saving ? "Posting…" : "Post job"}</button></form></main>;
}
