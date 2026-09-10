import { NextResponse } from "next/server";

// Server-only backend origin. No NEXT_PUBLIC_ prefix on purpose:
// the browser never sees this value — it only calls same-origin
// /api/backend/* and Next.js forwards to the real API server.
function getBackendBase() {
  // Production backend (Vercel serverless Express).
  // Default intentionally points at the deployed API, NOT localhost:
  // Vercel has no localhost:5050, so the fallback must be the live URL.
  // Override per-environment with BACKEND_URL (server-only, no NEXT_PUBLIC_).
  const raw = process.env.BACKEND_URL || "https://hireloop-server-omega-one.vercel.app/api";
  return raw.replace(/\/+$/, "");
}

async function proxyToBackend(request, pathSegments) {
  const base = getBackendBase();
  const path = (pathSegments || []).join("/");
  const query = request.nextUrl.search || "";
  const target = `${base}${path ? `/${path}` : ""}${query}`;

  const headers = new Headers();
  // Forward auth + content negotiation. Host/connection headers are rebuilt by fetch.
  for (const key of ["authorization", "content-type", "accept", "cookie"]) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  const method = request.method || "GET";
  let body;
  if (method !== "GET" && method !== "HEAD") {
    const buf = await request.arrayBuffer();
    if (buf && buf.byteLength > 0) body = Buffer.from(buf);
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      // Never cache proxied API responses at the edge by default.
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: `Backend unreachable at ${base}. Is the API server running?` },
      { status: 502 },
    );
  }

  const resHeaders = new Headers();
  for (const key of ["content-type"]) {
    const value = upstream.headers.get(key);
    if (value) resHeaders.set(key, value);
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  return new NextResponse(buf, { status: upstream.status, headers: resHeaders });
}

export async function GET(request, context) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function POST(request, context) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function PUT(request, context) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function PATCH(request, context) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function DELETE(request, context) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
