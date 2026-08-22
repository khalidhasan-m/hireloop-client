"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HiSparkles, HiChartBar, HiBolt, HiCheckCircle, HiArrowRight } from "react-icons/hi2";
import { SEEKER_PLANS } from "@/lib/constants";

const PLAN_ICONS = {
  FREE: <HiSparkles className="text-purple-400 text-base" />,
  PRO: <HiChartBar className="text-indigo-400 text-base" />,
  PREMIUM: <HiBolt className="text-amber-400 text-base" />,
};

export default function PricingSection() {
  const plans = Object.entries(SEEKER_PLANS);

  return (
    <section className="relative overflow-hidden bg-[#030305] py-28 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-212.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/4.5 blur-[150px]" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131318]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(0,0,0,.25)] backdrop-blur-md">
              <span className="text-[10px]">💎</span><span className="text-[9px] font-medium uppercase tracking-[0.17em] text-gray-400">Pricing</span>
            </div>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="text-[32px] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-4xl md:text-[44px]">Pay for the leverage, not the listings</motion.h2>
          <p className="text-sm text-gray-400">Choose a plan that matches how you job hunt. Upgrade anytime.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map(([key, plan], index) => (
            <motion.div key={key} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -4 }} className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#0b0b0e]/95 p-7 shadow-[0_15px_45px_rgba(0,0,0,.5)] backdrop-blur-xl transition duration-300 ${key === "PREMIUM" ? "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]" : "border-white/10"}`}>
              <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#111116]">{PLAN_ICONS[key]}</div><h3 className="text-lg font-semibold tracking-tight text-white">{plan.name}</h3></div>
                  <div className="text-right"><span className="text-2xl font-semibold tracking-tight text-white">${plan.price}</span><span className="text-xs font-medium text-gray-500">/month</span></div>
                </div>
                <div className="space-y-3 pt-1"><p className="text-xs font-medium text-gray-400">{plan.price === 0 ? "Start building your career:" : `Everything you need with ${plan.name}:`}</p><ul className="space-y-2.5">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-xs text-gray-300"><HiCheckCircle className="mt-0.5 shrink-0 text-sm text-emerald-400" />{feature}</li>)}</ul></div>
              </div>
              <div className="mt-8 border-t border-white/5 pt-8"><Link href={plan.price === 0 ? "/auth/signup" : `/pricing?plan=${key.toLowerCase()}`} className={`inline-flex w-full items-center justify-between rounded-xl px-5 py-3 text-xs font-semibold shadow-lg transition ${key === "PRO" ? "bg-white text-black hover:bg-gray-200" : "border border-white/10 bg-[#111116] text-white hover:border-white/20 hover:bg-white/10"}`}><span>{plan.price === 0 ? "Get started free" : "View plan"}</span><HiArrowRight className="text-xs transition-transform group-hover:translate-x-1" /></Link></div>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] text-gray-500">Payments are processed securely by Stripe. You can cancel anytime.</p>
      </div>
    </section>
  );
}
