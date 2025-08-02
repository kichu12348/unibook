import { create } from "zustand";
import { Alert } from "react-native";
import {
  Event,
  fetchEvents,
  Venue,
  fetchVenues,
  createEvent,
  CreateEventData,
  updateEvent,
  UpdateEventData,
  deleteEvent,
  Teacher,
  searchTeachers,
  requestStaffForEvent,
} from "../api/forum";

interface ForumHeadState {
  events: Event[];
  venues: Venue[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  teachers: Teacher[];
  isSearchingTeachers: boolean;
  getEvents: () => Promise<void>;
  getVenues: () => Promise<void>;
  addEvent: (eventData: CreateEventData) => Promise<boolean>;
  updateEvent: (
    eventId: string,
    eventData: UpdateEventData
  ) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  searchTeachers: (searchTerm?: string) => Promise<void>; // Add this
  requestStaff: (eventId: string, userId: string) => Promise<boolean>; // Add this
  clearError: () => void;
}

export const useForumHeadStore = create<ForumHeadState>((set, get) => ({
  events: [],
  venues: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  teachers: [],
  isSearchingTeachers: false,

  getEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchEvents();
      set({ events, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch events";
      set({ error: errorMessage, isLoading: false });
      console.error("Get events error:", error);
    }
  },

  getVenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const venues = await fetchVenues();
      set({ venues, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch venues";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", "Could not load available venues.");
    }
  },

  addEvent: async (eventData: CreateEventData) => {
    set({ isSubmitting: true, error: null });
    try {
      const newEvent = await createEvent(eventData);
      set((state) => ({
        events: [newEvent, ...state.events],
        isSubmitting: false,
      }));
      Alert.alert("Success!", "Your event has been created successfully.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create event";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error Creating Event", errorMessage);
      return false;
    }
  },

  updateEvent: async (eventId: string, eventData: UpdateEventData) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedEvent = await updateEvent(eventId, eventData);
      set((state) => ({
        events: state.events.map((e) =>
          e.id === eventId ? { ...e, ...updatedEvent } : e
        ),
        isSubmitting: false,
      }));
      Alert.alert("Success!", "Your event has been updated.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update event";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error Updating Event", errorMessage);
      return false;
    }
  },

  deleteEvent: async (eventId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await deleteEvent(eventId);
      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
        isSubmitting: false,
      }));
      Alert.alert("Success!", "The event has been deleted.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete event";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error Deleting Event", errorMessage);
      return false;
    }
  },

   searchTeachers: async (searchTerm?: string) => {
    set({ isSearchingTeachers: true, error: null });
    try {
      const teachers = await searchTeachers(searchTerm);
      set({ teachers, isSearchingTeachers: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to find teachers';
      set({ error: errorMessage, isSearchingTeachers: false });
      Alert.alert("Error", errorMessage);
    }
  },

  requestStaff: async (eventId: string, userId: string) => {
    set({ isSubmitting: true, error: null }); 
    try {
      await requestStaffForEvent(eventId, userId);
      set({ isSubmitting: false });
      Alert.alert("Success", "The request has been sent to the teacher.");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send request';
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Request Failed", errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
