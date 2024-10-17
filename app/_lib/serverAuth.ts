import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_lib/auth";

export const serverAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
};
