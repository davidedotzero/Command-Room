import { create } from "zustand";

interface RefreshSignalStore {
    refreshKey: number,
    triggerRefresh: () => void
};

export const useRefreshSignalStore = create<RefreshSignalStore>()((set) => ({
    refreshKey: 0,
    triggerRefresh: () => set((state) => ({
        refreshKey: state.refreshKey + 1
    }))
}));
