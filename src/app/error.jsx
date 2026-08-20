"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiArrowPath,
  HiHome,
  HiArrowLeft,
  HiExclamationTriangle,
} from "react-icons/hi2";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging
    console.error("Runtime Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080c] p-6 text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Glow background effects */}
      <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

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

        {/* Error Details */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-yellow-500 mb-4 shadow-lg">
            <HiExclamationTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Something went wrong!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            An unexpected error occurred in this route segment. You can try
            resetting the component or navigating away.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
          >
            <HiArrowPath className="text-sm" />
            Try Again
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <HiArrowLeft className="text-sm" />
              Go Back
            </button>
            <Link
              href="/"
              className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <HiHome className="text-sm" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
