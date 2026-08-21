"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiGlobeAlt,
  HiCheckBadge,
  HiArrowTopRightOnSquare,
  HiPlus,
} from "react-icons/hi2";
import { CompanyStatsGrid } from "./CompanyStatsGrid";
import { ActiveRolesSidebar } from "./ActiveRolesSidebar";
import { LifeAtCompanyGallery } from "./LifeAtCompanyGallery";

export function RegisteredCompanyView({ companyData }) {
  const bannerSrc = companyData?.bannerUrl || null;
  const logoSrc = companyData?.logoUrl || null;

  return (
    <div className="space-y-8 pb-12">
      {/* =======================================
          HERO BANNER & HEADER SECTION
      ======================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0f]">
        {/* Globe/Tech Banner Background */}
        <div className="relative h-48 sm:h-64 w-full">
          {bannerSrc ? <Image src={bannerSrc} alt="Company Banner" fill priority className="object-cover opacity-60 mix-blend-screen" /> : <div className="absolute inset-0 bg-linear-to-br from-white/10 via-indigo-950/30 to-transparent" aria-label="No company banner uploaded" />}
          <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
        </div>

        {/* Company Header Info Overlay */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white/10 bg-[#121218] overflow-hidden shadow-2xl shrink-0">
                {logoSrc ? <Image src={logoSrc} alt={companyData?.name || "Company Logo"} fill className="object-cover p-2 rounded-2xl" /> : <span className="text-3xl font-black text-gray-400">{companyData?.name?.[0]?.toUpperCase() || "?"}</span>}
            </div>

            {/* Titles & Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {companyData?.name || "Company"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <HiCheckBadge className="text-xs" /> Approved
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                {companyData?.tagline || companyData?.industry || "No company tagline provided."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition flex items-center justify-center gap-2">
              <HiPlus className="text-sm" />
              Follow
            </button>
            <a
              href={companyData?.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <HiGlobeAlt className="text-base" />
              Visit Website
            </a>
          </div>
        </div>
      </div>

      {/* =======================================
          MAIN CONTENT & SIDEBAR GRID
      ======================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): About, Stats, Life */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">About {companyData?.name || "Company"}</h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              {companyData?.about || "No company description provided."}
            </p>
          </section>

          {/* Stats Grid */}
          <CompanyStatsGrid stats={companyData?.stats} />

          {/* Life at Company Gallery */}
          <LifeAtCompanyGallery photos={companyData?.gallery} companyName={companyData?.name} />
        </div>

        {/* Right Column (1 Col): Active Roles & Hiring Team */}
        <div className="space-y-6">
          <ActiveRolesSidebar roles={companyData?.activeRoles} />
        </div>
      </div>
    </div>
  );
}
