"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  useEffect(() => { if (!id) return; Promise.all([api.getCompanyById(id), api.getAllActiveJobs()]).then(([c, j]) => { setCompany(c.data); setJobs((j.data || []).filter((job) => String(job.companyId) === String(id))); }).catch(() => {}); }, [id]);
  if (!company) return <main className="mx-auto max-w-5xl px-6 py-20 text-gray-400">Loading company…</main>;
  return <main className="mx-auto max-w-5xl px-6 py-16 text-white"><Link href="/companies" className="text-sm text-cyan-300">← All companies</Link><section className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-8"><div className="flex items-center gap-5"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold">{company.logo ? <img src={company.logo} alt="" className="h-full w-full rounded-2xl object-cover" /> : company.name?.[0]}</div><div><h1 className="text-3xl font-bold">{company.name}</h1><p className="mt-1 text-cyan-300">{company.industry}</p><p className="mt-2 text-sm text-gray-400">{company.location || "Location not listed"} · {company.employeeCount || "Team size not listed"}</p></div></div><p className="mt-8 leading-7 text-gray-300">{company.description || "This company has not added a description yet."}</p>{company.website && <a href={company.website} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm text-cyan-300">Visit website ↗</a>}</section><section className="mt-10"><h2 className="text-2xl font-semibold">Open positions</h2><div className="mt-5 grid gap-4">{jobs.length ? jobs.map((job) => <Link key={job._id} href={`/jobs/${job._id}`} className="rounded-2xl border border-white/10 p-5 hover:border-cyan-400/50"><h3 className="font-semibold">{job.title}</h3><p className="mt-2 text-sm text-gray-400">{job.location || "Remote"} · {job.jobType || "Full-time"} · {job.salaryRange || "Salary not listed"}</p></Link>) : <p className="text-gray-400">No open positions currently listed.</p>}</div></section></main>;
}
