import Logo from "@/app/(client)/_components/navbar/logo";
import { MainNav } from "@/app/(client)/_components/navbar/main-nav";
import { UserNav } from "@/app/(client)/_components/navbar/user-nav";
import { serverAuth } from "@/app/_lib/serverAuth";

const Navbar = async () => {
  const session = await serverAuth();

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Logo />
        <div className="ml-auto flex items-center space-x-4">
          {!session && <MainNav className="mx-6" />}
          {session && <UserNav />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
