"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center px-4 pt-4 bg-[#121212]">
      <nav className="w-full max-w-6xl bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg relative">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-white">
              hire<span className="text-blue-500">l</span>
              <span className="text-orange-500">oop</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links & CTA */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/jobs" className="hover:text-white transition-colors">
              Browse Jobs
            </Link>
            <Link
              href="/companies"
              className="hover:text-white transition-colors"
            >
              Company
            </Link>
            <Link
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Button
              as={Link}
              href="/signup"
              className="bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none p-1"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 md:hidden z-50">
            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-1"
            >
              Browse Jobs
            </Link>
            <Link
              href="/companies"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-1"
            >
              Company
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-1"
            >
              Pricing
            </Link>

            <div className="h-px w-full bg-white/10 my-1" />

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors py-1"
              >
                Sign In
              </Link>
              <Button
                as={Link}
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 rounded-xl shadow-md text-center"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
