"use client";

import React, { useState } from "react";
import { UnregisteredCompanyView } from "./_components/UnregisteredCompanyView";
import { RegisteredCompanyView } from "./_components/RegisteredCompanyView";
import { RegisterCompanyModal } from "./_components/RegisterCompanyModal"; // Import your modal

export default function RecruiterCompanyPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Mock data (replace with API/Database data later)
  const companyData = {
    name: "LuminaTech Systems",
    tagline:
      "Engineering the future of enterprise cloud intelligence and distributed ledger solutions.",
    about:
      "Founded in 2014, LuminaTech Systems has emerged as a global leader in high-performance cloud infrastructure and decentralized computing systems.",
    websiteUrl: "https://example.com",
    logoUrl: "", 
    bannerUrl: "",
  };

  const handleRegisterSubmit = (formData) => {
    console.log("Submitted Company Data:", formData);
    // TODO: Send data to your database / API here
    setIsRegistered(true); // Switch view to registered state after successful submission
    setIsModalOpen(false); // Close the modal
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
          className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition cursor-pointer"
        >
          Toggle Demo State ({isRegistered ? "Registered" : "Unregistered"})
        </button>
      </div>

      {/* Dynamic View Rendering */}
      {isRegistered ? (
        <RegisteredCompanyView companyData={companyData} />
      ) : (
        <UnregisteredCompanyView
          onRegisterClick={() => setIsModalOpen(true)} // Opens the modal when clicked!
        />
      )}

      {/* Registration Modal Component */}
      <RegisterCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
}