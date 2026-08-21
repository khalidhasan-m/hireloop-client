"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      const res = await fetch(`${API}/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setPayments(json.data || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Payments</h1>
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-[11px]">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Plan</th>
              <th className="py-3 px-5">Amount</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-500">No payments</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} className="hover:bg-white/2">
                  <td className="py-3 px-5 text-gray-300 font-mono text-[10px]">{p.userId}</td>
                  <td className="py-3 px-5 text-white">{p.plan}</td>
                  <td className="py-3 px-5 text-gray-300">${Number(p.amount || 0).toFixed(2)}</td>
                  <td className="py-3 px-5 text-emerald-400 uppercase text-[10px] font-bold">{p.status}</td>
                  <td className="py-3 px-5 text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
