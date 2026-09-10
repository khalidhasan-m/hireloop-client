import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Runtime public config. The browser fetches this instead of reading
// NEXT_PUBLIC_* vars (there are none left in this project).
// Served at request time, never baked into the JS bundle at build time.
export async function GET() {
  return NextResponse.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  });
}
