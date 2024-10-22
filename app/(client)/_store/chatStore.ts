import { create } from "zustand";

// Define the structure of a chat message
interface Chat {
  type: "user" | "bot";
  message: string;
  source: null | Array<{
    fileId: string;
    pageNumber: number;
  }>;
}

// Define the structure of the store
interface ChatStore {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  clearChats: () => void;
}

// Create the Zustand store
const useChatStore = create<ChatStore>((set) => ({
  chats: [],

  // Function to add a new chat
  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  // Function to clear all chats
  clearChats: () => set({ chats: [] }),
}));

export default useChatStore;
