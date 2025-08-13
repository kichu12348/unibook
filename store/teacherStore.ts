import { create } from "zustand";
import { Alert } from "react-native";
import {
  PendingRequest,
  fetchPendingRequests,
  acceptRequest,
  rejectRequest,
  AcceptedEvent,
  fetchAcceptedEvents,
  cancelAssignment,
} from "../api/teacher";

interface TeacherState {
  pendingRequests: PendingRequest[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  getPendingRequests: () => Promise<void>;
  acceptRequest: (assignmentId: string) => Promise<boolean>;
  rejectRequest: (assignmentId: string) => Promise<boolean>;
  acceptedEvents: AcceptedEvent[];
  getAcceptedEvents: () => Promise<void>;
  cancelAssignment: (assignmentId: string) => Promise<boolean>;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  pendingRequests: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  acceptedEvents: [],

  getPendingRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const requests = await fetchPendingRequests();
      set({ pendingRequests: requests, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch pending requests";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  acceptRequest: async (assignmentId: string) => {
    set({ isSubmitting: true });
    try {
      await acceptRequest(assignmentId);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req.id !== assignmentId
        ),
        isSubmitting: false,
      }));
      Alert.alert("Success", "You have accepted the event request.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept request";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  rejectRequest: async (assignmentId: string) => {
    set({ isSubmitting: true });
    try {
      await rejectRequest(assignmentId);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req.id !== assignmentId
        ),
        isSubmitting: false,
      }));
      Alert.alert("Success", "You have rejected the event request.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject request";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  getAcceptedEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await fetchAcceptedEvents();
      set({ acceptedEvents: events, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch your schedule";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  cancelAssignment: async (assignmentId: string) => {
    set({ isSubmitting: true });
    try {
      await cancelAssignment(assignmentId);
      set((state) => ({
        acceptedEvents: state.acceptedEvents.filter(
          (event) => event.assignmentId !== assignmentId
        ),
        isSubmitting: false,
      }));
      Alert.alert("Success", "Your assignment has been cancelled.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel assignment";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },
}));
