import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

export function TopCompaniesCard({ companies }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-white">My Top Companies</h2>
          <Link
            href="/dashboard/recruiter/company"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
          >
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  {company.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{company.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{company.category}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-[10px] font-bold text-indigo-400 tracking-wider">
                  {company.jobs}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <Link
          href="/dashboard/recruiter/company"
          className="w-full h-10 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white flex items-center justify-center gap-2 hover:bg-white/10 transition"
        >
          View All Companies
          <HiArrowRight className="text-sm" />
        </Link>
      </div>
    </div>
  );
}