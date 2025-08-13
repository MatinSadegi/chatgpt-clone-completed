import { create } from "zustand";

export const useChats = create((set) => ({
  historyId: "",
  initialMessage: null, // <-- فیلد جدید برای نگهداری پیام اول
  setHistoryId: (newId) => set(() => ({ historyId: newId })),
  setInitialMessage: (message) => set({ initialMessage: message }), // <-- اکشن جدید
  clearInitialMessage: () => set({ initialMessage: null }),
}));
