"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { HiCheck, HiShieldCheck, HiArrowRight } from "react-icons/hi2";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("session_id") || "cs_test_a1b4e3j70J810x80...";

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-600/15 blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0b0e]/95 p-8 shadow-[0_20px_50px_rgba(0,0,0,.6)] backdrop-blur-xl text-center space-y-6"
      >
        <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

        {/* Green Checkmark Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <HiCheck className="text-3xl stroke-2" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
            Upgrade Successful
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Welcome to Hireloop Pro
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            Your payment of{" "}
            <span className="text-white font-semibold">$20.00</span> was
            received perfectly.
          </p>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed bg-[#111116] border border-white/5 p-3.5 rounded-xl">
          All advanced premium recruiting modules are unlocked on your account.{" "}
          <span className="text-emerald-400 font-medium">
            You may need to re-authenticate to see the effect.
          </span>
        </p>

        {/* Session ID Box */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#111116] border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <HiShieldCheck className="text-emerald-400 text-base shrink-0" />
            <span className="font-medium">Session ID verified</span>
          </div>
          <span className="font-mono text-[11px] text-gray-500 truncate max-w-40">
            {sessionId}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="#"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <span>Go to Workspace Dashboard</span>
            <HiArrowRight className="text-sm" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden pb-16">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-xs text-gray-500">
            Loading success details...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
