"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  HiLockClosed,
  HiArrowLeft,
  HiShieldCheck,
  HiCreditCard,
} from "react-icons/hi2";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState("BDT");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate payment processing delay, then redirect to success page
    setTimeout(() => {
      router.push("/success?session_id=cs_test_a1b4e3j70J810x80");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#030305] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar Header */}
      <div className="w-full border-b border-white/10 bg-[#0b0b0e]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link
          href="/pricing"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition cursor-pointer"
        >
          <HiArrowLeft className="text-sm" />
          <span>Back to Pricing</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <HiLockClosed className="text-emerald-400 text-sm" />
          <span className="font-medium">Secure Checkout</span>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider text-gray-400">
          SANDBOX
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 my-auto">
        {/* Left Column: Plan & Currency Picker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Choose a Currency:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* BDT Option */}
              <button
                type="button"
                onClick={() => setCurrency("BDT")}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                  currency === "BDT"
                    ? "border-white bg-[#111116] shadow-lg shadow-white/5"
                    : "border-white/10 bg-[#0b0b0e] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">🇧🇩</span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${currency === "BDT" ? "border-indigo-500 bg-indigo-500" : "border-white/20"}`}
                  >
                    {currency === "BDT" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  BDT 2,553.33
                </span>
              </button>

              {/* USD Option */}
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                  currency === "USD"
                    ? "border-white bg-[#111116] shadow-lg shadow-white/5"
                    : "border-white/10 bg-[#0b0b0e] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">🇺🇸</span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${currency === "USD" ? "border-indigo-500 bg-indigo-500" : "border-white/20"}`}
                  >
                    {currency === "USD" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  $20.00
                </span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-mono">
              1 USD = 127.6665 BDT
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Hireloop Pro Plan
              </h2>
              <p className="text-xs text-gray-400">Access to all features</p>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              {currency === "BDT" ? "BDT 2,553.33" : "$20.00"}
            </span>
          </div>
        </div>

        {/* Right Column: Stripe Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />

          {/* Express Checkout Button (Stripe Link) */}
          <div className="space-y-4">
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-[#00D97E] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#00c270] transition shadow-md cursor-pointer"
            >
              <span className="italic font-bold tracking-tighter">link</span>
              <span className="text-gray-900 font-normal">|</span>
              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                VISA
              </span>
              <span className="font-mono text-xs">4242</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-white/10"></div>
              <span className="shrink mx-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                Or
              </span>
              <div className="grow border-t border-white/10"></div>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-5 pt-2">
            {/* Contact Info */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">
                Contact information
              </label>
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400">Email</span>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-gray-300">
                Payment method
              </label>

              <div className="border border-white/10 rounded-xl bg-[#111116] p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-300 pb-2 border-b border-white/5">
                  <HiCreditCard className="text-indigo-400 text-base" />
                  <span>Card</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-gray-500">
                      Card Information
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        maxLength={19}
                        required
                        className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                      />
                      <div className="absolute right-3 flex items-center gap-1 opacity-70">
                        <div className="w-4 h-3 rounded bg-blue-600"></div>
                        <div className="w-4 h-3 rounded bg-amber-500"></div>
                        <div className="w-4 h-3 rounded bg-red-500"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={7}
                      required
                      className="bg-[#0b0b0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      maxLength={4}
                      required
                      className="bg-[#0b0b0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-semibold text-gray-500">
                      Cardholder Name
                    </span>
                    <input
                      type="text"
                      placeholder="Full name on card"
                      required
                      className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-semibold text-gray-500">
                      Country or Region
                    </span>
                    <select className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer">
                      <option>Bangladesh</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save info checkbox */}
              <label className="flex items-start gap-3 pt-2 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-[#111116] text-indigo-600 focus:ring-0 accent-indigo-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs text-gray-200 font-medium group-hover:text-white transition">
                    Save my information for faster checkout
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Pay securely on this site and everywhere Link is accepted.
                  </p>
                </div>
              </label>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition shadow-[0_10px_25px_rgba(37,99,235,0.4)] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Processing payment..." : "Pay"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 border-t border-white/5 gap-4">
        <span>Powered by Stripe</span>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-gray-400 transition">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-400 transition">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
