// import { serverAuth } from "@/app/_lib/serverAuth";
import ChatBox from "@/app/(client)/_components/home/chatBox";
import ChatInputBox from "@/app/(client)/_components/home/chatInputBox";
import FileSelection from "@/app/(client)/_components/home/fileSelection";
import Header from "@/app/(client)/_components/home/header";

export default function Home() {
  // const session = await serverAuth();

  return (
    <main className="grid grid-rows-[auto_1fr_auto] flex-1 gap-4 lg:gap-6 p-4 lg:p-6 max-h-[100vh]">
      <div className="flex items-center justify-between">
        <Header
          title="Chat"
          description="Get started with finding information"
        />
        <FileSelection />
      </div>
      <ChatBox />
      <ChatInputBox />
    </main>
  );
}
