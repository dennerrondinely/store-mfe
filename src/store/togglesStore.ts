import { create } from 'zustand';

interface ToggleStore {
  toggles: { [key: string]: boolean };
  setToggles: (tx: { [key: string]: boolean }) => void;
}

export const useToggleStore = create<ToggleStore>()(set => ({
  toggles: {},
  setToggles: tx => set({ toggles: { ...tx } }),
}));
