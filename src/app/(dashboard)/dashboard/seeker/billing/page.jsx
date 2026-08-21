"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { SEEKER_PLANS } from "@/lib/constants";
import { HiCheckCircle, HiArrowDownTray } from "react-icons/hi2";
import { cancelSubscription } from "@/lib/api/payments";

export default function SeekerBillingPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  const planKey = (user?.plan || "FREE").toUpperCase();
  const currentPlan = SEEKER_PLANS[planKey] || SEEKER_PLANS.FREE;

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this subscription at the end of the current billing period?")) return;
    try {
      const token = await getToken();
      await cancelSubscription(token);
      toast.success("Subscription scheduled to cancel at period end");
    } catch (error) {
      toast.error(error.message || "Unable to cancel subscription");
    }
  };
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"}/payments/my`,
          { headers: { Authorization: `Bearer ${token}` }, credentials: "include" },
        );
        if (res.ok) {
          const json = await res.json();
          setPayments(json?.data || []);
        }
      } catch {
        setPayments([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const features = currentPlan.features || [];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Subscription & Billing
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your plan features, recurring payments, and billing history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex text-[9px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                Current Plan
              </span>
              <h2 className="text-xl font-bold text-white mt-2">
                {currentPlan.name}{currentPlan.price > 0 ? " Tier" : ""}
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                {currentPlan.price === 0
                  ? "Basic access with limited applications."
                  : "Unlock more applications and premium features."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">
                ${currentPlan.price}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-300">
                <HiCheckCircle className="text-emerald-400 text-sm shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/pricing" className="inline-flex px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition">
              Upgrade Plan
            </Link>
            <Link href="/pricing" className="inline-flex px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer">
              Manage Plan
            </Link>
            {currentPlan.price > 0 && <button type="button" onClick={handleCancel} className="inline-flex px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs font-medium text-red-300 hover:bg-red-500/10 transition cursor-pointer">Cancel at period end</button>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Payment Method</h3>
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Secure by Stripe
            </span>
          </div>
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-4 min-h-[100px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-6 rounded bg-gradient-to-r from-yellow-400 to-yellow-600" />
              <span className="text-[10px] font-bold text-gray-400">VISA</span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Add a card after upgrading to a paid plan.
            </p>
          </div>
          <button className="mt-4 w-full text-center text-[11px] text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            + Add New Payment Method
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Billing History</h3>
          <button className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition cursor-pointer">
            <HiArrowDownTray className="text-sm" /> Export PDF
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Date</th>
                <th className="py-3.5 px-5 font-semibold">Plan</th>
                <th className="py-3.5 px-5 font-semibold">Amount</th>
                <th className="py-3.5 px-5 font-semibold">Transaction ID</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 animate-pulse">Loading history...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">No payment history yet.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/2">
                    <td className="py-3.5 px-5 text-gray-300">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="py-3.5 px-5 text-white font-medium">{p.plan || "—"}</td>
                    <td className="py-3.5 px-5 text-gray-300">${Number(p.amount || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-5 text-gray-500 font-mono text-[10px]">{p.transactionId || p.stripeSessionId || "—"}</td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {(p.status || "paid").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Need help with your invoice?</h4>
          <p className="text-xs text-gray-400 mt-0.5">Our support team is available 24/7 to help resolve any payment issues.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer">Contact Support</button>
          <Link href="/pricing" className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition">Read Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}
