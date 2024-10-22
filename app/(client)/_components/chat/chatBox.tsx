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
    <div className="overflow-y-auto h-full">
      <div className="flex flex-col gap-3">
        {chats.map((chat, index) => {
          return (
            <div key={index}>
              {chat.type === "user" && (
                <Card className="shadow-none ml-16 mr-2 bg-emerald-100 dark:bg-emerald-900">
                  <CardHeader className="p-3">
                    <CardDescription className="text-end dark:text-white">
                      {chat.message}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              {chat.type === "bot" && (
                <Card className="shadow-none mr-16">
                  <CardHeader className="p-3">
                    <CardDescription className="text-start dark:text-white">
                      {chat.message}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBox;
