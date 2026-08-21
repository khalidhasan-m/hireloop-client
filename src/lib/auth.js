import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);

const db = client.db(process.env.AUTH_DB_NAME);

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

export const auth = betterAuth({
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
