import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

import prisma from "@/app/_lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        // check to see if email and password is there
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email/Password are required fields!");
        }

        // check to see if user exists
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // if no user was found
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Email/Password!");
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // if password does not match
        if (!passwordMatch) {
          throw new Error("Invalid Email/Password!");
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    // Extra properties mentioned here should be present in @/app/_types/next-auth.d.ts
    // jwt callback is called first, then session callback is called
    // Anything set in jwt callback is available in session callback
    jwt: async ({ token, user }) => {
      if (user) {
        // token.identifier = user.identifier;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        // session.user.identifier = token.identifier;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // in seconds
  },
  pages: {
    signIn: "/login",
  },
};
