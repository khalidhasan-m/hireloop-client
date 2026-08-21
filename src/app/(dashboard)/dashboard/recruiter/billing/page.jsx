"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { getMyPayments, createCheckoutSession } from "@/lib/api/payments";
import toast from "react-hot-toast";

const plans = [{ key: "FREE", name: "Free", price: 0, limit: 3 }, { key: "GROWTH", name: "Growth", price: 49, limit: 10 }, { key: "ENTERPRISE", name: "Enterprise", price: 149, limit: 50 }];
export default function RecruiterBilling() {
  const [user, setUser] = useState(null); const [jobs, setJobs] = useState([]); const [payments, setPayments] = useState([]);
  useEffect(() => { authClient.getSession().then(async ({ data }) => { const token = data?.session?.token; setUser(data?.user); try { const [j, p] = await Promise.all([api.getMyJobs(token), getMyPayments(token)]); setJobs(j.data || []); setPayments(p.data || []); } catch {} }); }, []);
  const current = String(user?.plan || "FREE").toUpperCase();
  const checkout = async (plan) => { try { const { data } = await authClient.getSession(); const result = await createCheckoutSession(plan, "recruiter", data?.session?.token); if (result.url) window.location.href = result.url; } catch (error) { toast.error(error.message || "Unable to start checkout"); } };
  return <main className="max-w-5xl space-y-8 text-white"><div><h1 className="text-2xl font-bold">Subscription & billing</h1><p className="mt-1 text-sm text-gray-400">Current plan: <span className="text-cyan-300">{current}</span> · Active jobs: {jobs.filter((job) => job.status === "active").length}</p></div><div className="grid gap-4 md:grid-cols-3">{plans.map((plan) => <div key={plan.key} className={`rounded-2xl border p-6 ${current === plan.key ? "border-cyan-400" : "border-white/10"}`}><h2 className="font-semibold">{plan.name}</h2><p className="mt-3 text-3xl font-bold">${plan.price}<span className="text-sm text-gray-400">/month</span></p><p className="mt-3 text-sm text-gray-400">Up to {plan.limit} active job posts</p>{plan.key !== current && <button onClick={() => checkout(plan.key)} className="mt-5 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black">Choose plan</button>}</div>)}</div><section><h2 className="mb-3 text-xl font-semibold">Payment history</h2><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead><tr className="border-b border-white/10 text-gray-400"><th className="p-4">Date</th><th className="p-4">Plan</th><th className="p-4">Amount</th><th className="p-4">Transaction</th><th className="p-4">Status</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment._id} className="border-b border-white/5"><td className="p-4">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}</td><td className="p-4">{payment.plan}</td><td className="p-4">${Number(payment.amount || 0).toFixed(2)}</td><td className="p-4 text-xs text-gray-400">{payment.stripeSessionId || payment.transactionId || "—"}</td><td className="p-4">{payment.status}</td></tr>)}</tbody></table></div></section></main>;
}
