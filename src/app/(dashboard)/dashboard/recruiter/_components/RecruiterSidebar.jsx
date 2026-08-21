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
} from "react-icons/hi2";

const recruiterLinks = [
  { name: "Dashboard", href: "/dashboard/recruiter", icon: HiHome },
  {
    name: "My Company",
    href: "/dashboard/recruiter/company",
    icon: HiBuildingOffice2,
  },
  { name: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: HiBriefcase },
  {
    name: "Applications",
    href: "/dashboard/recruiter/applications",
    icon: HiDocumentText,
  },
  {
    name: "Settings",
    href: "/dashboard/recruiter/settings",
    icon: HiCog6Tooth,
  },
];

export function RecruiterSidebar({
  user,
  isPending,
  handleLogout,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08080c]/90 backdrop-blur-xl border-r border-white/10">
      {/* Logo area */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-white/10">
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

      {/* User Profile Mini Card */}
      <div className="p-4 mx-5 mt-6 rounded-2xl border border-white/10 bg-white/2 flex items-center gap-3">
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
            <div className="w-11 h-11 rounded-full relative overflow-hidden border border-white/10 bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0">
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
                "?"
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                Recruiter
              </p>
            </div>
          </>
        )}
      </div>

      {/* Premium Badge Container */}
      <div className="mx-5 mt-3 px-3 py-1.5 rounded-lg bg-white/3 border border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
          Account Tier
        </span>
        <span className="text-[9px] font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {user?.plan || "Free"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-5 py-6 space-y-1.5 overflow-y-auto">
        {recruiterLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-medium transition ${
                isActive
                  ? "bg-white/10 text-white font-semibold shadow-md border border-white/5"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions / Logout */}
      <div className="p-5 border-t border-white/10 space-y-2">
        <Link
          href="/"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
        >
          ← Public Site
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
        >
          <HiArrowRightOnRectangle className="text-base" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-[#0b0b0f] flex flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
