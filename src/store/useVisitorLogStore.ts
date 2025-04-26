/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VisitorLog {
  id: number;
  [key: string]: any;
}

interface VisitorLogStore {
  visitorLogs: VisitorLog[];
  addOrRemoveVisitorLog: (log: VisitorLog) => void;
  clearVisitorLogs: () => void;
}

export const useVisitorLogStore = create<VisitorLogStore>()(
  persist(
    (set) => ({
      visitorLogs: [],
      addOrRemoveVisitorLog: (newLog) =>
        set((state) => {
          const exists = state.visitorLogs.some((log) => log.id === newLog.id);
          if (exists) {
            return {
              visitorLogs: state.visitorLogs.filter(
                (log) => log.id !== newLog.id
              ),
            };
          } else {
            return { visitorLogs: [...state.visitorLogs, newLog] };
          }
        }),
      clearVisitorLogs: () => set({ visitorLogs: [] }),
    }),
    {
      name: "visitor-log-storage", // Storage key in localStorage
    }
  )
);
