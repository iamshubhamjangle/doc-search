import React from "react";
import FileSelection from "@/app/(client)/_components/chat/fileSelection";
import Header from "@/app/(client)/_components/home/header";
import { serverAuth } from "@/app/_lib/serverAuth";
import prisma from "@/app/_lib/db";

const ChatHeader = async () => {
  const session = await serverAuth();

  const files = session?.user?.id
    ? await prisma.file.findMany({
        where: {
          userId: session?.user.id,
        },
        select: {
          id: true,
          originalName: true,
        },
      })
    : [];

  return (
    <div className="flex items-center justify-between">
      <Header title="Chat" description="Get started with finding information" />
      <FileSelection files={files} />
    </div>
  );
};

export default ChatHeader;
