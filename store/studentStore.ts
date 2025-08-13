import { create } from "zustand";
import { Alert } from "react-native";
import { Event, fetchEvents } from "../api/student";

interface StudentState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  getEvents: () => Promise<void>;
}

export const useStudentStore = create<StudentState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  getEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchEvents();
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch events";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },
}));