"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const industries = ["all", "Fintech", "AI", "Developer Tools", "E-Commerce", "Healthcare", "Other"];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [industry, setIndustry] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCompanies(industry).then((response) => setCompanies(response.data || [])).catch(() => setCompanies([])).finally(() => setLoading(false));
  }, [industry]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 text-white">
      <div className="mb-10"><p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Discover teams</p><h1 className="mt-3 text-4xl font-bold">Companies hiring on HireLoop</h1><p className="mt-3 max-w-2xl text-gray-400">Explore verified companies and their open opportunities.</p></div>
      <div className="mb-8 flex flex-wrap gap-2">{industries.map((item) => <button key={item} onClick={() => setIndustry(item)} className={`rounded-full border px-4 py-2 text-sm ${industry === item ? "border-cyan-400 bg-cyan-400/15 text-cyan-300" : "border-white/10 text-gray-400"}`}>{item}</button>)}</div>
      {loading ? <p className="text-gray-400">Loading companies…</p> : companies.length === 0 ? <p className="rounded-2xl border border-white/10 p-8 text-gray-400">No approved companies found.</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{companies.map((company) => <Link href={`/companies/${company._id}`} key={company._id} className="rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-cyan-400/50"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-xl font-bold">{company.logo ? <img src={company.logo} alt="" className="h-full w-full rounded-xl object-cover" /> : company.name?.[0]}</div><div><h2 className="font-semibold">{company.name}</h2><p className="text-sm text-cyan-300">{company.industry}</p></div></div><p className="mt-5 text-sm text-gray-400">{company.location || "Location not listed"} · {company.employeeCount || "Team size not listed"}</p><p className="mt-3 text-sm text-gray-300">{company.openJobs || 0} open jobs</p></Link>)}</div>}
    </main>
  );
}
