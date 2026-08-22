"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  HiArrowLeft,
  HiMapPin,
  HiBuildingOffice2,
  HiGlobeAlt,
  HiBriefcase,
} from "react-icons/hi2";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    Promise.all([api.getCompanyById(id), api.getAllActiveJobs({ limit: 50 })])
      .then(([c, j]) => {
        if (!active) return;
        setCompany(c.data);
        setJobs((j.data || []).filter((job) => String(job.companyId) === String(id)));
      })
      .catch(() => {
        if (active) {
          setCompany(null);
          setJobs([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-gray-400">Loading company…</main>
    );
  }

  if (!company) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center text-white">
        <h1 className="text-xl font-semibold">Company not found</h1>
        <Link href="/companies" className="mt-4 text-sm text-indigo-400">← Back to companies</Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#030305] text-white">
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <HiArrowLeft /> All companies
        </Link>
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-3xl font-bold">
              {company.logo ? (
                <img src={company.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                company.name?.[0]
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <p className="mt-1 text-indigo-300">{company.industry || "Industry not listed"}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                {company.location && <span className="inline-flex items-center gap-1"><HiMapPin /> {company.location}</span>}
                {company.employeeCount && <span className="inline-flex items-center gap-1"><HiBuildingOffice2 /> {company.employeeCount}</span>}
                <span className="inline-flex items-center gap-1"><HiBriefcase /> {jobs.length} open role{jobs.length === 1 ? "" : "s"}</span>
              </div>
            </div>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold hover:bg-white/10">
                <HiGlobeAlt /> Visit website
              </a>
            )}
          </div>
          <p className="mt-8 leading-7 text-gray-300">{company.description || "This company has not added a description yet."}</p>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Open positions</h2>
          <div className="mt-5 grid gap-4">
            {jobs.length ? jobs.map((job) => (
              <Link key={job._id} href={`/jobs/${job._id}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-indigo-500/40">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{job.location || "Remote"} · {job.jobType || "Full-time"} · {job.salaryRange || "Salary not listed"}</p>
              </Link>
            )) : <p className="text-gray-400">No open positions currently listed.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
