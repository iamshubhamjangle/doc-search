import { redirect } from "next/navigation";

import ForgotPassword from "@/app/(client)/(auth)/forgot-password/forgotPassword";
import { serverAuth } from "@/app/_lib/serverAuth";

const LoginPage = async ({ searchParams }: any) => {
  const session = await serverAuth();

  if (session) redirect(searchParams?.callbackUrl || "/");

  return <ForgotPassword searchParams={searchParams} />;
};

export default LoginPage;
