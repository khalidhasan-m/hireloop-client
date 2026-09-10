import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Single Better Auth client instance.
 * Auth API lives on this Next.js app (/api/auth/*) — same origin,
 * so no baseURL and no NEXT_PUBLIC_ var is needed at all.
 */
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        plan: {
          type: "string",
        },
      },
    }),
  ],
});

// Re-export from the configured client only (do not create a second client)
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
