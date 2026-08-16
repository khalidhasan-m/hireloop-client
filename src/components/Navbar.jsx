"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    setIsOpen(false);
    router.push("/auth/login");
  };

  return (
    <div className="flex w-full justify-center bg-[#030305] px-4 pt-4">
      <nav className="relative flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#1c1c1e]/80 px-6 py-3 shadow-lg backdrop-blur-md">
        {/* =====================================================
            LOGO
        ====================================================== */}

        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-white">
              hire<span className="text-blue-500">l</span>
              <span className="text-orange-500">oop</span>
            </span>
          </Link>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/jobs" className="transition-colors hover:text-white">
              Browse Jobs
            </Link>

            <Link
              href="/companies"
              className="transition-colors hover:text-white"
            >
              Company
            </Link>

            <Link
              href="/pricing"
              className="transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/20" />

          {/* Auth */}
          <div className="flex items-center gap-4">
            {/* Sign In */}
            <button
              type="button"
              onClick={handleSignIn}
              className="cursor-pointer text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign In
            </button>

            {/* Get Started */}
            <Link href="/auth/signup">
              <Button
                type="button"
                className="
                  rounded-xl
                  bg-indigo-500
                  px-5
                  py-2
                  font-medium
                  text-white
                  shadow-md
                  transition-all
                  hover:bg-indigo-400
                  hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                "
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}

        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-lg p-1 text-gray-300 transition-colors hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg
              className="h-6 w-6"
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

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#1c1c1e] p-6 shadow-xl md:hidden">
            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="py-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Browse Jobs
            </Link>

            <Link
              href="/companies"
              onClick={() => setIsOpen(false)}
              className="py-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Company
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="py-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Pricing
            </Link>

            <div className="my-1 h-px w-full bg-white/10" />

            {/* Mobile Sign In */}
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full cursor-pointer py-1 text-left text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign In
            </button>

            {/* Mobile Get Started */}
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <Button
                type="button"
                className="
                  w-full
                  rounded-xl
                  bg-indigo-500
                  py-2
                  font-medium
                  text-white
                  shadow-md
                  transition-all
                  hover:bg-indigo-400
                "
              >
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
