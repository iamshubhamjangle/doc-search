export { default } from "next-auth/middleware";

// Both Client and Server Components can be protected here.
export const config = {
  matcher: ["/", "/settings", "/profile"],
};
