// PricingSection is the single source of truth for pricing on BOTH the
// home page and the /pricing route. It renders the same Tabs + PlanCard +
// embedded Stripe Elements checkout everywhere so the two never diverge.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiCheckCircle } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { createPaymentIntent, confirmPayment } from "@/lib/api/payments";
import { getStripe } from "@/lib/stripe";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { SEEKER_PLANS, RECRUITER_PLANS } from "@/lib/constants";
import toast from "react-hot-toast";

function EmbeddedCheckoutModal({ plan, planKey, role, onClose }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
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
        toast.success("Payment successful!");
        router.push(`/success?session_id=${paymentIntent.id}`);
      } catch (err) {
        router.push(`/success?session_id=${paymentIntent.id}`);
      }
    } else {
      setIsProcessing(false);
    }
  };

  // Lock background scroll + close on Escape while the modal is open.
  // Keeps a single scrollbar (inside the form column) instead of body + backdrop + card all scrolling.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    // z-[200] sits above the navbar (z-100) so the nav hides behind the backdrop.
    <div
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start lg:items-center justify-center p-4">
        <div
          className="bg-[#0b0b0e] border border-white/10 rounded-2xl w-full max-w-md lg:max-w-4xl relative shadow-2xl my-4 lg:my-8 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment dialog"
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
          {/* Single column on mobile, two columns on desktop — same content, just fits large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] flex-1 min-h-0">
            {/* Order summary — stacks on top for mobile, left column on desktop */}
            <div className="bg-white/[0.03] border-b lg:border-b-0 lg:border-r border-white/10 p-6 shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
              Order summary
            </p>
            <h3 className="mt-2 text-lg font-bold text-white">
              {plan?.name || planKey} Plan
            </h3>
            <p className="text-xs text-gray-500 capitalize">{role} billing</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                ${plan?.price ?? "--"}
              </span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            {!!plan?.features?.length && (
              <ul className="mt-5 space-y-2">
                {plan.features.slice(0, 5).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[11px] text-gray-300"
                  >
                    <HiCheckCircle className="text-emerald-400 text-sm shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 text-[10px] leading-relaxed text-gray-500">
              Payments are processed securely by Stripe. You can cancel anytime.
            </p>
          </div>
          {/* Payment form — full width on mobile, right column on desktop.
              Only this column scrolls, so there is just ONE scrollbar. */}
          <div className="p-6 lg:p-8 lg:overflow-y-auto lg:min-h-0">
            <h3 className="text-lg font-bold text-white mb-4 pr-8">
              Complete Payment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              <PaymentElement />
              {errorMessage && (
                <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {errorMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!stripe || !elements || isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-semibold hover:bg-cyan-300 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ planKey, plan, role, currentPlan, onUpgrade, loading }) {
  const isCurrent =
    (currentPlan || "FREE").toUpperCase() === planKey.toUpperCase();
  const isFree = plan.price === 0;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        planKey === "PREMIUM" || planKey === "ENTERPRISE"
          ? "border-indigo-500/40 bg-indigo-500/5"
          : "border-white/10 bg-[#0b0b0f]/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
          {isCurrent && (
            <span className="text-[10px] text-emerald-400 font-medium">
              Current plan
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">${plan.price}</span>
          <span className="text-xs text-gray-500">/mo</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2 flex-1">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
            <HiCheckCircle className="text-emerald-400 text-sm shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isFree ? (
          <a
            href="/auth/signup"
            className="block w-full text-center px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
          >
            Get started free
          </a>
        ) : isCurrent ? (
          <button
            type="button"
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-gray-500 cursor-not-allowed"
          >
            Active
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => onUpgrade(planKey, role)}
            className="w-full px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Loading..." : "Upgrade"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PricingSection() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = (user?.role || "seeker").toLowerCase();
  const currentPlan = user?.plan || "FREE";

  const [tab, setTab] = useState(role === "recruiter" ? "recruiter" : "seeker");
  const [loadingKey, setLoadingKey] = useState(null);

  const [clientSecret, setClientSecret] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  const plans =
    tab === "recruiter"
      ? Object.entries(RECRUITER_PLANS)
      : Object.entries(SEEKER_PLANS);

  const activeRole = activePlan?.role || tab;
  // Same plan object the cards render — reuse it for the order summary so nothing diverges.
  const activePlanDetails =
    activePlan?.details ||
    (activeRole === "recruiter" ? RECRUITER_PLANS : SEEKER_PLANS)[
      activePlan?.key || ""
    ];

  const handleUpgrade = async (planKey, planRole) => {
    if (!user) {
      toast.error("Please log in to upgrade");
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingKey(planKey);
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const resolvedRole = (planRole || tab).toLowerCase();
      const planDetails =
        (resolvedRole === "recruiter" ? RECRUITER_PLANS : SEEKER_PLANS)[
          planKey
        ];
      const result = await createPaymentIntent(
        planKey,
        resolvedRole,
        token,
      );
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setActivePlan({ key: planKey, role: resolvedRole, details: planDetails });
      } else {
        throw new Error("No client secret returned from server");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not initialize payment intent");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="w-full bg-[#030305] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
            Choose a plan that matches how you hire or how you job hunt. Upgrade
            anytime.
          </p>

          <div className="inline-flex mt-8 rounded-xl border border-white/10 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setTab("seeker")}
              className={`px-5 py-2.5 font-medium transition cursor-pointer ${
                tab === "seeker"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Job Seekers
            </button>
            <button
              type="button"
              onClick={() => setTab("recruiter")}
              className={`px-5 py-2.5 font-medium transition cursor-pointer ${
                tab === "recruiter"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Recruiters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(([key, plan]) => (
            <PlanCard
              key={key}
              planKey={key}
              plan={plan}
              role={tab}
              currentPlan={tab === role ? currentPlan : null}
              onUpgrade={handleUpgrade}
              loading={loadingKey === key}
            />
          ))}
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-10">
          Payments are processed securely by Stripe. You can cancel anytime.
        </p>
      </div>

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckoutModal
            plan={activePlanDetails}
            planKey={activePlan?.key}
            role={activeRole}
            onClose={() => {
              setClientSecret(null);
              setActivePlan(null);
            }}
          />
        </Elements>
      )}
    </div>
  );
}
