"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { getMyPayments, createPaymentIntent, changePlan, cancelSubscription, confirmPayment } from "@/lib/api/payments";
import { getStripe } from "@/lib/stripe";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const plans = [
  { key: "FREE", name: "Free", price: 0, limit: 3 },
  { key: "GROWTH", name: "Growth", price: 49, limit: 10 },
  { key: "ENTERPRISE", name: "Enterprise", price: 149, limit: 50 },
];

function EmbeddedCheckoutModal({ clientSecret, planKey, onClose }) {
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
        window.location.reload();
      } catch (err) {
        window.location.reload();
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Complete Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || !elements || isProcessing}
              className="flex-1 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-semibold hover:bg-cyan-300 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecruiterBilling() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [busyPlan, setBusyPlan] = useState("");
  const [canceling, setCanceling] = useState(false);
  
  // States for embedded Elements modal
  const [clientSecret, setClientSecret] = useState(null);
  const [activePlanKey, setActivePlanKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(getStripe());
    authClient.getSession().then(async ({ data }) => {
      const token = data?.session?.token;
      setUser(data?.user);
      try {
        const [j, p] = await Promise.all([api.getMyJobs(token), getMyPayments(token)]);
        setJobs(j.data || []);
        setPayments(p.data || []);
      } catch (error) { toast.error(error.message || "Unable to load billing data"); }
    });
  }, []);

  const current = String(user?.plan || "FREE").toUpperCase();
  
  const selectPlan = async (plan) => {
    setBusyPlan(plan);
    try {
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      if (current !== "FREE" && plan !== "FREE") {
        await changePlan(plan, token);
        toast.success(`Plan changed to ${plan}`);
        window.location.reload();
      } else {
        // Call the updated createPaymentIntent helper
        const result = await createPaymentIntent(plan, "recruiter", token);
        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
          setActivePlanKey(plan);
        } else {
          throw new Error("No client secret returned");
        }
      }
    } catch (error) { toast.error(error.message || "Unable to update plan"); } finally { setBusyPlan(""); }
  };

  const cancel = async () => {
    if (!window.confirm("Cancel this subscription at the end of the current billing period?")) return;
    setCanceling(true);
    try { const { data } = await authClient.getSession(); await cancelSubscription(data?.session?.token); toast.success("Subscription scheduled to cancel at period end"); } catch (error) { toast.error(error.message || "Unable to cancel subscription"); } finally { setCanceling(false); }
  };

  return (
    <main className="max-w-5xl space-y-8 text-white p-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription &amp; billing</h1>
        <p className="mt-1 text-sm text-gray-400">Current plan: <span className="text-cyan-300">{current}</span> · Active jobs: {jobs.filter((job) => job.status === "active").length}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.key} className={`rounded-2xl border p-6 bg-[#0b0b0e] ${current === plan.key ? "border-cyan-400" : "border-white/10"}`}>
            <h2 className="font-semibold">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold">${plan.price}<span className="text-sm text-gray-400">/month</span></p>
            <p className="mt-3 text-sm text-gray-400">Up to {plan.limit} active job posts</p>
            {plan.key !== current && (
              <button 
                type="button" 
                disabled={busyPlan === plan.key} 
                onClick={() => selectPlan(plan.key)} 
                className="mt-5 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50 cursor-pointer"
              >
                {busyPlan === plan.key ? "Updating…" : current === "FREE" ? "Choose plan" : "Change plan"}
              </button>
            )}
          </div>
        ))}
      </div>

      {current !== "FREE" && (
        <button type="button" disabled={canceling} onClick={cancel} className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-300 disabled:opacity-50">
          {canceling ? "Canceling…" : "Cancel at period end"}
        </button>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Payment history</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="p-4">Date</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Transaction</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-white/5">
                  <td className="p-4">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-4">{payment.plan}</td>
                  <td className="p-4">${Number(payment.amount || 0).toFixed(2)}</td>
                  <td className="p-4 text-xs text-gray-400">{payment.stripeSessionId || payment.stripePaymentIntentId || payment.transactionId || "—"}</td>
                  <td className="p-4">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Embedded Stripe Elements Modal */}
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckoutModal
            clientSecret={clientSecret}
            planKey={activePlanKey}
            onClose={() => {
              setClientSecret(null);
              setActivePlanKey(null);
            }}
          />
        </Elements>
      )}
    </main>
  );
}