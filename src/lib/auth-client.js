import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Single Better Auth client instance.
 * Auth API lives on this Next.js app (/api/auth/*).
 * baseURL falls back to same-origin when env is unset.
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    undefined,
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
