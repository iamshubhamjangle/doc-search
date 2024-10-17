"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from "@/app/_lib/edgestore";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/app/(client)/_components/theme-provider";
import { TooltipProvider } from "@/app/(client)/_components/ui/tooltip";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <Toaster />
      <EdgeStoreProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </EdgeStoreProvider>
    </SessionProvider>
  );
};

export default Providers;
