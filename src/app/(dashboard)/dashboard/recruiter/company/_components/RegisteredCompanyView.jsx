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

const DEMO_BANNER =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";
const DEMO_LOGO =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop";

export function RegisteredCompanyView({ companyData }) {
  // Fallbacks for image URLs
  const bannerSrc = companyData?.bannerUrl || DEMO_BANNER;
  const logoSrc = companyData?.logoUrl || DEMO_LOGO;

  return (
    <div className="space-y-8 pb-12">
      {/* =======================================
          HERO BANNER & HEADER SECTION
      ======================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0f]">
        {/* Globe/Tech Banner Background */}
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src={bannerSrc}
            alt="Company Banner"
            fill
            priority
            className="object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
        </div>

        {/* Company Header Info Overlay */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white/10 bg-[#121218] overflow-hidden shadow-2xl shrink-0">
              <Image
                src={logoSrc}
                alt={companyData?.name || "Company Logo"}
                fill
                className="object-cover p-2 rounded-2xl"
              />
            </div>

            {/* Titles & Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {companyData?.name || "LuminaTech Systems"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <HiCheckBadge className="text-xs" /> Approved
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                {companyData?.tagline ||
                  "Engineering the future of enterprise cloud intelligence and distributed ledger solutions."}
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
            <h2 className="text-lg font-bold text-white">About LuminaTech</h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              {companyData?.about ||
                "Founded in 2014, LuminaTech Systems has emerged as a global leader in high-performance cloud infrastructure and decentralized computing systems. We bridge the gap between traditional enterprise legacy architectures and the next generation of intelligent, automated cloud ecosystems."}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Our mission is to empower organizations with resilient, scalable,
              and secure technologies that drive meaningful progress. With a
              focus on R&D, LuminaTech holds over 140 patents in data encryption
              and real-time processing.
            </p>
          </section>

          {/* Stats Grid */}
          <CompanyStatsGrid stats={companyData?.stats} />

          {/* Life at Company Gallery */}
          <LifeAtCompanyGallery photos={companyData?.gallery} />
        </div>

        {/* Right Column (1 Col): Active Roles & Hiring Team */}
        <div className="space-y-6">
          <ActiveRolesSidebar roles={companyData?.activeRoles} />
        </div>
      </div>
    </div>
  );
}
