"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  if (session?.user) {
    // console.log("session", session);
    return <button onClick={() => signOut()}>Sign Out</button>;
  }

  return <button onClick={() => signIn("google")}>Signin</button>;
}
