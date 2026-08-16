"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiEnvelope,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
} from "react-icons/hi2";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      const message = "Please enter your email address.";

      setError(message);
      toast.error(message);

      return;
    }

    if (!password) {
      const message = "Please enter your password.";

      setError(message);
      toast.error(message);

      return;
    }

    try {
      setLoading(true);

      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/",
      });

      if (signInError) {
        const message =
          signInError.message || "Invalid email or password. Please try again.";

        setError(message);
        toast.error(message);

        return;
      }

      if (data) {
        toast.success("Welcome back to HireLoop!");

        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);

      const message =
        "Something went wrong while signing you in. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google login error:", err);

      const message = "Unable to continue with Google. Please try again.";

      setError(message);
      toast.error(message);

      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030305] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Top glow */}
        <div className="absolute left-1/2 -top-45 h-120 w-175 -translate-x-1/2 rounded-full bg-indigo-600/8 blur-[140px]" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-125 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/[0.035] blur-[140px]" />

        {/* Side glow */}
        <div className="absolute -left-62.5 top-1/3 h-87.5 w-87.5 rounded-full bg-indigo-500/2.5 blur-[120px]" />

        <div className="absolute -right-62.5 top-1/2 h-100 w-100 rounded-full bg-purple-500/2.5 blur-[120px]" />
      </div>

      {/* =====================================================
          BACK TO HOME
      ====================================================== */}

      <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-white"
        >
          <HiArrowLeft className="text-sm" />
          Back to home
        </Link>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="w-full max-w-107.5">
          {/* =================================================
              LOGO
          ================================================== */}

          <div className="mb-7 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-2xl font-black tracking-tight"
            >
              <span className="text-white">hire</span>
              <span className="text-blue-500">l</span>
              <span className="text-orange-500">oop</span>
            </Link>
          </div>

          {/* =================================================
              CARD
          ================================================== */}

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]/90 p-5 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-7">
            {/* Top highlight */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-400/40 to-transparent" />

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
                Welcome back
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Sign in to continue to your HireLoop account.
              </p>
            </div>

            {/* =================================================
                GOOGLE
            ================================================== */}

            <Button
              type="button"
              onPress={handleGoogleLogin}
              isDisabled={googleLoading || loading}
              className="mt-6 h-11 w-full rounded-xl border border-white/10 bg-white text-sm font-medium text-black transition hover:bg-gray-100"
            >
              <span className="flex items-center justify-center gap-3">
                {googleLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center font-semibold text-[#4285F4]">
                    G
                  </span>
                )}

                {googleLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </Button>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                or continue with email
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-gray-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <HiEnvelope className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-600" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#101014] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-white/15 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-[10px] font-medium text-indigo-400 transition hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <HiLockClosed className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-600" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#101014] pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-white/15 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <HiEyeSlash className="text-base" />
                    ) : (
                      <HiEye className="text-base" />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  REMEMBER ME
              ================================================== */}

              <label className="flex cursor-pointer items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 cursor-pointer accent-indigo-500"
                />

                <span className="text-[10px] text-gray-500">Remember me</span>
              </label>

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/6 px-3 py-2.5">
                  <p className="text-[11px] leading-5 text-red-400">{error}</p>
                </div>
              )}

              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <Button
                type="submit"
                isDisabled={
                  loading ||
                  googleLoading ||
                  !formData.email.trim() ||
                  !formData.password
                }
                className="h-11 w-full rounded-xl bg-indigo-500 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* =================================================
                SIGNUP
            ================================================== */}

            <p className="mt-6 text-center text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Bottom text */}
          <p className="mt-5 text-center text-[10px] text-gray-700">
            Secure authentication powered by HireLoop
          </p>
        </div>
      </div>
    </main>
  );
}
