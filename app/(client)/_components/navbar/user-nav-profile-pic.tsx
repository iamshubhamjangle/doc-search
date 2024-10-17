"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/(client)/_components/ui/avatar";
import { Button } from "@/app/(client)/_components/ui/button";
import { useSession } from "next-auth/react";

const UserNavProfilePic = () => {
  const { data: session } = useSession();

  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src={session?.user?.image || ""} alt="user avatar" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
    </Button>
  );
};

export default UserNavProfilePic;
