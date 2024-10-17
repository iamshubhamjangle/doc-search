import Link from "next/link";

import { cn } from "@/app/_lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Signup
      </Link>
    </nav>
  );
}
