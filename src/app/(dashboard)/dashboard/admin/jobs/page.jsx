"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setJobs(json.data || []);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const closeJob = async (id) => {
    try {
      const token = await getToken();
      await fetch(`${API}/admin/jobs/${id}/close`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      toast.success("Job closed");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Manage Jobs</h1>
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-[11px]">
              <th className="py-3 px-5">Title</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Location</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-500">Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-500">No jobs</td></tr>
            ) : (
              jobs.map((j) => (
                <tr key={j._id} className="hover:bg-white/2">
                  <td className="py-3 px-5 text-white font-medium">{j.title}</td>
                  <td className="py-3 px-5 text-gray-300 capitalize">{j.status}</td>
                  <td className="py-3 px-5 text-gray-400">{j.location || "—"}</td>
                  <td className="py-3 px-5 text-right">
                    {j.status === "active" && (
                      <button onClick={() => closeJob(j._id)}
                        className="px-3 py-1 rounded-lg text-[11px] border border-amber-500/30 text-amber-400 cursor-pointer">Force Close</button>
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
