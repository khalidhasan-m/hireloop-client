"use client";

import React from "react";
import { HiBuildingStorefront, HiQuestionMarkCircle } from "react-icons/hi2";

export function UnregisteredCompanyView({ onRegisterClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 border border-dashed border-white/10 rounded-3xl bg-[#0b0b0f]/50 backdrop-blur-xl my-4">
      {/* Graphic Icon Area */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-linear-to-b from-white/10 to-white/2 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-12 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-between p-1.5 opacity-50">
            <div className="w-1/2 h-1.5 bg-gray-600 rounded" />
            <div className="w-full h-1 bg-gray-700 rounded" />
            <div className="w-3/4 h-1 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Floating Store/Company Badge */}
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg border border-white/20">
          <HiBuildingStorefront className="text-xl" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
        Company not registered yet
      </h2>
      <p className="max-w-md text-xs sm:text-sm text-gray-400 mb-8 leading-relaxed">
        Set up your business profile to start posting high-performance job
        listings and manage your talent loop.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onRegisterClick}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg cursor-pointer"
        >
          Register your company
        </button>
        <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 text-gray-300 text-xs font-medium border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2 cursor-pointer">
          <HiQuestionMarkCircle className="text-base" />
          View FAQ
        </button>
      </div>

      <p className="text-[11px] text-gray-500 mt-12">
        Need specialized assistance?{" "}
        <a href="#" className="underline hover:text-gray-400 transition">
          Contact our enterprise support team.
        </a>
      </p>
    </div>
  );
}
