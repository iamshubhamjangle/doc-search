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
    // Add additional properties to jwt here.
    // Properties added should be added in @/app/_types/next-auth.d.ts for type safety
    // `jwt` callback is called first, then `session` callback is called
    // Anything set in jwt callback is available in session callback
    jwt: async ({ token, user, account }) => {
      if (user) {
        // token.identifier = user.identifier;
      }
      if (account?.provider === "google" && user) {
        // Create UserProfile if it doesn't exist, this is done here because when user is register UserProfile is created
        // But when user logs in through google oAuth, It doesn't go through registration process. This results in missing userprofile row.
        await prisma.userProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            fileUploadLimit: 2,
            queryLimit: 4,
          },
        });
      }
      return token;
    },
    // Set additional properties in session object
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // in seconds
  },
  // Custom pages
  pages: {
    signIn: "/login",
  },
};
