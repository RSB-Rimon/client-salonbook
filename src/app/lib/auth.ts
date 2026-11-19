import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from the environment.");
}

const client = new MongoClient(mongoUri);
const db = client.db("salonbookDB");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "admin"],
        required: false,
        defaultValue: "customer",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          role: user.role,
          isBlocked: user.isBlocked,
        }),
      },
    }),
  ],
  database: mongodbAdapter(db, { client }),
});