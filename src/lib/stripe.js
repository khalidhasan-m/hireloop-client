// Stripe.js client-side helper.
//
// The publishable key is safe to expose in the browser — put it in the
// client's .env as NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Get it from:
//   https://dashboard.stripe.com/test/apikeys  (Test mode → "Publishable key")
//
// Note: the primary checkout flow in HireLoop uses Stripe's hosted Checkout
// page, which only needs the SECRET key on the server (.env on the API side).
// Stripe.js is used here for client-side Stripe features (e.g. Payment Element).
import { loadStripe } from "@stripe/stripe-js";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export async function getStripe() {
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes("YOUR_")) {
    throw new Error(
      "Stripe publishable key missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env — copy it from https://dashboard.stripe.com/test/apikeys (Test mode → Publishable key).",
    );
  }
  return loadStripe(STRIPE_PUBLISHABLE_KEY);
}

export function stripeIsConfigured() {
  return Boolean(STRIPE_PUBLISHABLE_KEY) && !STRIPE_PUBLISHABLE_KEY.includes("YOUR_");
}
