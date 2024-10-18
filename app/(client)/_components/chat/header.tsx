import React from "react";
import FileSelection from "@/app/(client)/_components/chat/fileSelection";
import Header from "@/app/(client)/_components/home/header";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <Header title="Chat" description="Get started with finding information" />
      <FileSelection />
    </div>
  );
};

export default ChatHeader;
