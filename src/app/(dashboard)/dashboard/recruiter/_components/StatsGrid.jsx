import React from "react";

export function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 backdrop-blur-xl relative overflow-hidden transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">{stat.title}</span>
              <div className={`p-2.5 rounded-xl border ${stat.iconBg}`}>
                <Icon className="text-lg" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black tracking-tight text-white">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}