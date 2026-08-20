"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiHome, HiArrowLeft } from "react-icons/hi2";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080c] p-6 text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Glow background effects */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0f]/80 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl text-center space-y-6">
        {/* Branding Logo */}
        <div className="inline-block">
          <Link
            href="/"
            className="text-xl font-black tracking-tight inline-flex items-center"
          >
            <span className="text-white">hire</span>
            <span className="text-blue-500">l</span>
            <span className="text-orange-500">oop</span>
          </Link>
        </div>

        {/* 404 Details */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
            404
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
          >
            <HiHome className="text-sm" />
            Back to Home
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <HiArrowLeft className="text-sm" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
