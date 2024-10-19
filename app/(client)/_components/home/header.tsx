import Link from "next/link";
import { Menu, Package2 } from "lucide-react";

import { CONSTANTS } from "@/app/_lib/constants";

import NavItems from "@/app/(client)/_components/home/navItems";
import { Button } from "@/app/(client)/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/(client)/_components/ui/sheet";

interface HeaderProps {
  title: string;
  description: string;
}

const appHeaderBrandIcon = {
  title: CONSTANTS.appName,
  icon: Package2,
};

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <header className="row-start-1 row-end-2 flex items-center gap-4">
      {/* Mobile SideNavbar Trigger Button*/}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <appHeaderBrandIcon.icon className="h-6 w-6" />
              <span className="">{appHeaderBrandIcon.title}</span>
            </Link>
          </div>
          <NavItems />
        </SheetContent>
      </Sheet>
      {/* Header */}
      <div className="w-full">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
