"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/(client)/_components/ui/dropdown-menu";
import UserNavProfilePic from "@/app/(client)/_components/navbar/user-nav-profile-pic";

export function UserNav() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserNavProfilePic />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex">
            <UserNavProfilePic />
            <div className="flex flex-col space-y-1 ml-3">
              <p className="text-sm font-medium leading-none">Shubham Jangle</p>
              <p className="text-xs leading-none text-muted-foreground">
                sjangle@example.com
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
