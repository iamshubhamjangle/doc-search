import { redirect } from "next/navigation";

import LoginComponent from "@/app/(client)/(auth)/login/login";
import { serverAuth } from "@/app/_lib/serverAuth";

const LoginPage = async ({ searchParams }: any) => {
  const session = await serverAuth();

  if (session) redirect("/");

  return <LoginComponent searchParams={searchParams} />;
};

export default LoginPage;
