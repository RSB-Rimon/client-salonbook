
import { betterAuth,  } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
// import { admin as adminPlugin } from "better-auth/plugins";
import { admin as adminPlugin, jwt } from "better-auth/plugins";

import {
  ac,
  customer,
  adminRole,
} from "./permissions";

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

  database: mongodbAdapter(db, { client }),

  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin: adminRole,
        customer,
      },
      defaultRole: "customer",
      adminRoles: ["admin"],
    }),
    jwt()
  ],
});
