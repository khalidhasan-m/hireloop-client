"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export default function EditJob() {
  const { jobId } = useParams(); const router = useRouter(); const [form, setForm] = useState(null);
  useEffect(() => { if (jobId) api.getJobById(jobId).then(({ data }) => setForm(data)).catch(() => toast.error("Unable to load job")); }, [jobId]);
  if (!form) return <main className="text-gray-400">Loading job…</main>;
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); try { const { data } = await authClient.getSession(); await api.updateJob(jobId, form, data?.session?.token); toast.success("Job updated"); router.push("/dashboard/recruiter/jobs"); } catch (error) { toast.error(error.message || "Unable to update job"); } };
  return <main className="max-w-3xl space-y-6 text-white"><h1 className="text-2xl font-bold">Edit job</h1><form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[.03] p-6">{[["title", "Job title"], ["category", "Category"], ["location", "Location"], ["salaryRange", "Salary range"], ["description", "Description"], ["responsibilities", "Responsibilities"], ["requirements", "Requirements"], ["benefits", "Benefits"]].map(([name, label]) => <label key={name} className="grid gap-2 text-sm text-gray-300">{label}{["description", "responsibilities", "requirements", "benefits"].includes(name) ? <textarea name={name} value={form[name] || ""} onChange={update} rows="4" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" /> : <input name={name} value={form[name] || ""} onChange={update} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />}</label>)}<button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black">Save changes</button></form></main>;
}
