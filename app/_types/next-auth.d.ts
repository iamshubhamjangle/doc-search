import NextAuth from "next-auth";

/**
 * Type declaration for Session and JWT Object.
 * If something needs to be added in session, also at it here to avoid typescript complaints.
 */

declare module "next-auth" {
  interface Session {
    user: {
      // identifier: string;
    } & DefaultSession["user"];
  }

  interface User {
    // identifier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // identifier: string;
  }
}
