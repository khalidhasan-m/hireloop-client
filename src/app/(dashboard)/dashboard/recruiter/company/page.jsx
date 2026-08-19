"use client";

import React, { useState } from "react";
import { UnregisteredCompanyView } from "./_components/UnregisteredCompanyView";
import { RegisteredCompanyView } from "./_components/RegisteredCompanyView";

export default function RecruiterCompanyPage() {
  // Toggle this to test both states (Registered vs Unregistered)
  const [isRegistered, setIsRegistered] = useState(true);

  // Mock data (replace with API/Database data later)
  const companyData = {
    name: "LuminaTech Systems",
    tagline:
      "Engineering the future of enterprise cloud intelligence and distributed ledger solutions.",
    about:
      "Founded in 2014, LuminaTech Systems has emerged as a global leader in high-performance cloud infrastructure and decentralized computing systems.",
    websiteUrl: "https://example.com",
    logoUrl: "", // Leaving empty automatically triggers demo fallbacks!
    bannerUrl: "",
  };

  return (
    <div>
      {/* Top Title Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          My Company
        </h1>

        {/* Demo Toggle Button (For Testing UI States) */}
        <button
          onClick={() => setIsRegistered(!isRegistered)}
          className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition"
        >
          Toggle Demo State ({isRegistered ? "Registered" : "Unregistered"})
        </button>
      </div>

      {/* Dynamic View Rendering */}
      {isRegistered ? (
        <RegisteredCompanyView companyData={companyData} />
      ) : (
        <UnregisteredCompanyView
          onRegisterClick={() => setIsRegistered(true)}
        />
      )}
    </div>
  );
}
