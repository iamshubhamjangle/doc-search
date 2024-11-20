"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/app/(client)/_components/theme-provider";
import { TooltipProvider } from "@/app/(client)/_components/ui/tooltip";
import LoginModal from "./home/loginModal";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <LoginModal />
      <Toaster />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
