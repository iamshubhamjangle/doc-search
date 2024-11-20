import Link from "next/link";
import NavItems from "./navItems";
import { LogoIcon } from "../Icons/logoIcon";

const SideNavBar = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block pb-2">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            <LogoIcon className="h-8 w-8 fill-primary" />
            <span className="">SearchDoc</span>
          </Link>
        </div>
        <NavItems />
      </div>
    </div>
  );
};

export default SideNavBar;
