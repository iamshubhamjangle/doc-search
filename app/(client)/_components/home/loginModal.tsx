"use client";

import { Dialog, DialogContent } from "@/app/(client)/_components/ui/dialog";
import Login from "../../(auth)/login/login";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface LoginModalProps {}

const LoginModal: React.FC<LoginModalProps> = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't render modal on /login page
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"
  )
    return null;

  return (
    <Dialog
      open={!session ? true : false}
      onOpenChange={() => {}} // Prevent closing
    >
      <DialogContent className="[&>button]:hidden">
        <Login />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
