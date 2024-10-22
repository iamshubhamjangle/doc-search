"use client";

import {
  Bot,
  Code,
  Files,
  LogIn,
  LogOut,
  Settings,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/app/(client)/_components/ui/theme-toggle";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const navList = [
  {
    title: "Chat",
    icon: Bot,
    position: "top",
    href: "/",
  },
  {
    title: "Files",
    icon: Files,
    position: "top",
    href: "/files",
  },
  {
    title: "Github",
    icon: Code,
    position: "bottom",
    href: "https://github.com/iamshubhamjangle?tab=repositories",
    external: true,
  },
  {
    title: "Settings",
    icon: Settings,
    position: "bottom",
    href: "/settings",
  },
  {
    title: "Profile",
    icon: UserCircle2,
    position: "bottom",
    href: "/profile",
  },
];

const NavItems = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between h-full m-0 md:m-2">
      <nav className="flex flex-col gap-2 text-sm font-medium">
        {navList.map((item, idx) => {
          if (item.position === "top") {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all ${
                  isActive
                    ? "text-primary bg-muted"
                    : "hover:text-primary hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          }
          return null;
        })}
      </nav>
      <nav className="flex flex-col gap-2 text-sm font-medium mt-auto">
        {/* <ThemeToggle /> */}
        {navList.map((item, idx) => {
          if (item.position === "bottom") {
            return (
              <Link
                target={item.external ? "_blank" : "_self"}
                key={idx}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          }
          return null;
        })}

        {/* SignIn & Signout */}
        {!session?.user && (
          <Button
            className="flex items-center gap-3 rounded-lg px-3 py-2"
            onClick={() => router.push("/login")}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        )}

        {session?.user && (
          <Button
            className="flex items-center gap-3 rounded-lg px-3 py-2"
            onClick={() => signOut()}
            variant={"outline"}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </nav>
    </div>
  );
};

export default NavItems;
