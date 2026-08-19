"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

const DEMO_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

export function ActiveRolesSidebar({ roles }) {
  const activeRoles = roles || [
    {
      title: "Senior Distributed Systems Engineer",
      location: "SF / Remote",
      salary: "$180k - $240k",
    },
    {
      title: "Product Design Lead",
      location: "New York",
      salary: "$160k - $210k",
    },
    {
      title: "DevOps Architect (Infra)",
      location: "Remote",
      salary: "$190k+",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Active Roles Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white">Active Roles</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
            14
          </span>
        </div>

        <div className="space-y-3">
          {activeRoles.map((role, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-white leading-snug">
                  {role.title}
                </h4>
                <HiArrowUpRight className="text-gray-500 text-sm shrink-0" />
              </div>

              <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-400 font-medium">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {role.location}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {role.salary}
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="relative w-5 h-5 rounded-full border border-black overflow-hidden">
                    <Image
                      src={DEMO_AVATAR}
                      alt="Applicant"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold pl-2 self-center">
                    +12
                  </span>
                </div>

                <button className="px-3 py-1 rounded-lg bg-white text-black text-[10px] font-bold hover:bg-gray-200 transition">
                  Quick Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard/recruiter/jobs"
          className="block w-full text-center mt-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
        >
          See all 14 openings
        </Link>
      </div>

      {/* Hiring Team Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-6 backdrop-blur-xl space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Hiring Team
        </h3>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
            <Image
              src={DEMO_AVATAR}
              alt="Sarah Chen"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Sarah Chen</p>
            <p className="text-[10px] text-gray-500">
              Head of Talent Acquisition
            </p>
          </div>
        </div>

        <button className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10 transition">
          Message Team
        </button>
      </div>
    </div>
  );
}
