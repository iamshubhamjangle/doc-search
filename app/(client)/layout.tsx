import "@/app/(client)/(pages)/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/(client)/(pages)/globals.css";
import { cn } from "@/app/_lib/utils";
import Providers from "@/app/(client)/_components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocSearch",
  description: "DocSearch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
