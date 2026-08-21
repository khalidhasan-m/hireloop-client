"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SEEKER_PLANS, RECRUITER_PLANS } from "@/lib/constants";
import { HiCheckCircle } from "react-icons/hi2";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function PlanCard({ planKey, plan, role, currentPlan, onUpgrade, loading }) {
  const isCurrent =
    (currentPlan || "FREE").toUpperCase() === planKey.toUpperCase();
  const isFree = plan.price === 0;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        planKey === "PREMIUM" || planKey === "ENTERPRISE"
          ? "border-indigo-500/40 bg-indigo-500/5"
          : "border-white/10 bg-[#0b0b0f]/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
          {isCurrent && (
            <span className="text-[10px] text-emerald-400 font-medium">Current plan</span>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">${plan.price}</span>
          <span className="text-xs text-gray-500">/mo</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2 flex-1">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
            <HiCheckCircle className="text-emerald-400 text-sm shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isFree ? (
          <Link
            href={role === "recruiter" ? "/auth/register" : "/auth/register"}
            className="block w-full text-center px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
          >
            Get started free
          </Link>
        ) : isCurrent ? (
          <button
            type="button"
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-500 cursor-not-allowed"
          >
            Active
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => onUpgrade(planKey, role)}
            className="w-full px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Redirecting..." : "Upgrade"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = (user?.role || "seeker").toLowerCase();
  const currentPlan = user?.plan || "FREE";

  const [tab, setTab] = useState(role === "recruiter" ? "recruiter" : "seeker");
  const [loadingKey, setLoadingKey] = useState(null);

  const plans =
    tab === "recruiter"
      ? Object.entries(RECRUITER_PLANS)
      : Object.entries(SEEKER_PLANS);

  const handleUpgrade = async (planKey, planRole) => {
    if (!user) {
      toast.error("Please log in to upgrade");
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingKey(planKey);
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const res = await fetch(`${API}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          plan: planKey,
          role: planRole || role,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Checkout failed");
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not start checkout. Is Stripe configured?");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
            Choose a plan that matches how you hire or how you job hunt. Upgrade anytime.
          </p>

          <div className="inline-flex mt-8 rounded-xl border border-white/10 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setTab("seeker")}
              className={`px-5 py-2.5 font-medium transition cursor-pointer ${
                tab === "seeker"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Job Seekers
            </button>
            <button
              type="button"
              onClick={() => setTab("recruiter")}
              className={`px-5 py-2.5 font-medium transition cursor-pointer ${
                tab === "recruiter"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Recruiters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(([key, plan]) => (
            <PlanCard
              key={key}
              planKey={key}
              plan={plan}
              role={tab}
              currentPlan={tab === role ? currentPlan : null}
              onUpgrade={handleUpgrade}
              loading={loadingKey === key}
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-10">
          Payments are processed securely by Stripe. You can cancel anytime.
        </p>
      </div>
    </div>
  );
}
