"use client";

import React from "react";
import Link from "next/link";
import { HiBars3, HiBell, HiHome } from "react-icons/hi2";

export default function DashboardHeader({ user, setMobileSidebarOpen }) {
  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-8 border-b border-white/10 bg-[#030305]/80 backdrop-blur-xl">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen?.(true)}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <HiBars3 className="text-xl" />
        </button>

        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition"
        >
          <HiHome className="text-sm" />
          <span>Home</span>
        </Link>
      </div>

      {/* Right: notifications + user mini */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer">
          <HiBell className="text-lg" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-xs font-medium text-gray-300 max-w-[120px] truncate">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
