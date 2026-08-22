"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HiCreditCard, HiCalendarDays, HiUserGroup, HiBuildingOffice2, HiFunnel, HiArrowDownTray } from "react-icons/hi2";
import { SEEKER_PLANS, RECRUITER_PLANS } from "@/lib/constants";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
const PAGE_SIZE = 10;
const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const dateLabel = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function AdminPaymentsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [upgradePlan, setUpgradePlan] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState(null);

  useEffect(() => { setPage(1); }, [query, status]);
  useEffect(() => {
    if (!upgradeTarget) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") setUpgradeTarget(null); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [upgradeTarget]);
  useEffect(() => {
    (async () => {
      try {
        const token = (await authClient.getSession()).data?.session?.token;
        const headers = { Authorization: `Bearer ${token}` };
        const [paymentsResponse, usersResponse] = await Promise.all([fetch(`${API}/admin/payments`, { headers, credentials: "include" }), fetch(`${API}/admin/users`, { headers, credentials: "include" })]);
        const json = await paymentsResponse.json();
        const usersJson = await usersResponse.json();
        if (!paymentsResponse.ok) throw new Error(json.message || "Failed to load payments");
        setPayments(json.data || []);
        setUsers((usersJson.data || []).filter((user) => ["seeker", "recruiter"].includes(user.role) && !user.isSuspended));
      } catch (error) { toast.error(error.message || "Failed to load payments"); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => payments.filter((payment) => {
    const searchable = `${payment.userEmail || ""} ${payment.userId || ""} ${payment.plan || ""} ${payment.transactionId || ""} ${payment.stripeSessionId || ""}`.toLowerCase();
    return (!query || searchable.includes(query.toLowerCase())) && (status === "all" || String(payment.status || "").toLowerCase() === status);
  }), [payments, query, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const succeeded = payments.filter((payment) => String(payment.status).toLowerCase() === "succeeded" || String(payment.status).toLowerCase() === "success");
  const totalRevenue = succeeded.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const monthlyRevenue = succeeded.filter((payment) => payment.createdAt && new Date(payment.createdAt) >= monthStart).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const cards = [["Total Revenue", money(totalRevenue), HiCreditCard, "text-emerald-400"], ["Monthly Revenue", money(monthlyRevenue), HiCalendarDays, "text-emerald-400"], ["Active Pro Users", payments.filter((payment) => payment.role === "seeker" && succeeded.includes(payment)).length, HiUserGroup, "text-amber-300"], ["Active Enterprise Users", payments.filter((payment) => payment.role === "recruiter" && succeeded.includes(payment)).length, HiBuildingOffice2, "text-emerald-400"]];
  const distribution = ["ENTERPRISE", "PREMIUM", "PRO", "GROWTH", "FREE"].map((plan) => ({ plan, count: succeeded.filter((payment) => String(payment.plan || "").toUpperCase() === plan).length })).filter((item) => item.count > 0 || payments.length === 0);
  const selectedUser = users.find((user) => String(user._id || user.id) === String(selectedUserId));
  const upgradePlans = selectedUser?.role === "recruiter" ? RECRUITER_PLANS : SEEKER_PLANS;
  const applyUpgrade = async () => {
    if (!selectedUserId || !upgradePlan) return toast.error("Choose a user and paid plan first");
    setUpgrading(true);
    try {
      const token = (await authClient.getSession()).data?.session?.token;
      const response = await fetch(`${API}/admin/users/${selectedUserId}/subscription`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ plan: upgradePlan }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Unable to upgrade subscription");
      toast.success(json.message);
      setSelectedUserId(""); setUpgradePlan(""); setUpgradeTarget(null);
    } catch (error) { toast.error(error.message || "Unable to upgrade subscription"); } finally { setUpgrading(false); }
  };
  const exportCsv = () => { const header = "userEmail,plan,amount,date,transactionId,status"; const csv = [header, ...filtered.map((payment) => [payment.userEmail || "", payment.plan || "", payment.amount || 0, payment.createdAt || "", payment.transactionId || payment.stripeSessionId || "", payment.status || ""].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "hireloop-payments.csv"; link.click(); URL.revokeObjectURL(url); };

  return <main className="min-w-0 space-y-7 text-white">
    <div><p className="text-xs text-gray-500">Admin Console</p><h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Payments &amp; Subscriptions</h1><p className="mt-2 text-xs text-gray-400 sm:text-sm">Comprehensive overview of platform revenue and active subscriptions.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, color]) => <div key={label} className="rounded-xl border border-white/10 bg-[#171719] p-4 sm:p-5"><div className="flex items-start justify-between"><span className="text-[10px] text-gray-500">{label}</span><Icon className={`text-base ${color}`} /></div><p className="mt-4 text-2xl font-semibold text-gray-200">{loading ? "…" : value}</p><p className={`mt-2 text-[10px] ${color}`}>Live database total</p></div>)}</div>
    <section className="rounded-xl border border-indigo-400/20 bg-indigo-500/[.04] p-4"><div className="flex flex-wrap items-end gap-3"><div className="min-w-[220px] flex-1"><label className="mb-1.5 block text-[10px] uppercase tracking-wide text-indigo-200">Upgrade user subscription</label><select aria-label="Select user to upgrade" value={selectedUserId} onChange={(event) => { setSelectedUserId(event.target.value); setUpgradePlan(""); }} className="w-full rounded-lg border border-white/10 bg-[#111118] px-3 py-2.5 text-xs text-white"><option value="">Select Seeker or Recruiter</option>{users.map((user) => <option key={user._id || user.id} value={user._id || user.id}>{user.name || user.email} · {user.role} · {user.plan || "FREE"}</option>)}</select></div><div className="min-w-[180px]"><label className="mb-1.5 block text-[10px] uppercase tracking-wide text-indigo-200">Paid plan</label><select aria-label="Select paid plan" value={upgradePlan} onChange={(event) => setUpgradePlan(event.target.value)} disabled={!selectedUser} className="w-full rounded-lg border border-white/10 bg-[#111118] px-3 py-2.5 text-xs text-white disabled:opacity-50"><option value="">Select plan</option>{Object.entries(upgradePlans).filter(([, plan]) => plan.price > 0).map(([key, plan]) => <option key={key} value={key}>{plan.name} · ${plan.price}/month</option>)}</select></div><button type="button" onClick={() => { if (!selectedUserId || !upgradePlan) { toast.error("Choose a user and paid plan first"); return; } setUpgradeTarget({ name: selectedUser?.name || selectedUser?.email || "this user", role: selectedUser?.role || "user", plan: upgradePlan }); }} disabled={upgrading || !selectedUserId || !upgradePlan} className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50">{upgrading ? "Applying…" : "Apply Upgrade"}</button></div><p className="mt-2 text-[10px] text-gray-500">Existing Stripe subscriptions are updated with proration. Users without one receive an admin-granted active plan record.</p></section>
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#171719]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.06] px-4 py-4"><h2 className="text-base font-medium">Recent Transactions</h2><div className="flex items-center gap-2"><label className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#222224] px-3 py-2 text-[10px] text-gray-300"><HiFunnel className="text-gray-500" /><select aria-label="Filter payments by status" value={status} onChange={(event) => setStatus(event.target.value)} className="bg-transparent outline-none"><option value="all">Filter</option><option value="succeeded">Success</option><option value="pending">Pending</option><option value="failed">Failed</option></select></label><button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-black hover:bg-gray-200"><HiArrowDownTray />Export CSV</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-[#222224] text-[9px] uppercase text-gray-500"><tr><th className="px-4 py-3 font-medium">User Email</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Transaction ID</th><th className="px-4 py-3 text-right font-medium">Status</th></tr></thead><tbody className="text-[11px]">{loading ? <tr><td colSpan="6" className="px-4 py-16 text-center text-gray-500">Loading transactions…</td></tr> : rows.length === 0 ? <tr><td colSpan="6" className="px-4 py-16 text-center text-gray-500">No transactions found for this search.</td></tr> : rows.map((payment) => { const normalized = String(payment.status || "pending").toLowerCase(); const statusClass = normalized === "succeeded" || normalized === "success" ? "text-emerald-400 bg-emerald-400/10" : normalized === "failed" ? "text-rose-400 bg-rose-400/10" : "text-amber-300 bg-amber-300/10"; return <tr key={payment._id} className="border-t border-white/[.06] hover:bg-white/[.02]"><td className="px-4 py-4 text-gray-300">{payment.userEmail || payment.userId || "—"}</td><td className="px-4 py-4 text-gray-300">{payment.plan || "—"}</td><td className="px-4 py-4 font-semibold text-gray-200">{money(payment.amount)}</td><td className="px-4 py-4 text-gray-400">{dateLabel(payment.createdAt)}</td><td className="px-4 py-4 font-mono text-[10px] text-gray-500">{payment.transactionId || payment.stripeSessionId || "—"}</td><td className="px-4 py-4 text-right"><span className={`rounded px-2 py-1 text-[9px] uppercase ${statusClass}`}>{normalized}</span></td></tr>; })}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.06] px-4 py-4 text-[10px] text-gray-500"><span>Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} transactions</span><div className="flex items-center gap-1"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="px-2 py-1 disabled:opacity-30">‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} onClick={() => setPage(number)} className={`h-7 min-w-7 rounded px-2 ${number === page ? "bg-white text-black" : "text-gray-400 hover:bg-white/10"}`}>{number}</button>)}<button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="px-2 py-1 disabled:opacity-30">›</button></div></div></section>
    {upgradeTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !upgrading) setUpgradeTarget(null); }}><div role="alertdialog" aria-modal="true" aria-labelledby="upgrade-user-title" aria-describedby="upgrade-user-description" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171719] p-6 shadow-2xl"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-400/10 text-indigo-300">↑</div><div><h2 id="upgrade-user-title" className="text-base font-semibold text-white">Apply subscription upgrade?</h2><p id="upgrade-user-description" className="mt-2 text-sm leading-6 text-gray-400">Upgrade <span className="font-medium text-gray-200">{upgradeTarget.name}</span> ({upgradeTarget.role}) to <span className="font-medium text-indigo-300">{upgradeTarget.plan}</span>.</p><p className="mt-2 text-xs text-gray-500">This updates the user’s active plan and may prorate an existing Stripe subscription.</p></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={upgrading} onClick={() => setUpgradeTarget(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50">Cancel</button><button type="button" disabled={upgrading} onClick={applyUpgrade} className="rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50">{upgrading ? "Applying…" : "Apply Upgrade"}</button></div></div></div>}
    <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]"><section className="rounded-xl border border-white/10 bg-[#171719] p-5"><div className="flex justify-between"><h2 className="text-sm font-medium">Revenue Trend (Last 7 Days)</h2><span className="text-[10px] text-gray-500">USD ($)</span></div><div className="mt-8 flex h-40 items-end gap-2 border-b border-white/[.06] px-2">{Array.from({ length: 7 }, (_, index) => { const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - (6 - index)); const dayTotal = succeeded.filter((payment) => payment.createdAt && new Date(payment.createdAt).toDateString() === day.toDateString()).reduce((sum, payment) => sum + Number(payment.amount || 0), 0); const max = Math.max(...succeeded.map((payment) => Number(payment.amount || 0)), 1); return <div key={index} className="flex h-full flex-1 flex-col justify-end"><div className="rounded-t bg-indigo-400/70" style={{ height: `${Math.max(dayTotal / max * 100, dayTotal ? 8 : 2)}%` }} /><span className="mt-2 text-center text-[9px] text-gray-600">{day.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}</span></div>; })}</div></section><section className="rounded-xl border border-white/10 bg-[#171719] p-5"><h2 className="text-sm font-medium">Plan Distribution</h2>{distribution.map(({ plan, count }) => { const percent = succeeded.length ? Math.round(count / succeeded.length * 100) : 0; return <div key={plan} className="mt-5"><div className="flex justify-between text-[10px]"><span className="text-gray-300">{plan}</span><span className="text-gray-500">{percent}%</span></div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gray-300" style={{ width: `${percent}%` }} /></div></div>; })}<button type="button" onClick={() => toast("Detailed report will use the filtered live transaction set.")} className="mt-6 text-[10px] text-gray-400 underline underline-offset-4 hover:text-white">View detailed report</button></section></div>
  </main>;
}
