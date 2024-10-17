import Image from "next/image";
import Link from "next/link";
import { LogoIcon } from "../Icons/logoIcon";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      {/* <Image src="/logo.png" width={32} height={32} alt="logo" /> */}
      <LogoIcon className="h-8 w-8 mr-2 dark:text-white" />
      <p className="font-bold text-primary">DocSearch</p>
    </Link>
  );
};

export default Logo;
