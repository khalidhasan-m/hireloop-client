// Stripe.js client-side helper.
//
// No NEXT_PUBLIC_ var: the publishable key lives in server-only
// STRIPE_PUBLISHABLE_KEY and is served at runtime via /api/config.
// (It still reaches the browser at runtime — Stripe.js requires it —
// but it is no longer baked into the JS bundle or stored as a public env var.)
// Get it from: https://dashboard.stripe.com/test/apikeys (Test mode → "Publishable key")
//
// Note: the primary checkout flow in HireLoop uses Stripe's hosted Checkout
// page, which only needs the SECRET key on the server (.env on the API side).
import { loadStripe } from "@stripe/stripe-js";

let cachedKey = null;
let stripePromiseCache = null;

export async function getPublishableKey() {
  if (cachedKey) return cachedKey;
  const res = await fetch("/api/config", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  cachedKey = json?.stripePublishableKey || "";
  return cachedKey;
}

export async function getStripe() {
  if (!stripePromiseCache) {
    stripePromiseCache = (async () => {
      const key = await getPublishableKey();
      if (!key || key.includes("YOUR_")) {
        throw new Error(
          "Stripe publishable key missing. Add STRIPE_PUBLISHABLE_KEY to .env — copy it from https://dashboard.stripe.com/test/apikeys (Test mode → Publishable key).",
        );
      }
      return loadStripe(key);
    })().catch((err) => {
      stripePromiseCache = null;
      throw err;
    });
  }
  return stripePromiseCache;
}

export async function stripeIsConfigured() {
  const key = await getPublishableKey().catch(() => "");
  return Boolean(key) && !key.includes("YOUR_");
}
