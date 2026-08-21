"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  HiSparkles,
  HiChartBar,
  HiBolt,
  HiPlus,
  HiArrowRight,
} from "react-icons/hi2";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: <HiSparkles className="text-purple-400 text-base" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited",
      ],
      highlighted: false,
    },
    {
      name: "Growth",
      icon: <HiChartBar className="text-indigo-400 text-base" />,
      monthlyPrice: 17,
      yearlyPrice: 13,
      description: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      icon: <HiBolt className="text-amber-400 text-base" />,
      monthlyPrice: 99,
      yearlyPrice: 74,
      description: "Start building your insights hub:",
      features: [
        "Everything in Pro",
        "Multi-profile career portfolios",
        "Shared talent rooms",
        "Recruiter view (read-only)",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="relative py-28 bg-[#030305] text-white overflow-hidden">
      {/* Background ambient glow matching Hero */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-105 w-212.5 rounded-full bg-indigo-500/4.5 blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131318]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(0,0,0,.25)] backdrop-blur-md">
              <span className="text-[10px]">💎</span>
              <span className="text-[9px] uppercase tracking-[0.17em] text-gray-400 font-medium">
                Pricing
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[32px] sm:text-4xl md:text-[44px] font-semibold tracking-[-0.045em] leading-[1.1]"
          >
            Pay for the leverage, not the listings
          </motion.h2>
        </div>

        {/* Monthly / Yearly Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex items-center p-1.5 rounded-full bg-[#0b0b0e] border border-white/10 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                !isYearly
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                isYearly
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${isYearly ? "bg-black text-white" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"}`}
              >
                25%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border ${
                  plan.highlighted
                    ? "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                    : "border-white/10"
                } bg-[#0b0b0e]/95 p-7 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,.5)] flex flex-col justify-between transition duration-300`}
              >
                {/* Top border shine */}
                <div className="absolute left-0 right-0 top-0 h-px bg-white/12" />

                {/* Card Top */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#111116] border border-white/10 flex items-center justify-center">
                        {plan.icon}
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight text-white">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-semibold tracking-tight text-white">
                        ${price}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        /{isYearly ? "month billed yearly" : "month"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-gray-500 font-medium">
                      {plan.description}
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs text-gray-300"
                        >
                          <span className="w-4 h-4 rounded-md bg-[#111116] border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                            <HiPlus className="text-[10px]" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer / Button */}
                <div className="pt-8 mt-8 border-t border-white/5">
                  <Link
                    href={`/auth/signup?plan=${encodeURIComponent(plan.name.toLowerCase())}`}
                    className={`w-full inline-flex items-center justify-between px-5 py-3 rounded-xl text-xs font-semibold transition shadow-lg cursor-pointer ${
                      plan.highlighted
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-[#111116] border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <span>Choose This Plan</span>
                    <HiArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
