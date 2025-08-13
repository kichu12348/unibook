// store/teacherStore.ts
import { create } from 'zustand';
import { Alert } from 'react-native';
import { Event } from '../api/forum';
import { fetchPublicEvents } from '../api/teacher';

interface TeacherState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  getPublicEvents: () => Promise<void>;
  clearError: () => void;
}

export const useTeacherStore = create<TeacherState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  getPublicEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchPublicEvents();
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch events";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },
  
  clearError: () => set({ error: null }),
}));