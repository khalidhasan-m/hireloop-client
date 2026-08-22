"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiBars3, HiBell, HiHome, HiMagnifyingGlass, HiEnvelope, HiCheck } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { createNotificationPolling } from "@/lib/notificationPolling";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
}

export default function DashboardHeader({ user, setMobileSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [panel, setPanel] = useState(null);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const close = (event) => { if (panelRef.current && !panelRef.current.contains(event.target)) setPanel(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const refreshDashboardUpdates = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (!token) return;
      const [notificationResponse, messageResponse] = await Promise.all([api.getNotifications(token), api.getMessages(token)]);
      setNotifications(notificationResponse.data || []);
      setMessages(messageResponse.data || []);
    } catch (error) { console.error("Failed to refresh dashboard updates:", error); }
    finally { if (showLoading) setLoading(false); }
  };

  const loadPanel = async (nextPanel) => {
    setPanel((current) => current === nextPanel ? null : nextPanel);
    if (panel === nextPanel) return;
    await refreshDashboardUpdates(true);
  };

  useEffect(() => {
    const poller = createNotificationPolling({
      getUpdates: async () => {
        const { data } = await authClient.getSession();
        const token = data?.session?.token;
        if (!token) return {};
        const results = await Promise.allSettled([api.getNotifications(token), api.getMessages(token)]);
        const [notificationResult, messageResult] = results;
        if (notificationResult.status === "rejected") console.error("Failed to refresh notifications:", notificationResult.reason);
        if (messageResult.status === "rejected") console.error("Failed to refresh messages:", messageResult.reason);
        return {
          notifications: notificationResult.status === "fulfilled" ? notificationResult.value.data || [] : null,
          messages: messageResult.status === "fulfilled" ? messageResult.value.data || [] : null,
        };
      },
      onNotifications: setNotifications,
      onMessages: setMessages,
      onError: (error) => console.error("Failed to refresh dashboard updates:", error),
    });
    poller.start();
    return () => poller.stop();
  }, [user?.id]);

  const markNotification = async (item) => {
    try { const { data } = await authClient.getSession(); await api.markNotificationRead(item._id, data?.session?.token); setNotifications((items) => items.map((row) => row._id === item._id ? { ...row, readAt: new Date().toISOString() } : row)); } catch (error) { console.error(error); }
  };

  const markMessage = async (item) => {
    if (item.readAt) return;
    try { const { data } = await authClient.getSession(); await api.markMessageRead(item._id, data?.session?.token); setMessages((items) => items.map((row) => row._id === item._id ? { ...row, readAt: new Date().toISOString() } : row)); } catch (error) { console.error(error); }
  };

  useEffect(() => { setSearch(searchParams.get("q") || ""); }, [searchParams]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim()); else params.delete("q");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };
  const isAdmin = pathname.startsWith("/dashboard/admin");
  const searchPlaceholder = pathname.includes("/admin/payments") ? "Search transactions, users, or IDs..." : pathname.includes("/admin/companies") ? "Search companies, recruiters, or industries..." : pathname.includes("/admin/users") ? "Search users by email..." : "Search jobs, companies, or skills...";
  const unreadNotifications = notifications.filter((item) => !item.readAt).length;
  const unreadMessages = messages.filter((item) => !item.readAt && item.recipientId === user?.id).length;

  return <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#08080c]/90 px-4 py-3 backdrop-blur-xl sm:px-7"><div className="flex min-w-0 flex-1 items-center gap-3"><button onClick={() => setMobileSidebarOpen?.(true)} className="rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Open navigation"><HiBars3 className="text-xl" /></button>{!isAdmin && <Link href="/" className="hidden items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 sm:flex"><HiHome className="text-sm" />Home</Link>}<label className={`hidden flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-gray-500 md:flex ${isAdmin ? "max-w-[520px]" : "max-w-[420px]"}`}><HiMagnifyingGlass /><input aria-label="Dashboard search" value={search} onChange={handleSearch} placeholder={searchPlaceholder} className="w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-600" /></label></div><div ref={panelRef} className="relative flex items-center gap-1.5"><button aria-label="Messages" aria-expanded={panel === "messages"} onClick={() => loadPanel("messages")} className="relative rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white"><HiEnvelope className="text-lg" />{unreadMessages > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />}</button><button aria-label="Notifications" aria-expanded={panel === "notifications"} onClick={() => loadPanel("notifications")} className="relative rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white"><HiBell className="text-lg" />{unreadNotifications > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />}</button>{panel && <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#121218] p-3 shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 px-2 pb-3"><h2 className="text-sm font-semibold text-white">{panel === "messages" ? "Messages" : "Notifications"}</h2><span className="text-[10px] text-gray-500">Live updates</span></div>{loading ? <p className="px-2 py-8 text-center text-xs text-gray-500">Loading…</p> : panel === "messages" ? messages.length === 0 ? <p className="px-2 py-8 text-center text-xs text-gray-500">No messages yet.</p> : <div className="max-h-80 overflow-y-auto">{messages.slice(0, 20).map((item) => <button type="button" key={item._id} onClick={() => markMessage(item)} className={`w-full rounded-xl px-2 py-3 text-left hover:bg-white/5 ${item.readAt ? "opacity-60" : ""}`}><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-white">{item.senderName || "HireLoop user"}</p>{!item.readAt && <HiCheck className="text-emerald-400" />}</div><p className="mt-1 line-clamp-2 text-[11px] text-gray-400">{item.body}</p><p className="mt-1 text-[10px] text-gray-600">{formatDate(item.createdAt)}</p></button>)}</div> : notifications.length === 0 ? <p className="px-2 py-8 text-center text-xs text-gray-500">No notifications yet.</p> : <div className="max-h-80 overflow-y-auto">{notifications.slice(0, 20).map((item) => <button type="button" key={item._id} onClick={() => markNotification(item)} className={`w-full rounded-xl px-2 py-3 text-left hover:bg-white/5 ${item.readAt ? "opacity-60" : ""}`}><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-white">{item.title || "Notification"}</p>{!item.readAt && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />}</div><p className="mt-1 text-[11px] text-gray-400">{item.body || "You have a new update."}</p><p className="mt-1 text-[10px] text-gray-600">{formatDate(item.createdAt)}</p></button>)}</div>}</div>}<div className="ml-2 hidden items-center gap-2 border-l border-white/10 pl-3 sm:flex"><div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white">{user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase() || "U"}</div><span className="max-w-[120px] truncate text-xs font-medium text-gray-300">{isAdmin ? "Admin View" : user?.name || "User"}</span></div></div></header>;
}
