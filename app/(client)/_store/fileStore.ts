import { create } from "zustand";

interface FileStoreState {
  fileIds: string[]; // Store file IDs as an array
  setFileIds: (fileIds: string[]) => void; // Set multiple file IDs
  addFileId: (fileId: string) => void; // Add a single file ID
  removeFileId: (fileId: string) => void; // Remove a single file ID
}

const useFileStore = create<FileStoreState>((set) => ({
  fileIds: [], // Initially no files selected
  setFileIds: (fileIds) => set({ fileIds }),
  addFileId: (fileId) =>
    set((state) => ({
      fileIds: [...state.fileIds, fileId],
    })),
  removeFileId: (fileId) =>
    set((state) => ({
      fileIds: state.fileIds.filter((id) => id !== fileId),
    })),
}));

export default useFileStore;
