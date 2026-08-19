"use client";

import React from "react";
import { HiUsers, HiMapPin, HiGlobeEuropeAfrica } from "react-icons/hi2";

export function CompanyStatsGrid({ stats }) {
  const defaultStats = [
    { label: "Employees", value: "12,400+", icon: HiUsers, sub: "GLOBAL TEAM" },
    {
      label: "Headquarters",
      value: "San Francisco",
      icon: HiMapPin,
      sub: "CALIFORNIA, USA",
    },
    {
      label: "Presence",
      value: "24 Countries",
      icon: HiGlobeEuropeAfrica,
      sub: "WORLDWIDE",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-white">Company Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {defaultStats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl flex flex-col justify-between"
            >
              <Icon className="text-lg text-gray-400 mb-3" />
              <div>
                <p className="text-lg font-black text-white">{item.value}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
