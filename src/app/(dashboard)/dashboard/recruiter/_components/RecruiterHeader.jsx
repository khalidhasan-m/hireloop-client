"use client";

import React from "react";
import { HiBars3 } from "react-icons/hi2";

export function RecruiterHeader({ user, setMobileSidebarOpen }) {
  return (
    <header className="h-20 border-b border-white/10 bg-[#08080c]/60 backdrop-blur-xl px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white"
        >
          <HiBars3 className="text-xl" />
        </button>
        <span className="text-sm font-semibold text-white">HireLoop Recruiter</span>
      </div>

      {/* Search bar */}
      <div className="hidden sm:flex items-center relative w-96">
        <span className="absolute left-3.5 text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search applications, jobs, or talent..."
          className="w-full h-11 bg-[#101014] border border-white/10 rounded-xl pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 transition"
        />
      </div>

      {/* Profile / notification icons */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition relative">
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          🔔
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{user?.name || "Alex Sterling"}</p>
            <p className="text-[10px] text-gray-500">TechFlow Inc.</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              "A"
            )}
          </div>
        </div>
      </div>
    </header>
  );
}