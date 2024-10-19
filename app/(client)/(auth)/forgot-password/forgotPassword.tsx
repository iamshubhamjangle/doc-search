"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/app/(client)/_components/ui/input";
import { Label } from "@/app/(client)/_components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPassword: React.FC<any> = ({ searchParams }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = searchParams;

  // Sends a request to get password reset link email
  const passwordRecovery = async (e: any) => {
    e.preventDefault();

    const email = e?.target?.email?.value;

    if (!email) {
      toast.error("Email is a required field");
      return; // TODO: Form Error
    }

    setLoading(true);
    axios
      .post("/api/auth/forgot-password", { email })
      .then(() => {
        toast.success(
          "Email sent successfully. Please check your mailbox for further steps."
        );
        router.push("/");
      })
      .catch((e) => toast.error(e?.response?.data || "Something went wrong!"))
      .finally(() => setLoading(false));
  };

  // Sends a require to update password with valid token
  const passwordUpdate = async (e: any) => {
    e.preventDefault();

    const password = e?.target?.password?.value;
    const confirmPassword = e?.target?.confirmPassword?.value;

    if (!password || !confirmPassword) {
      toast.error("Both Password and Confirm Password are required fields");
      return; // TODO: Form Error
    }

    if (password !== confirmPassword) {
      toast.error("Both Password and Confirm Password must match");
      return; // TODO: Form Error
    }

    setLoading(true);
    axios
      .put("/api/auth/forgot-password", { password, token })
      .then(() => {
        toast.success(
          "Password updated successfully. Please login with your new credentials"
        );
        router.replace("/login");
      })
      .catch((e) => toast.error(e?.response?.data || "Something went wrong!"))
      .finally(() => setLoading(false));
  };

  if (!token) {
    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Recover your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to receive a password reset link.
          </p>
        </div>
        <form onSubmit={passwordRecovery} className="flex flex-col gap-4">
          <div>
            {/* <Label htmlFor="email">Your Email</Label> */}
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <Button type="submit" disabled={loading} loading={loading}>
            Submit
          </Button>
        </form>
        <div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/login">
                Already having a account? Login instead.
              </Link>
            </div>
            <div>
              <Link href="/register">Not having a account? Register here.</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Recover your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate a new password for your account
        </p>
      </div>
      <form onSubmit={passwordUpdate} className="flex flex-col gap-4">
        <div>
          {/* <Label htmlFor="password">New Password</Label> */}
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="New Password"
            required
          />
        </div>
        <div>
          {/* <Label htmlFor="confirmPassword">Confirm New Password</Label> */}
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            required
          />
        </div>
        <Button type="submit" disabled={loading} loading={loading}>
          Update your password
        </Button>
      </form>
    </>
  );
};

export default ForgotPassword;
