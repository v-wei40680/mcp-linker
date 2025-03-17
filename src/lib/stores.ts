import { create } from "zustand";

// Define the store's state and actions
interface StoreState {
  selectedClient: string;
  setSelectedClient: (item: string | null) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
}

// Create the store
export const useStore = create<StoreState>((set) => ({
  selectedClient: "claude", // 统一默认值
  setSelectedClient: (item) => set({ selectedClient: item ?? "claude" }),
  selectedFolder: null,
  setSelectedFolder: (folder) => set({ selectedFolder: folder ?? "" }),
}));
