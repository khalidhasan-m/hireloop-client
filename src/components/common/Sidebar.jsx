"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HiHome,
  HiBuildingOffice2,
  HiBriefcase,
  HiDocumentText,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiXMark,
  HiBookmark,
  HiCreditCard,
  HiUsers,
  HiChartBar,
  HiShieldCheck,
  HiMagnifyingGlass,
} from "react-icons/hi2";

// Navigation links per role
const NAV_LINKS = {
  seeker: [
    { name: "Dashboard", href: "/dashboard/seeker", icon: HiHome },
    { name: "Browse Jobs", href: "/dashboard/seeker/jobs", icon: HiMagnifyingGlass },
    { name: "Saved Jobs", href: "/dashboard/seeker/saved", icon: HiBookmark },
    { name: "My Applications", href: "/dashboard/seeker/applications", icon: HiDocumentText },
    { name: "Billing", href: "/dashboard/seeker/billing", icon: HiCreditCard },
    { name: "Settings", href: "/dashboard/seeker/settings", icon: HiCog6Tooth },
  ],
  recruiter: [
    { name: "Dashboard", href: "/dashboard/recruiter", icon: HiHome },
    { name: "My Company", href: "/dashboard/recruiter/company", icon: HiBuildingOffice2 },
    { name: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: HiBriefcase },
    { name: "Applications", href: "/dashboard/recruiter/applications", icon: HiDocumentText },
    { name: "Billing", href: "/dashboard/recruiter/billing", icon: HiCreditCard },
    { name: "Settings", href: "/dashboard/recruiter/settings", icon: HiCog6Tooth },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: HiHome },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: HiUsers },
    { name: "Manage Companies", href: "/dashboard/admin/companies", icon: HiBuildingOffice2 },
    { name: "Manage Jobs", href: "/dashboard/admin/jobs", icon: HiBriefcase },
    { name: "Payments", href: "/dashboard/admin/payments", icon: HiChartBar },
    { name: "Settings", href: "/dashboard/admin/settings", icon: HiCog6Tooth },
  ],
};

const ROLE_LABELS = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
};

const ROLE_COLORS = {
  seeker: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  recruiter: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  admin: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const PLAN_LABELS = { FREE: "Free Account", PRO: "Professional Plan", PREMIUM: "Premium Plan", GROWTH: "Growth Plan", ENTERPRISE: "Enterprise Plan" };

export default function Sidebar({
  user,
  isPending,
  handleLogout,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const role = (user?.role || "seeker").toLowerCase();
  const links = NAV_LINKS[role] || NAV_LINKS.seeker;
  const roleLabel = ROLE_LABELS[role] || "User";
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS.seeker;
  const plan = String(user?.plan || "FREE").toUpperCase();
  const planLabel = role === "admin" ? "System Administrator" : PLAN_LABELS[plan] || `${plan} Plan`;
  const adminChrome = role === "admin";

  const isActive = (href) => {
    if (href === `/dashboard/${role}`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08080c]/95 backdrop-blur-xl border-r border-white/10">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
        <Link
          href="/"
          className="inline-flex items-center text-2xl font-black tracking-tight"
        >
          <span className="text-white">hire</span>
          <span className="text-blue-500">l</span>
          <span className="text-orange-500">oop</span>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
          >
            <HiXMark className="text-xl" />
          </button>
        )}
      </div>

      {/* User card */}
      <div className={`${adminChrome ? "p-2 mx-2 mt-3 rounded-lg" : "p-3 mx-3 mt-4 rounded-2xl"} border border-white/10 bg-white/2 flex items-center gap-3`}>
        {isPending ? (
          <div className="animate-pulse flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-white/10 rounded w-3/4" />
              <div className="h-2 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 rounded-full relative overflow-hidden border border-white/10 bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user?.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Role and account status */}
      <div className={`${adminChrome ? "mx-2 mt-2 px-2 py-1.5 rounded-md" : "mx-3 mt-3 px-3 py-2 rounded-lg"} border border-white/10 bg-white/3`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</span>
          <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleColor}`}>{roleLabel}</span>
        </div>
        <p className="mt-1 truncate text-[10px] font-medium text-gray-300">{planLabel}</p>
      </div>

      {/* Navigation */}
      <nav className={`${adminChrome ? "px-2 py-4 space-y-0.5" : "px-3 py-5 space-y-1"} flex-1 overflow-y-auto`}>
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center gap-2 ${adminChrome ? "px-3 py-2 rounded-lg text-[10px]" : "px-4 py-2.5 rounded-xl text-xs"} font-medium transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white border border-white/10 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`text-base ${active ? "text-indigo-400" : ""}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`${adminChrome ? "p-3" : "p-5"} border-t border-white/10`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
        >
          <HiArrowRightOnRectangle className="text-base" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 lg:w-56`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 max-w-[85vw] h-full z-50 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
