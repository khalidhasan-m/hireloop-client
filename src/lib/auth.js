import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  //...other options
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //   },
  // },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  user: {
    additionalFields: {
      role: {
        default: "seeker",
      },
    },
  },
});
