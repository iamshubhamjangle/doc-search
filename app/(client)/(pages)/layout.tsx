import type { Metadata } from "next";
import Navbar from "@/app/(client)/_components/navbar/navbar";
import SideNavBar from "@/app/(client)/_components/sideNavbar/sideNavbar";

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop SideNavbar */}
      <SideNavBar />
      {children}
    </div>
  );
}
