"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HiUsers, HiUserGroup, HiNoSymbol, HiUserPlus } from "react-icons/hi2";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
const getToken = async () => (await authClient.getSession()).data?.session?.token;

function csvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      if (query) params.set("email", query);
      if (role !== "all") params.set("role", role);
      const res = await fetch(`${API}/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setUsers(json.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [query, role]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!deleteTarget) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") setDeleteTarget(null); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteTarget]);

  const action = async (id, path, body) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/admin/users/${id}/${path}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success(json.message);
      load();
    } catch (error) {
      toast.error(error.message || "Action failed");
    }
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API}/admin/users/${deleteTarget.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success(json.message);
      setDeleteTarget(null);
      load();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const exportList = () => {
    if (!users.length) {
      toast("There are no users in the current filter to export.");
      return;
    }
    const headers = ["name", "email", "role", "plan", "status", "createdAt"];
    const rows = users.map((user) => [user.name, user.email, user.role, user.plan, user.isSuspended ? "Suspended" : "Active", user.createdAt]);
    const csv = [headers, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
    const blobUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `hireloop-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
    toast.success(`${users.length} users exported`);
  };

  const active = users.filter((user) => !user.isSuspended).length;
  const recruiters = users.filter((user) => user.role === "recruiter").length;
  const suspended = users.filter((user) => user.isSuspended).length;
  const cards = [["Total Active Users", active, HiUsers], ["Recruiter Users", recruiters, HiUserGroup], ["Suspended Accounts", suspended, HiNoSymbol], ["Visible Results", users.length, HiUserPlus]];

  return (
    <main className="space-y-7 text-white">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[.22em] text-indigo-400">Admin Console</p><h1 className="mt-2 text-3xl font-bold">User Management</h1><p className="mt-1 text-sm text-gray-400">Review, filter, and manage platform access for all users.</p></div>
        <div className="flex shrink-0 flex-nowrap items-center gap-2">
          <select aria-label="Filter users by role" value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-white/10 bg-[#111118] px-4 py-2.5 text-xs text-white"><option value="all">All Roles</option><option value="seeker">Seekers</option><option value="recruiter">Recruiters</option></select>
          <button type="button" onClick={exportList} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black">Export List</button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#151519] p-5"><div className="flex justify-between text-gray-400"><span className="text-[11px]">{label}</span><Icon className="text-lg text-indigo-400" /></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-2 text-[10px] text-emerald-400">Updated just now</p></div>)}</div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151519]"><table className="w-full min-w-[900px] text-left text-xs"><thead className="border-b border-white/10 text-[10px] uppercase text-gray-500"><tr><th className="p-4">User Name</th><th className="p-4">Email Address</th><th className="p-4">Role</th><th className="p-4">Join Date</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{loading ? <tr><td className="p-8 text-center" colSpan="6">Loading…</td></tr> : users.length === 0 ? <tr><td className="p-8 text-center text-gray-400" colSpan="6">No users found for this filter.</td></tr> : users.map((user) => <tr key={user._id || user.id} className="border-b border-white/5"><td className="p-4 font-medium">{user.name || "Unnamed user"}</td><td className="p-4 text-gray-400">{user.email}</td><td className="p-4 capitalize">{user.role || "seeker"}</td><td className="p-4 text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td><td className="p-4"><span className={`rounded-full px-2 py-1 text-[10px] ${user.isSuspended ? "bg-red-400/10 text-red-300" : "bg-emerald-400/10 text-emerald-300"}`}>{user.isSuspended ? "Suspended" : "Active"}</span></td><td className="p-4 text-right"><div className="flex justify-end gap-2">{user.role === "seeker" && <button type="button" onClick={() => action(user._id || user.id, "role", { role: "recruiter" })} className="text-[10px] text-cyan-300">Make Recruiter</button>}{user.role === "recruiter" && <button type="button" onClick={() => action(user._id || user.id, "role", { role: "seeker" })} className="text-[10px] text-cyan-300">Make Seeker</button>}<button type="button" onClick={() => action(user._id || user.id, "suspend", { suspended: !user.isSuspended })} className={`text-[10px] ${user.isSuspended ? "text-emerald-300" : "text-red-300"}`}>{user.isSuspended ? "Activate" : "Suspend"}</button>{user.isSuspended && <button type="button" onClick={() => setDeleteTarget({ id: user._id || user.id, name: user.name || user.email || "this user" })} className="text-[10px] text-rose-300">Delete</button>}</div></td></tr>)}</tbody></table></div>
      {deleteTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}><div role="alertdialog" aria-modal="true" aria-labelledby="delete-user-title" aria-describedby="delete-user-description" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151519] p-6 shadow-2xl"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-400/10 text-rose-300">!</div><div><h2 id="delete-user-title" className="text-base font-semibold text-white">Delete suspended user?</h2><p id="delete-user-description" className="mt-2 text-sm leading-6 text-gray-400">This permanently deletes <span className="font-medium text-gray-200">{deleteTarget.name}</span> and cannot be undone.</p></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/5">Cancel</button><button type="button" onClick={deleteUser} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-400">Delete User</button></div></div></div>}
    </main>
  );
}
