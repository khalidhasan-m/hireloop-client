"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setUsers(json.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleSuspend = async (user) => {
    try {
      const token = await getToken();
      await fetch(`${API}/admin/users/${user._id || user.id}/suspend`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ suspended: !user.isSuspended }),
      });
      toast.success(user.isSuspended ? "User unsuspended" : "User suspended");
      load();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Manage Users</h1>
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-[11px]">
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Plan</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-500">No users</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id || u.id} className="hover:bg-white/2">
                  <td className="py-3 px-5 text-white font-medium">{u.name || "—"}</td>
                  <td className="py-3 px-5 text-gray-400">{u.email}</td>
                  <td className="py-3 px-5 text-gray-300 capitalize">{u.role || "seeker"}</td>
                  <td className="py-3 px-5 text-gray-300">{u.plan || "FREE"}</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => toggleSuspend(u)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                        u.isSuspended ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"
                      }`}>{u.isSuspended ? "Unsuspend" : "Suspend"}</button>
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
