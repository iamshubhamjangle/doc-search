"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/app/(client)/_components/ui/button";
import { Input } from "@/app/(client)/_components/ui/input";
import Link from "next/link";

const RegisterAuthForm = ({ searchParams }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRegisterUser = (formInput: FormData) => {
    setLoading(true);
    const name = formInput.get("name");
    const email = formInput.get("email");
    const password = formInput.get("password");
    const data = { name, email, password };

    axios
      .post("/api/auth/register", data)
      .then(() =>
        toast.success("Registration successfull! Please login to continue")
      )
      .then(() =>
        // After login, callback to requested page.
        router.replace(
          searchParams?.callbackUrl
            ? `/login?callbackUrl=${encodeURIComponent(
                searchParams?.callbackUrl
              )}`
            : "/login"
        )
      )
      .catch((e) => toast.error(e?.response?.data || "Something went wrong!"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <form action={handleRegisterUser} className="flex flex-col gap-4">
        <div>
          {/* <Label htmlFor="name">Your Full Name</Label> */}
          <Input
            id="name"
            type="name"
            name="name"
            placeholder="Full name"
            required
          />
        </div>
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
        <Button type="submit" loading={loading} disabled={loading}>
          Register
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
        <div className="mt-6 text-center text-sm">
          {searchParams?.callbackUrl ? (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(
                searchParams?.callbackUrl
              )}`}
            >
              Already having a account? Login instead.
            </Link>
          ) : (
            <Link href={`/login`}>
              Already having a account? Login instead.
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterAuthForm;
