import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08080c]/80 backdrop-blur-xl">
      {/* Loading Card Container */}
      <div className="flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-[#0b0b0f]/90 shadow-2xl backdrop-blur-2xl space-y-6 animate-fadeIn">
        {/* Animated Spinner Component */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          {/* Inner Pulse Core */}
          <div className="absolute w-6 h-6 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 animate-pulse shadow-lg shadow-indigo-500/50" />
        </div>

        {/* Branding & Status Text */}
        <div className="text-center space-y-1">
          <h2 className="text-sm font-black tracking-tight flex items-center justify-center">
            <span className="text-white">hire</span>
            <span className="text-blue-500">l</span>
            <span className="text-orange-500">oop</span>
          </h2>
          <p className="text-[11px] text-gray-400 tracking-wider uppercase font-medium animate-pulse">
            Loading workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
