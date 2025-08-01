import { create } from 'zustand';
import { User, fetchUsers, Forum, createForum, CreateForumData, fetchForums } from '../api/collegeAdmin';
import { Alert } from 'react-native';

interface CollegeAdminState {
  users: User[];
  forums: Forum[];
  pendingApprovalCount: number;
  isLoading: boolean;
  isCreatingForum: boolean;
  isSearchingUsers: boolean;
  isLoadingForums: boolean;
  error: string | null;
  getUsers: (searchTerm?: string) => Promise<void>;
  getForums: () => Promise<void>;
  addForum: (forumData: CreateForumData) => Promise<boolean>;
  clearError: () => void;
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

  getUsers: async (searchTerm?: string) => {
    // Use different loading state for search vs initial load
    const loadingKey = searchTerm ? 'isSearchingUsers' : 'isLoading';
    
    set({ [loadingKey]: true, error: null });
    try {
      const users = await fetchUsers(searchTerm);
      
      // Only calculate pending approval count for initial load (no search term)
      let pendingApprovalCount = get().pendingApprovalCount;
      if (!searchTerm) {
        pendingApprovalCount = users.filter(user => user.approvalStatus === 'pending').length;
      }
      
      set({ 
        users, 
        pendingApprovalCount,
        [loadingKey]: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ error: errorMessage, [loadingKey]: false });
      console.error('Get users error:', error);
    }
  },

  getForums: async () => {
    set({ isLoadingForums: true, error: null });
    try {
      const forums = await fetchForums();
      set({ 
        forums,
        isLoadingForums: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch forums';
      set({ error: errorMessage, isLoadingForums: false });
      console.error('Get forums error:', error);
    }
  },

  addForum: async (forumData: CreateForumData): Promise<boolean> => {
    set({ isCreatingForum: true, error: null });
    try {
      const newForum = await createForum(forumData);
      
      set((state) => ({ 
        forums: [...state.forums, newForum],
        isCreatingForum: false 
      }));
      
      Alert.alert('Success', 'Forum created successfully!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create forum';
      set({ error: errorMessage, isCreatingForum: false });
      Alert.alert('Error', errorMessage);
      console.error('Create forum error:', error);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
