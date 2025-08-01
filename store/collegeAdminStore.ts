import { create } from "zustand";
import {
  User,
  fetchUsers,
  Forum,
  createForum,
  CreateForumData,
  fetchForums,
  approveUser,
  rejectUser,
  deleteUser,
  updateForum,
  UpdateForumData,
  Venue,
  CreateVenueData,
  fetchVenues,
  createVenue,
  UpdateVenueData,
  updateVenue,
  deleteForum,
  deleteVenue,
} from "../api/collegeAdmin";
import { Alert } from "react-native";

interface CollegeAdminState {
  users: User[];
  forums: { id: string; name: string; description: string }[];
  pendingApprovalCount: number;
  isLoading: boolean;
  isCreatingForum: boolean;
  isSearchingUsers: boolean;
  isLoadingForums: boolean;
  error: string | null;
  getUsers: (searchTerm?: string) => Promise<void>;
  getForums: (searchTerm?: string) => Promise<void>;
  addForum: (forumData: CreateForumData) => Promise<boolean>;
  clearError: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateForum: (forumId: string, data: UpdateForumData) => Promise<boolean>;
  venues: Venue[];
  isLoadingVenues: boolean;
  isSubmitting: boolean;
  isSearchingVenues: boolean;
  getVenues: (searchTerm?: string) => Promise<void>;
  addVenue: (data: CreateVenueData) => Promise<boolean>;
  updateVenue: (venueId: string, data: UpdateVenueData) => Promise<boolean>;
  deleteForum: (forumId: string) => Promise<boolean>;
  deleteVenue: (venueId: string) => Promise<boolean>;
}

export const useCollegeAdminStore = create<CollegeAdminState>((set, get) => ({
  users: [],
  forums: [],
  pendingApprovalCount: 0,
  isLoading: false,
  isCreatingForum: false,
  isSearchingUsers: false,
  isLoadingForums: false,
  error: null,
  venues: [],
  isLoadingVenues: false,
  isSubmitting: false,
  isSearchingVenues: false,

  getUsers: async (searchTerm?: string) => {
    const loadingKey = searchTerm ? "isSearchingUsers" : "isLoading";

    set({ [loadingKey]: true, error: null });
    try {
      const users = await fetchUsers(searchTerm);

      let pendingApprovalCount = get().pendingApprovalCount;
      if (!searchTerm) {
        pendingApprovalCount = users.filter(
          (user) => user.approvalStatus === "pending"
        ).length;
      }

      set({
        users,
        pendingApprovalCount,
        [loadingKey]: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      set({ error: errorMessage, [loadingKey]: false });
      console.error("Get users error:", error);
    }
  },

  getForums: async (searchTerm) => {
    set({ isLoadingForums: true, error: null });
    try {
      const forums = await fetchForums(searchTerm);
      set({
        forums,
        isLoadingForums: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch forums";
      set({ error: errorMessage, isLoadingForums: false });
      console.error("Get forums error:", error);
    }
  },

  addForum: async (forumData: CreateForumData): Promise<boolean> => {
    set({ isCreatingForum: true, error: null });
    try {
      const newForum = await createForum(forumData);

      set((state) => ({
        forums: [...state.forums, newForum],
        isCreatingForum: false,
      }));

      Alert.alert("Success", "Forum created successfully!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create forum";
      set({ error: errorMessage, isCreatingForum: false });
      Alert.alert("Error", errorMessage);
      console.error("Create forum error:", error);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Add these inside the create() function in store/collegeAdminStore.ts

  approveUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await approveUser(userId);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, approvalStatus: "approved" } : user
        ),
        isLoading: false,
      }));
      // Recalculate pending count after approval
      get().getUsers();
      Alert.alert("Success", "User has been approved.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve user";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  rejectUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await rejectUser(userId);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, approvalStatus: "rejected" } : user
        ),
        isLoading: false,
      }));
      // Recalculate pending count after rejection
      get().getUsers();
      Alert.alert("Success", "User has been rejected.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject user";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteUser(userId);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        isLoading: false,
      }));
      Alert.alert("Success", "User has been deleted.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      set({ error: errorMessage, isLoading: false });
      Alert.alert("Error", errorMessage);
    }
  },

  updateForum: async (forumId, data) => {
    // We can reuse isCreatingForum as a general "submitting" state
    set({ isCreatingForum: true, error: null });
    try {
      const updatedForum = await updateForum(forumId, data);
      set((state) => ({
        // Update the specific forum in the list
        forums: state.forums.map((f) =>
          f.id === forumId ? { ...f, ...updatedForum } : f
        ),
        isCreatingForum: false,
      }));
      Alert.alert("Success", "Forum updated successfully!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update forum";
      set({ error: errorMessage, isCreatingForum: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  getVenues: async (searchTerm) => {
    const loadingKey = searchTerm ? "isSearchingVenues" : "isLoadingVenues";
    set({ [loadingKey]: true, error: null });
    try {
      const venues = await fetchVenues(searchTerm);
      set({ venues, [loadingKey]: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch venues";
      set({ error: errorMessage, [loadingKey]: false });
    }
  },

  addVenue: async (data) => {
    set({ isSubmitting: true, error: null, isSearchingVenues: false });
    try {
      const newVenue = await createVenue(data);
      set((state) => ({
        venues: [...state.venues, newVenue],
        isSubmitting: false,
      }));
      Alert.alert("Success", "Venue created successfully!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create venue";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },
  updateVenue: async (venueId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedVenue = await updateVenue(venueId, data);
      set((state) => ({
        venues: state.venues.map((v) => (v.id === venueId ? updatedVenue : v)),
        isSubmitting: false,
      }));
      Alert.alert("Success", "Venue updated successfully!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update venue";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  deleteForum: async (forumId) => {
    set({ isSubmitting: true, error: null }); // Reuse a submitting state
    try {
      await deleteForum(forumId);
      set((state) => ({
        forums: state.forums.filter((f) => f.id !== forumId),
        isSubmitting: false,
      }));
      Alert.alert("Success", "Forum has been deleted.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete forum";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },

  deleteVenue: async (venueId) => {
    set({ isSubmitting: true, error: null }); // Reuse a submitting state again lel
    try {
      await deleteVenue(venueId);
      set((state) => ({
        venues: state.venues.filter((v) => v.id !== venueId),
        isSubmitting: false,
      }));
      Alert.alert("Success", "Venue has been deleted.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete venue";
      set({ error: errorMessage, isSubmitting: false });
      Alert.alert("Error", errorMessage);
      return false;
    }
  },
}));
