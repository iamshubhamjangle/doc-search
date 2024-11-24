"use client";

import { Dialog, DialogContent } from "@/app/(client)/_components/ui/dialog";
import Login from "./login";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type RouteConfig = {
  // Routes that require authentication
  protected?: string[];
  // Routes that are always public
  public?: string[];
  // Whether to protect all routes by default (except public routes)
  protectAllRoutes?: boolean;
  // Custom component to render inside modal
  loginComponent?: React.ReactNode;
};

interface LoginModalProps {
  config?: RouteConfig;
}

const LoginModal: React.FC<LoginModalProps> = ({ config = {} }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const {
    protected: protectedRoutes = [],
    public: publicRoutes = ["/login", "/register", "/forgot-password"],
    protectAllRoutes = true,
    loginComponent = <Login />,
  } = config;

  // Helper function to check if current path matches any route pattern
  const matchesRoute = (path: string, routes: string[]) => {
    return routes.some((route) => {
      // Convert route pattern to regex
      const pattern = route.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    });
  };

  // Determine if the current route needs authentication
  const needsAuth = () => {
    // Public routes never need auth
    if (matchesRoute(pathname, publicRoutes)) {
      return false;
    }

    // If protecting all routes, only public routes are excluded
    if (protectAllRoutes) {
      return true;
    }

    // Check if route matches any protected patterns
    return matchesRoute(pathname, protectedRoutes);
  };

  // Don't render modal if route doesn't need auth or user is authenticated
  if (!needsAuth() || session) {
    return null;
  }

  return (
    <Dialog
      open={true}
      onOpenChange={() => {}} // Allow closing if specified
    >
      <DialogContent className="[&>button]:hidden">
        {loginComponent}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
