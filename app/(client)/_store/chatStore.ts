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
  isLoading: boolean;
  chats: Chat[];
  addChat: (chat: Chat) => void;
  clearChats: () => void;
  setIsLoading: (value: boolean) => void;
}

// Create the Zustand store
const useChatStore = create<ChatStore>((set) => ({
  isLoading: false,
  chats: [
    // {
    //   type: "user",
    //   message: "What is common in most successful people in history",
    //   source: null,
    // },
    // {
    //   type: "bot",
    //   message:
    //     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente nemo ipsum dolore unde, cum vel obcaecati enim? Provident cupiditate earum eius velit quisquam nemo porro consequatur. Explicabo neque sunt ducimus consectetur error magnam doloremque illum eius sequi modi beatae consequatur, nulla aut in quasi voluptatibus. Pariatur modi porro culpa. Eos.",
    //   source: [
    //     {
    //       fileId: "cm2k2k9bc0003uamwfgmokf4k",
    //       pageNumber: 6,
    //     },
    //     {
    //       fileId: "cm2k2k9bc0003uamwfgmokf4k",
    //       pageNumber: 2,
    //     },
    //   ],
    // },
  ],

  // Function to add a new chat
  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  // Function to clear all chats
  clearChats: () => set({ chats: [] }),

  setIsLoading: (value: boolean) => set({ isLoading: value }),
}));

export default useChatStore;
