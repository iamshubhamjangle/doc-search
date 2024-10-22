"use client";

import { Button } from "@/app/(client)/_components/ui/button";
import { Textarea } from "@/app/(client)/_components/ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
import useFileStore from "@/app/(client)/_store/fileStore";
import useChatStore from "@/app/(client)/_store/chatStore";

// Types for the chat response
interface ChatResponse {
  answer: string;
  relevantChunks?: {
    content: string;
    metadata: {
      fileId: string;
      fileName: string;
      pageNumber: number;
    };
  }[];
}

interface ChatInputBoxProps {
  onResponse?: (response: ChatResponse) => void;
  onError?: (error: Error) => void;
}

const ChatInputBox = ({ onResponse, onError }: ChatInputBoxProps) => {
  const [input, setInput] = useState("");
  const fileIds = useFileStore((state) => state.fileIds);
  const { addChat, isLoading, setIsLoading } = useChatStore();

  const handleSendMessage = async () => {
    if (!input || input.trim().length === 0) {
      toast.error("Please enter a message");
      return;
    }

    if (!fileIds || fileIds.length === 0) {
      toast.error("Please select a file");
      return;
    }

    setInput("");
    setIsLoading(true);
    addChat({
      type: "user",
      message: input,
      source: null,
    });

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

      addChat({
        type: "bot",
        message: data.answer,
        source:
          data.relevantChunks?.map((chunk) => ({
            fileId: chunk.metadata.fileId,
            pageNumber: chunk.metadata.pageNumber,
          })) || null,
      });
    } catch (error) {
      addChat({
        type: "bot",
        message:
          "Something went wrong on our side, while processing your request.",
        source: null,
      });
      setInput(input);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
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
