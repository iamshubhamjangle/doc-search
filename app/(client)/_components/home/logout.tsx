"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <Button
      className="flex items-center gap-3 rounded-lg px-3 py-2"
      onClick={() => signOut()}
      variant={"outline"}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default Logout;
