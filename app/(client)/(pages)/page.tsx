// import { serverAuth } from "@/app/_lib/serverAuth";
import ChatBox from "@/app/(client)/_components/chat/chatBox";
import ChatInputBox from "@/app/(client)/_components/chat/chatInputBox";
import MainContentWrapper from "@/app/(client)/_components/home/MainContentWrapper";
import ChatHeader from "@/app/(client)/_components/chat/header";
import LoginModal from "../_components/home/loginModal";

export default function Home() {
  return (
    <MainContentWrapper>
      <div className="grid grid-rows-[auto,1fr,auto] gap-4 lg:gap-6 h-full">
        <ChatHeader />
        <ChatBox />
        <ChatInputBox />
      </div>
    </MainContentWrapper>
  );
}
