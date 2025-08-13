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
  removeStaffFromEvent,
  requestCollaboration,
  removeCollaborator,
  EventActivity,
  fetchYearlyEventActivity,
  fetchEventsByMonth,
  PendingHead,
  fetchPendingForumHeads,
  approvePendingForumHead,
  rejectPendingForumHead,
} from "../api/forum";
import { searchAllForums } from "../api/public";

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
  searchTeachers: (searchTerm?: string) => Promise<void>;
  requestStaff: (eventId: string, userId: string) => Promise<boolean>;
  removeStaff: (eventId: string, staffUserId: string) => Promise<boolean>;
  searchedForums: any[];
  isSearchingForums: boolean;
  requestCollaboration: (eventId: string, forumId: string) => Promise<boolean>;
  removeCollaborator: (eventId: string, forumId: string) => Promise<boolean>;
  searchAllForums: (
    searchTerm: string,
    organizingForumId: string
  ) => Promise<void>;
  eventActivity: EventActivity[];
  getYearlyActivity: (year: number) => Promise<void>;
  monthlyEvents: Event[];
  getMonthlyEvents: (year: number, month: number) => Promise<void>;
  pendingHeads: PendingHead[];
  getPendingHeads: () => Promise<void>;
  approveHead: (userId: string) => Promise<void>;
  rejectHead: (userId: string) => Promise<void>;
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
  searchedForums: [],
  isSearchingForums: false,
  eventActivity: [],
  pendingHeads: [],
  monthlyEvents: [],

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to find teachers";
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send request";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Request Failed", errorMessage);
      return false;
    }
  },

  removeStaff: async (eventId: string, staffUserId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await removeStaffFromEvent(eventId, staffUserId);
      set({ isSubmitting: false });
      Alert.alert("Success", "Staff member has been removed from the event.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove staff member";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  searchAllForums: async (searchTerm, organizingForumId) => {
    if (!searchTerm || searchTerm.length < 3) {
      set({ searchedForums: [] });
      return;
    }
    set({ isSearchingForums: true });
    try {
      const forums = await searchAllForums(searchTerm, organizingForumId);
      set({ searchedForums: forums, isSearchingForums: false });
    } catch (error) {
      set({ isSearchingForums: false });
    }
  },

  requestCollaboration: async (eventId, forumId) => {
    set({ isSubmitting: true });
    try {
      await requestCollaboration(eventId, forumId);
      Alert.alert("Success", "Collaboration request sent successfully!");
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed";
      Alert.alert("Error", message);
      set({ isSubmitting: false });
      return false;
    }
  },

  removeCollaborator: async (eventId, forumId) => {
    set({ isSubmitting: true });
    try {
      await removeCollaborator(eventId, forumId);
      Alert.alert("Success", "Collaborator removed.");
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove collaborator.";
      Alert.alert("Error", message);
      set({ isSubmitting: false });
      return false;
    }
  },

  getYearlyActivity: async (year: number) => {
    set({ isLoading: true, error: null });
    try {
      const activityData = await fetchYearlyEventActivity(year);
      set({ eventActivity: activityData, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch event activity";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  getMonthlyEvents: async (year: number, month: number) => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchEventsByMonth(year, month);
      set({ monthlyEvents: events, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch events for this month";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  getPendingHeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const heads = await fetchPendingForumHeads();
      set({ pendingHeads: heads, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch pending approvals";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  approveHead: async (userId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await approvePendingForumHead(userId);
      set((state) => ({
        pendingHeads: state.pendingHeads.filter((head) => head.id !== userId),
        isSubmitting: false,
      }));
      Alert.alert("Success", "User has been approved.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve user";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Approval Failed", errorMessage);
    }
  },

  rejectHead: async (userId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await rejectPendingForumHead(userId);
      set((state) => ({
        pendingHeads: state.pendingHeads.filter((head) => head.id !== userId),
        isSubmitting: false,
      }));
      Alert.alert("Success", "User has been rejected.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject user";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Rejection Failed", errorMessage);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
