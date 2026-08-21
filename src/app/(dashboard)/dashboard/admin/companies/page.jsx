"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { COMPANY_STATUS } from "@/lib/constants";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API}/admin/companies`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setCompanies(json.data || []);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    try {
      const token = await getToken();
      await fetch(`${API}/admin/companies/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      toast.success(`Company ${status}`);
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Manage Companies</h1>
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-[11px]">
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Industry</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-500">Loading...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-500">No companies</td></tr>
            ) : (
              companies.map((c) => (
                <tr key={c._id} className="hover:bg-white/2">
                  <td className="py-3 px-5 text-white font-medium">{c.name}</td>
                  <td className="py-3 px-5 text-gray-400">{c.industry || "—"}</td>
                  <td className="py-3 px-5 text-gray-300">{c.status || "Pending"}</td>
                  <td className="py-3 px-5 text-right space-x-2">
                    {c.status !== COMPANY_STATUS.APPROVED && (
                      <button onClick={() => setStatus(c._id, COMPANY_STATUS.APPROVED)}
                        className="px-3 py-1 rounded-lg text-[11px] border border-emerald-500/30 text-emerald-400 cursor-pointer">Approve</button>
                    )}
                    {c.status !== COMPANY_STATUS.REJECTED && (
                      <button onClick={() => setStatus(c._id, COMPANY_STATUS.REJECTED)}
                        className="px-3 py-1 rounded-lg text-[11px] border border-red-500/30 text-red-400 cursor-pointer">Reject</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
