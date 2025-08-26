import { create } from 'zustand';

interface MoneyStore {
  transactions: any[];
  setTransactions: (tx: any[]) => void;
}

export const useMoneyStore = create<MoneyStore>()((set) => ({
  transactions: [],
  setTransactions: (tx) => set({ transactions: tx }),
}));
