// import { serverAuth } from "@/app/_lib/serverAuth";
import ChatBox from "@/app/(client)/_components/chat/chatBox";
import ChatInputBox from "@/app/(client)/_components/chat/chatInputBox";
import MainContentWrapper from "@/app/(client)/_components/home/MainContentWrapper";
import ChatHeader from "@/app/(client)/_components/chat/header";

export default function Home() {
  return (
    <MainContentWrapper>
      <div className="flex flex-col gap-4 lg:gap-6">
        <ChatHeader />
        <ChatBox />
        <ChatInputBox />
      </div>
    </MainContentWrapper>
  );
}
