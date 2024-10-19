"use client";

import { Bot, Code, Files, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { useSession } from "next-auth/react";
import Logout from "./logout";

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
  },
];

const NavItems = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  console.log("session", session);

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
          <Link
            href={"/login"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Button className="flex items-center gap-3 rounded-lg px-3 py-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </Link>
        )}

        {session?.user && <Logout />}
      </nav>
    </div>
  );
};

export default NavItems;
