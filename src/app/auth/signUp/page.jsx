"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Label, Radio, RadioGroup } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  HiCheck,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
  HiUser,
  HiEnvelope,
  HiArrowLeft,
} from "react-icons/hi2";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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

  const passwordRules = useMemo(() => {
    return {
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      special: /[^A-Za-z0-9]/.test(formData.password),
    };
  }, [formData.password]);

  const passwordScore = Object.values(passwordRules).filter(Boolean).length;

  const passwordStrength = useMemo(() => {
    if (!formData.password) {
      return {
        label: "",
        width: "0%",
      };
    }

    if (passwordScore <= 2) {
      return {
        label: "Weak",
        width: "35%",
      };
    }

    if (passwordScore <= 4) {
      return {
        label: "Good",
        width: "70%",
      };
    }

    return {
      label: "Strong",
      width: "100%",
    };
  }, [passwordScore, formData.password]);

  const isPasswordValid = passwordScore === 5;

  const isPasswordMatched =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const canSubmit =
    formData.name.trim() &&
    formData.email.trim() &&
    isPasswordValid &&
    isPasswordMatched &&
    formData.role &&
    agreeTerms &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      const message = "Please enter your full name.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.email.trim()) {
      const message = "Please enter your email address.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!isPasswordValid) {
      const message = "Please create a stronger password.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!isPasswordMatched) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.role) {
      const message = "Please select your account type.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!agreeTerms) {
      const message = "Please agree to the Terms and Privacy Policy.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const { data, error: signUpError } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        callbackURL: "/",
      });

      if (signUpError) {
        const message = signUpError.message || "Unable to create your account.";

        setError(message);
        toast.error(message);
        return;
      }

      if (data) {
        toast.success("Account created successfully!");

        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Signup error:", err);

      const message =
        "Something went wrong while creating your account. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google signup error:", err);

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

        {/* Side glows */}
        <div className="absolute -left-62.5 top-1/3 h-87.5 w-87.5 rounded-full bg-indigo-500/2.5 blur-[120px]" />

        <div className="absolute -right-62.5 top-1/2 h-100 w-100 rounded-full bg-purple-500/2.5 blur-[120px]" />
      </div>

      {/* =====================================================
          BACK
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
        <div className="w-full max-w-115">
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
            {/* subtle top glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-400/40 to-transparent" />

            {/* =================================================
                HEADING
            ================================================== */}

            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
                Create your account
              </h1>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Start your journey to finding your dream job.
              </p>
            </div>

            {/* =================================================
                GOOGLE BUTTON
            ================================================== */}

            <Button
              type="button"
              onPress={handleGoogleSignUp}
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
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-gray-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <HiUser className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-600" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#101014] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-white/15 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

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

                  {formData.password && (
                    <span
                      className={`text-[10px] font-medium ${
                        passwordScore <= 2
                          ? "text-red-400"
                          : passwordScore <= 4
                            ? "text-yellow-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <HiLockClosed className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-600" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
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

                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          passwordScore <= 2
                            ? "bg-red-500"
                            : passwordScore <= 4
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                        }`}
                        style={{
                          width: passwordStrength.width,
                        }}
                      />
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                      <PasswordRule
                        passed={passwordRules.length}
                        text="8+ characters"
                      />

                      <PasswordRule
                        passed={passwordRules.uppercase}
                        text="Uppercase letter"
                      />

                      <PasswordRule
                        passed={passwordRules.lowercase}
                        text="Lowercase letter"
                      />

                      <PasswordRule
                        passed={passwordRules.number}
                        text="Number"
                      />

                      <PasswordRule
                        passed={passwordRules.special}
                        text="Special character"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-medium text-gray-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <HiLockClosed className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-600" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={`h-11 w-full rounded-xl border bg-[#101014] pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60 ${
                      formData.confirmPassword && !isPasswordMatched
                        ? "border-red-500/30 focus:border-red-500/40"
                        : formData.confirmPassword && isPasswordMatched
                          ? "border-emerald-500/30 focus:border-emerald-500/40"
                          : "border-white/10 hover:border-white/15 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <HiEyeSlash className="text-base" />
                    ) : (
                      <HiEye className="text-base" />
                    )}
                  </button>
                </div>

                {formData.confirmPassword && !isPasswordMatched && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    Passwords do not match.
                  </p>
                )}

                {formData.confirmPassword && isPasswordMatched && (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-400">
                    <HiCheck />
                    Passwords match.
                  </p>
                )}
              </div>

              {/* =================================================
                  ACCOUNT TYPE
              ================================================== */}

              <div className="flex flex-col gap-3">
                <Label className="text-xs font-medium text-gray-300">
                  Account type
                </Label>

                <RadioGroup
                  value={formData.role}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                    }))
                  }
                  name="role"
                  orientation="horizontal"
                  isDisabled={loading}
                >
                  <Radio value="seeker">
                    <Radio.Content>
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      Job Seeker
                    </Radio.Content>
                  </Radio>

                  <Radio value="recruiter">
                    <Radio.Content>
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      Recruiter
                    </Radio.Content>
                  </Radio>
                </RadioGroup>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-500"
                />

                <span className="text-[10px] leading-5 text-gray-500">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/6 px-3 py-2.5">
                  <p className="text-[11px] leading-5 text-red-400">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                isDisabled={!canSubmit}
                className="h-11 w-full rounded-xl bg-indigo-500 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* =================================================
                LOGIN
            ================================================== */}

            <p className="mt-6 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Sign in
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

/* =========================================================
   PASSWORD RULE
========================================================= */

function PasswordRule({ passed, text }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[9px] ${
        passed ? "text-emerald-400" : "text-gray-600"
      }`}
    >
      <span
        className={`flex h-3 w-3 items-center justify-center rounded-full border ${
          passed ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/10"
        }`}
      >
        {passed && <HiCheck className="text-[8px]" />}
      </span>

      {text}
    </div>
  );
}
