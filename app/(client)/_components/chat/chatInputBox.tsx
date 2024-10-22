"use client";

import { Button } from "@/app/(client)/_components/ui/button";
import { Textarea } from "@/app/(client)/_components/ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
import useFileStore from "@/app/(client)/_store/fileStore";

// Types for the chat response
interface ChatResponse {
  answer: string;
  relevantChunks?: {
    content: string;
    metadata: {
      pageNumber: number;
      fileName: string;
    };
  }[];
}

interface ChatInputBoxProps {
  onResponse?: (response: ChatResponse) => void;
  onError?: (error: Error) => void;
}

const ChatInputBox = ({ onResponse, onError }: ChatInputBoxProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileIds = useFileStore((state) => state.fileIds);

  const handleSendMessage = async () => {
    if (!input || input.trim().length === 0) {
      toast.error("Please enter a message");
      return;
    }

    if (!fileIds || fileIds.length === 0) {
      toast.error("Please select a file");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Processing your question...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input.trim(),
          fileIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data: ChatResponse = await response.json();

      toast.success("Response received", { id: loadingToast });
      // onResponse?.(data);
      console.log("data", data);

      setInput("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage, { id: loadingToast });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press (Shift + Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="row-start-3 row-end-4 flex border border-slate-300 w-full items-center rounded-md">
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-md m-2"
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
};

export default ChatInputBox;
