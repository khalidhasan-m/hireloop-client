"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  HiLockClosed,
  HiArrowLeft,
  HiShieldCheck,
  HiCreditCard,
} from "react-icons/hi2";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SEEKER_PLANS, RECRUITER_PLANS } from "@/lib/constants";
import {
  confirmPayment,
  createPaymentIntent as apiCreatePaymentIntent,
} from "@/lib/api/payments";
import { getStripe } from "@/lib/stripe";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Inner form component utilizing standard Elements so the Stripe.js testing assistant panel appears
function EmbeddedPaymentForm({ clientSecret, planPrice, planName, planKey }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const { data } = await authClient.getSession();
        const token = data?.session?.token;
        await confirmPayment(paymentIntent.id, planKey, token);
        router.push(`/success?session_id=${paymentIntent.id}`);
      } catch (err) {
        setErrorMessage(
          err.message || "Payment succeeded, but confirmation failed.",
        );
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 text-[11px] text-red-300 leading-relaxed">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition shadow-[0_10px_25px_rgba(37,99,235,0.4)] cursor-pointer disabled:opacity-50"
      >
        {isProcessing
          ? "Processing..."
          : `Pay $${Number(planPrice).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Plan and role come from query params, e.g. /checkout?plan=PRO&role=seeker
  const planKey = (searchParams.get("plan") || "PRO").toUpperCase();
  const role = (searchParams.get("role") || "seeker").toLowerCase();
  const plans = role === "recruiter" ? RECRUITER_PLANS : SEEKER_PLANS;
  const plan = plans[planKey] || plans.PRO || SEEKER_PLANS.PRO;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  // Initialize Stripe Promise once on mount
  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  // One-click test shortcuts (client-only confirm flow). No card entry needed.
  const handleSimulateSuccess = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (!token) {
        toast.error("Please log in to complete checkout");
        router.push("/auth/login");
        return;
      }
      const simId = `test_sim_${Date.now()}`;
      await confirmPayment(simId, planKey, token);
      router.push(`/success?session_id=${simId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Simulation failed — is the API running?");
      setIsLoading(false);
    }
  };

  const handleSimulateFailure = () => {
    setError(
      "Payment failed (simulated). This is the error state your users see when Stripe declines a card.",
    );
  };

  // Fetch PaymentIntent/SetupIntent Client Secret for Elements
  const [embedError, setEmbedError] = useState("");
  const creatingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      if (creatingRef.current) return;
      creatingRef.current = true;
      try {
        const { data } = await authClient.getSession();
        const token = data?.session?.token;
        if (!token) {
          if (!cancelled) setEmbedError("not-logged-in");
          return;
        }

        // Fetching client secret from your Express backend via api/payments helper
        const secretRes = await apiCreatePaymentIntent(planKey, role, token);

        if (cancelled) return;
        if (!secretRes?.clientSecret) {
          throw new Error(secretRes?.message || "No client secret returned");
        }
        setClientSecret(secretRes.clientSecret);
      } catch (err) {
        console.error("Payment initialization failed:", err);
        if (!cancelled)
          setEmbedError(err.message || "Could not load the payment form.");
      } finally {
        creatingRef.current = false;
      }
    };
    start();
    return () => {
      cancelled = true;
    };
  }, [planKey, role]);

  return (
    <div className="relative min-h-screen bg-[#030305] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Navbar Header */}
      <div className="w-full border-b border-white/10 bg-[#0b0b0e]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link
          href="/pricing"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition cursor-pointer"
        >
          <HiArrowLeft className="text-sm" />
          <span>Back to Pricing</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <HiLockClosed className="text-emerald-400 text-sm" />
          <span className="font-medium">Secure Checkout</span>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider text-gray-400">
          SANDBOX
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 my-auto">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-[#0b0b0e]/80 p-6"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Order Summary
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {plan.name} Plan
              </h2>
              <p className="text-xs text-gray-400">
                Billed monthly · Stripe Test Mode
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Hireloop {plan.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {plan.features?.[0] || "Access to all features"}
                </p>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                ${plan.price}
                <span className="text-xs text-gray-500">/mo</span>
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-300">Total due today</span>
              <span className="text-base font-bold text-white">
                ${Number(plan.price).toFixed(2)}
              </span>
            </div>
          </motion.div>

          <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
            <HiShieldCheck className="text-emerald-400 text-sm" />
            Secured by Stripe · PCI-DSS compliant
          </p>
        </div>

        {/* Right Column: Pay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />

          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center">
              <HiCreditCard className="text-lg text-blue-400" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">
                Pay with card
              </h2>
              <p className="text-xs text-gray-400">
                Card form powered by Stripe Elements (Testing Assistant
                enabled).
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-[11px] text-amber-300/90 leading-relaxed">
              <span className="font-semibold">Test mode: </span>
              Look for the floating Stripe testing assistant panel at the bottom
              right corner of your browser window to inspect elements or
              auto-fill test cards.
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 font-mono text-[10px]">
                <span>4242 4242 4242 4242</span>
                <span className="text-emerald-400">Succeeds</span>
                <span>4000 0025 0000 3155</span>
                <span className="text-amber-400">Auth required (3DS)</span>
                <span>4000 0000 0000 9995</span>
                <span className="text-red-400">Declined</span>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5 text-[11px] text-indigo-300/90 space-y-2">
              <span className="font-semibold">One-click test buttons:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSimulateSuccess}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] hover:bg-emerald-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  ✓ Simulate success
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSimulateFailure}
                  className="px-3.5 py-2 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 font-semibold text-[11px] hover:bg-red-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  ✗ Simulate failure
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 text-[11px] text-red-300 leading-relaxed">
                {error}
              </div>
            )}

            {embedError ? (
              <div className="space-y-3">
                <p className="text-[11px] text-gray-400">
                  {embedError === "not-logged-in"
                    ? "Log in to load the payment form."
                    : `Card form failed to load (${embedError}).`}
                </p>
                {embedError === "not-logged-in" && (
                  <button
                    type="button"
                    onClick={() => router.push("/auth/login")}
                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition cursor-pointer"
                  >
                    Log in
                  </button>
                )}
              </div>
            ) : clientSecret && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedPaymentForm
                  clientSecret={clientSecret}
                  planPrice={plan.price}
                  planName={plan.name}
                  planKey={planKey}
                />
              </Elements>
            ) : (
              <div className="py-16 text-center text-xs text-gray-400">
                Loading secure payment form...
              </div>
            )}

            <p className="text-[11px] text-gray-500 text-center">
              By paying you agree to the{" "}
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 border-t border-white/5 gap-4">
        <span>Powered by Stripe</span>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-gray-400 transition">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-400 transition">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
