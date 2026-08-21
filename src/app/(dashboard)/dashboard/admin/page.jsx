"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { HiUsers, HiBuildingOffice2, HiBriefcase, HiCreditCard } from "react-icons/hi2";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function AdminHomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (!token) return;
      const res = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setStats(json.data);
      else toast.error(json.message || "Failed to load stats");
    } catch (e) {
      toast.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cards = [
    { title: "Users", value: stats?.users, icon: HiUsers, color: "text-blue-400" },
    { title: "Companies", value: stats?.companies, icon: HiBuildingOffice2, color: "text-purple-400" },
    { title: "Pending Companies", value: stats?.pendingCompanies, icon: HiBuildingOffice2, color: "text-amber-400" },
    { title: "Jobs", value: stats?.jobs, icon: HiBriefcase, color: "text-emerald-400" },
    { title: "Applications", value: stats?.applications, icon: HiBriefcase, color: "text-indigo-400" },
    { title: "Payments", value: stats?.payments, icon: HiCreditCard, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Platform overview and moderation controls.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{c.title}</span>
                <Icon className={`text-lg ${c.color}`} />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{loading ? "…" : c.value ?? 0}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
