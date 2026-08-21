"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

const statuses = ["applied", "under_review", "shortlisted", "rejected", "offered"];
export default function ViewApplicants() {
  const { jobId } = useParams(); const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true);
  const load = async () => { try { const { data } = await authClient.getSession(); setRows((await api.getJobApplications(jobId, data?.session?.token)).data || []); } catch (e) { toast.error(e.message || "Unable to load applicants"); } finally { setLoading(false); } };
  useEffect(() => { if (jobId) load(); }, [jobId]);
  const update = async (id, status) => { try { const { data } = await authClient.getSession(); await api.updateApplicationStatus(id, status, data?.session?.token); toast.success("Status updated"); load(); } catch (e) { toast.error(e.message || "Unable to update status"); } };
  return <main className="space-y-6 text-white"><div><h1 className="text-2xl font-bold">Applicants</h1><p className="text-sm text-gray-400">Review candidates and move them through the hiring pipeline.</p></div><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[.03]"><table className="w-full text-left text-sm"><thead><tr className="border-b border-white/10 text-gray-400"><th className="p-4">Applicant</th><th className="p-4">Date applied</th><th className="p-4">Resume</th><th className="p-4">Status</th></tr></thead><tbody>{loading ? <tr><td className="p-6" colSpan="4">Loading…</td></tr> : rows.length === 0 ? <tr><td className="p-6 text-gray-400" colSpan="4">No applicants yet.</td></tr> : rows.map((row) => <tr key={row._id} className="border-b border-white/5"><td className="p-4"><div className="font-medium">{row.candidateName || row.name || "Candidate"}</div><div className="text-xs text-gray-400">{row.candidateEmail || row.email}</div></td><td className="p-4 text-gray-400">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}</td><td className="p-4">{row.resumeUrl ? <a href={row.resumeUrl} target="_blank" rel="noreferrer" className="text-cyan-300">View resume</a> : <span className="text-gray-500">Not provided</span>}</td><td className="p-4"><select value={row.status} onChange={(event) => update(row._id, event.target.value)} className="rounded-lg border border-white/10 bg-[#111118] px-3 py-2 text-white">{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></td></tr>)}</tbody></table></div></main>;
}
