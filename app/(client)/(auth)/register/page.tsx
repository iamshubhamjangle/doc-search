import { redirect } from "next/navigation";
import Register from "@/app/(client)/(auth)/register/register";
import { serverAuth } from "@/app/_lib/serverAuth";

const RegisterPage = async ({ searchParams }: any) => {
  const session = await serverAuth();

  if (session) redirect(searchParams?.callbackUrl || "/");

  return <Register searchParams={searchParams} />;
};

export default RegisterPage;
