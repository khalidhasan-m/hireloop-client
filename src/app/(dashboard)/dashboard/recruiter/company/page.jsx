"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { UnregisteredCompanyView } from "./_components/UnregisteredCompanyView";
import { RegisteredCompanyView } from "./_components/RegisteredCompanyView";
import { RegisterCompanyModal } from "./_components/RegisterCompanyModal";
import toast from "react-hot-toast";

function mapCompanyToView(company) {
  if (!company) return null;
  const website = company.website || "";
  const websiteUrl = website
    ? website.startsWith("http")
      ? website
      : `https://${website}`
    : "#";

  return {
    _id: company._id,
    name: company.name,
    tagline: company.tagline || company.industry || "",
    about: company.description || company.about || "",
    websiteUrl,
    logoUrl: company.logo || company.logoUrl || "",
    bannerUrl: company.bannerUrl || "",
    industry: company.industry,
    location: company.location,
    employeeCount: company.employeeCount,
    status: company.status || "Pending",
  };
}

export default function RecruiterCompanyPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const getToken = async () => {
    const { data } = await authClient.getSession();
    return data?.session?.token || null;
  };

  const loadCompany = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.getMyCompany(token).catch((err) => {
        // 404 = no company yet
        if (err?.message?.toLowerCase?.().includes("not found")) {
          return null;
        }
        throw err;
      });

      if (res?.data) {
        setCompany(mapCompanyToView(res.data));
      } else {
        setCompany(null);
      }
    } catch (err) {
      console.error(err);
      // Treat missing company as unregistered
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const handleRegisterSubmit = async (formData) => {
    try {
      setSaving(true);
      const token = await getToken();
      if (!token) {
        toast.error("Please log in again.");
        return;
      }

      const website = formData.website
        ? formData.website.startsWith("http")
          ? formData.website
          : `https://${formData.website}`
        : null;

      const payload = {
        name: formData.name,
        industry: formData.industry || "Other",
        website,
        location: formData.location || null,
        employeeCount: formData.employeeRange || formData.employeeCount || null,
        description: formData.description || null,
        logo: null, // file upload can be added later
        status: "Pending",
      };

      const res = await api.createCompany(payload, token);
      toast.success("Company registered successfully!");
      setIsModalOpen(false);

      if (res?.data) {
        setCompany(mapCompanyToView(res.data));
      } else {
        await loadCompany();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to register company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm animate-pulse">
        Loading company profile...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            My Company
          </h1>
          {company?.status && (
            <p className="text-[11px] text-gray-500 mt-1">
              Status:{" "}
              <span
                className={
                  company.status === "Approved"
                    ? "text-emerald-400"
                    : company.status === "Rejected"
                      ? "text-red-400"
                      : "text-amber-400"
                }
              >
                {company.status}
              </span>
            </p>
          )}
        </div>
      </div>

      {company ? (
        <RegisteredCompanyView companyData={company} />
      ) : (
        <UnregisteredCompanyView onRegisterClick={() => setIsModalOpen(true)} />
      )}

      <RegisterCompanyModal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
}
