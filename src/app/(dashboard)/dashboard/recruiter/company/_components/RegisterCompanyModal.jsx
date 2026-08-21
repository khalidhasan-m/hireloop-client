"use client";

import React, { useState } from "react";
import { HiXMark, HiArrowUpTray } from "react-icons/hi2";

export function RegisterCompanyModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "Technology",
    website: "",
    location: "",
    employeeRange: "1-10 employees",
    description: "",
    logo: null,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Parent closes modal on success
    } catch {
      // Parent shows toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0b0b0f] border border-white/10 rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl my-8">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1.5 rounded-full bg-white/5 border border-white/10 cursor-pointer"
        >
          <HiXMark className="text-lg" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Register New Company
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Enter your business details to start hiring on HireLoop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Acme Corp"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Industry / Category
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-[#121218] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="Technology">Technology</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Automotive">Automotive</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Website URL
              </label>
              <div className="flex rounded-xl bg-white/3 border border-white/10 overflow-hidden focus-within:border-indigo-500 transition">
                <span className="flex items-center px-3 bg-white/5 text-gray-500 text-[11px] border-r border-white/10">
                  https://
                </span>
                <input
                  type="text"
                  name="website"
                  placeholder="www.company.com"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full h-11 px-3 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Employee Count Range
              </label>
              <select
                name="employeeRange"
                value={formData.employeeRange}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-[#121218] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Company Logo
              </label>
              <label className="flex items-center gap-3 px-3 h-11 rounded-xl bg-white/3 border border-dashed border-white/20 hover:border-white/40 cursor-pointer transition">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <HiArrowUpTray className="text-xs" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-medium text-white truncate">
                    {formData.logo?.name || "Upload image"}
                  </p>
                  <p className="text-[9px] text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData((prev) => ({
                        ...prev,
                        logo: e.target.files[0],
                      }));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Brief Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Tell us about your company's mission and culture..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Registering..." : "Register Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
