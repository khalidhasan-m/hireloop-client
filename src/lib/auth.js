import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// ── Server-only env (no NEXT_PUBLIC_ anywhere in this project) ──
// The browser only calls same-origin /api/*, so Vercel can store
// every variable as Secret — the "public prefix" warning is gone.
const mongoUri = process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017";
const authDbName = process.env.AUTH_DB_NAME || "hireloop_db";

// Reuse the Mongo client across hot-reloads / serverless invocations
// so Vercel Serverless Functions don't open a new connection per request.
const globalForMongo = globalThis;
if (!globalForMongo.__hireloopMongoClient) {
  globalForMongo.__hireloopMongoClient = new MongoClient(mongoUri);
}
const client = globalForMongo.__hireloopMongoClient;

const db = client.db(authDbName);

/**
 * Public signup may only choose seeker | recruiter.
 * Admin is never accepted from the client (set manually in DB).
 */
function sanitizePublicRole(role) {
  if (typeof role === "string" && role.toLowerCase() === "recruiter") {
    return "recruiter";
  }
  return "seeker";
}

// BETTER_AUTH_URL is the canonical app URL (e.g. https://hireloop-client.vercel.app).
// In production, Better Auth requires an explicit secret + base URL.
const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (process.env.NODE_ENV === "production" && !secret) {
  // Fail fast during `next build` so a missing secret is never deployed silently.
  throw new Error(
    "BETTER_AUTH_SECRET is missing. Add it as a Secret (no NEXT_PUBLIC_ prefix) in Vercel env vars.",
  );
}

export const auth = betterAuth({
  ...(baseURL ? { baseURL } : {}),
  ...(secret ? { secret } : {}),

  // Allow the deployed backend / frontend origins when set.
  // Add comma-separated origins via CORS_ORIGINS or TRUSTED_ORIGINS if needed.
  trustedOrigins: [
    ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(",") : []),
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
    ...(baseURL ? [baseURL] : []),
  ].map((o) => o.trim()).filter(Boolean),

  emailAndPassword: {
    enabled: true,
  },

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "seeker",
        input: true, // allow seeker/recruiter from signup form
        returned: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "FREE",
        input: false, // never set by client
        returned: true,
      },
    },
  },

  // Clamp role on create so clients cannot self-assign "admin"
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: sanitizePublicRole(user.role),
              plan: user.plan || "FREE",
            },
          };
        },
      },
    },
  },
});
