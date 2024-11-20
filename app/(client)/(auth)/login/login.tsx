"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/app/(client)/_components/ui/button";
import { Input } from "@/app/(client)/_components/ui/input";
import Link from "next/link";

const Login: React.FC<any> = ({ searchParams }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Handles Google OAuth Error which are passed as ?error=
    if (searchParams?.error) {
      setLoading(false);
      if (searchParams?.error === "OAuthAccountNotLinked") {
        toast.error(
          "Your account already exist. Please login with your credentials"
        );
      } else {
        toast.error(`Login Failed: ${searchParams?.error}`);
      }

      // Remove the error from query params to avoid multiple error toast on page re-render
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  const handleLoginWithCredentials = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res?.error || "Server Error");
      return;
    }

    if (res?.ok) {
      router.refresh();
    }
  };

  const handleLoginWithGoogleOAuth = () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to login
        </p>
      </div>
      <form
        onSubmit={handleLoginWithCredentials}
        className="flex flex-col gap-4"
      >
        <div>
          {/* <Label htmlFor="email">Email</Label> */}
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          {/* <Label htmlFor="password">Password</Label> */}
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit" disabled={loading} loading={loading}>
          Login
        </Button>
      </form>
      <div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoginWithGoogleOAuth}
            disabled={loading}
            loading={loading}
            className="border-primary text-primary hover:text-primary w-full"
          >
            <svg
              className="w-4 h-4 mr-2 text-primary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path
                fillRule="evenodd"
                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
        <div className="mt-6 text-center text-sm space-y-2">
          <div className="block">
            <Link href="/forgot-password">Forgot your password?</Link>
          </div>
          <div className="block">
            {searchParams?.callbackUrl ? (
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(
                  searchParams?.callbackUrl
                )}`}
              >
                Not having a account? Register here.
              </Link>
            ) : (
              <Link href={`/register`}>
                Not having a account? Register here.
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
