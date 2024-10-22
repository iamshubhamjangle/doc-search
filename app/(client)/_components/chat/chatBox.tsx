"use client";

import {
  Card,
  CardDescription,
  CardHeader,
} from "@/app/(client)/_components/ui/card";
import useChatStore from "@/app/(client)/_store/chatStore";

const ChatBox = () => {
  const { chats } = useChatStore();

  return (
    <div className="row-start-2 row-end-3 overflow-y-auto flex flex-col gap-2">
      {chats.map((chat, index) => {
        return (
          <div key={index}>
            {chat.type === "user" && (
              <Card className="sm:col-span-2 shadow-none ml-10 mr-2 bg-secondary ">
                <CardHeader className="p-3">
                  <CardDescription className="max-w-lg">
                    {chat.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {chat.type === "bot" && (
              <Card className="sm:col-span-2 shadow-none mr-10">
                <CardHeader className="p-3">
                  <CardDescription className="max-w-lg">
                    {chat.message}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
