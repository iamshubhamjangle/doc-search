import { Button } from "@/app/(client)/_components/ui/button";
import { Textarea } from "@/app/(client)/_components/ui/textarea";

const ChatInputBox = () => {
  return (
    <div className="row-start-3 row-end-4 flex border border-slate-300 w-full items-center rounded-md">
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" size="sm" className="rounded-md m-2">
        Send
      </Button>
    </div>
  );
};

export default ChatInputBox;
