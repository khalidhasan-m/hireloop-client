"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { COMPANY_STATUS } from "@/lib/constants";
import { HiBuildingOffice2, HiCheckCircle, HiClock, HiNoSymbol, HiFunnel, HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
const PAGE_SIZE = 5;

const statusStyle = {
  [COMPANY_STATUS.PENDING]: "text-amber-300",
  [COMPANY_STATUS.APPROVED]: "text-emerald-400",
  [COMPANY_STATUS.REJECTED]: "text-rose-400",
};

export default function AdminCompaniesPage() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const token = (await authClient.getSession()).data?.session?.token;
      const response = await fetch(`${API}/admin/companies`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Failed to load companies");
      setCompanies(json.data || []);
    } catch (error) { toast.error(error.message || "Failed to load companies"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => companies.filter((company) => {
    const text = `${company.name || ""} ${company.industry || ""} ${company.recruiterEmail || company.email || ""}`.toLowerCase();
    const query = searchParams.get("q") || "";
    return (!query || text.includes(query.toLowerCase())) && (status === "all" || String(company.status).toLowerCase() === status);
  }), [companies, searchParams, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summary = [
    ["Pending Review", companies.filter((company) => company.status === COMPANY_STATUS.PENDING).length, HiClock, "text-amber-400"],
    ["Approved Partners", companies.filter((company) => company.status === COMPANY_STATUS.APPROVED).length, HiCheckCircle, "text-emerald-400"],
    ["Total Rejections", companies.filter((company) => company.status === COMPANY_STATUS.REJECTED).length, HiNoSymbol, "text-rose-400"],
  ];

  const changeStatus = async (id, nextStatus) => {
    setUpdating(id);
    try {
      const token = (await authClient.getSession()).data?.session?.token;
      const response = await fetch(`${API}/admin/companies/${id}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status: nextStatus }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Unable to update company");
      toast.success(`Company ${nextStatus.toLowerCase()}`);
      await load();
    } catch (error) { toast.error(error.message || "Unable to update company"); }
    finally { setUpdating(null); }
  };

  const selectStatus = (value) => { setStatus(value); setPage(1); };

  return <main className="min-w-0 space-y-7 text-white">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs text-gray-500">Main Content Canvas</p><h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">Company Registrations</h1><p className="mt-2 text-xs text-gray-400 sm:text-sm">Review and manage corporate entity access requests for the HireLoop ecosystem.</p></div>
      <button type="button" onClick={() => toast("Company registrations are submitted by recruiter accounts.")} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-gray-200"><HiPlus />Register New</button>
    </div>

    <div className="flex flex-wrap items-center justify-end gap-3">
      <label className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#151519] px-3 py-2 text-xs text-gray-300"><HiFunnel className="text-gray-500" /><select aria-label="Filter companies by status" value={status} onChange={(event) => selectStatus(event.target.value)} className="bg-transparent outline-none"><option value="all">All Statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
    </div>

    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#171719]">
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#252527] text-[10px] text-gray-400"><tr><th className="px-4 py-4 font-medium">Company Name</th><th className="px-4 py-4 font-medium">Recruiter Email</th><th className="px-4 py-4 font-medium">Industry</th><th className="px-4 py-4 font-medium">Status</th><th className="px-4 py-4 font-medium">Date Submitted</th><th className="px-4 py-4 text-right font-medium">Actions</th></tr></thead><tbody className="text-[11px]">
        {loading ? <tr><td colSpan="6" className="px-4 py-16 text-center text-gray-500">Loading company registrations…</td></tr> : visible.length === 0 ? <tr><td colSpan="6" className="px-4 py-16 text-center text-gray-500">No company registrations found.</td></tr> : visible.map((company) => <tr key={company._id} className="border-t border-white/[.06] transition hover:bg-white/[.02]"><td className="px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded bg-white/[.06] font-semibold text-gray-300">{company.name?.slice(0, 2).toUpperCase() || <HiBuildingOffice2 />}</span><span className="font-medium text-gray-200">{company.name || "Unnamed company"}</span></div></td><td className="px-4 py-4 text-gray-400">{company.recruiterEmail || company.email || "—"}</td><td className="px-4 py-4 text-gray-400">{company.industry || "Other"}</td><td className={`px-4 py-4 font-medium ${statusStyle[company.status] || "text-gray-400"}`}><span className="mr-1">•</span>{company.status || "Pending"}</td><td className="px-4 py-4 text-gray-400">{company.createdAt ? new Date(company.createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "—"}</td><td className="px-4 py-4 text-right">{updating === company._id ? <span className="text-[10px] text-gray-500">Updating…</span> : <div className="flex justify-end gap-2">{company.status !== COMPANY_STATUS.APPROVED && <button type="button" onClick={() => changeStatus(company._id, COMPANY_STATUS.APPROVED)} className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1.5 text-[10px] text-emerald-300 hover:bg-emerald-400/20">Approve</button>}{company.status !== COMPANY_STATUS.REJECTED && <button type="button" onClick={() => changeStatus(company._id, COMPANY_STATUS.REJECTED)} className="rounded border border-rose-400/20 bg-rose-400/10 px-2 py-1.5 text-[10px] text-rose-300 hover:bg-rose-400/20">Reject</button>}</div>}</td></tr>)}
      </tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.06] px-4 py-4 text-[10px] text-gray-500"><span>Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} companies</span><div className="flex items-center gap-1"><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded px-2 py-1 text-gray-500 disabled:opacity-30">‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} onClick={() => setPage(number)} className={`h-7 min-w-7 rounded px-2 ${number === page ? "bg-white text-black" : "text-gray-400 hover:bg-white/10"}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded px-2 py-1 text-gray-500 disabled:opacity-30">›</button></div></div>
    </section>

    <div className="grid gap-4 md:grid-cols-3">{summary.map(([label, value, Icon, color]) => <div key={label} className="rounded-xl border border-white/10 bg-[#171719] p-5"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span><Icon className={`text-base ${color}`} /></div><p className="mt-4 text-2xl font-semibold text-gray-200">{value}</p><p className="mt-2 text-[10px] text-gray-600">Live database total</p></div>)}</div>
  </main>;
}
