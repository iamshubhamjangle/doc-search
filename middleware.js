// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Both Client and Server Components can be protected here.
export const config = {
  matcher: ["/", "/settings", "/profile"],
};
