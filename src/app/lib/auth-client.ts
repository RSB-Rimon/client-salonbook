import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

// Keep server-owned fields typed in the client and enable signed JWT retrieval for Express APIs.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;