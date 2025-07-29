import { create } from 'zustand';
import { User, fetchUsers } from '../api/collegeAdmin';
import { Alert } from 'react-native';

interface CollegeAdminState {
  users: User[];
  pendingApprovalCount: number;
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  clearError: () => void;
}

export const useCollegeAdminStore = create<CollegeAdminState>((set, get) => ({
  users: [],
  pendingApprovalCount: 0,
  isLoading: false,
  error: null,

  getUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await fetchUsers();
      
      // Calculate pending approval count
      const pendingApprovalCount = users.filter(user => user.status === 'pending').length;
      
      set({ 
        users, 
        pendingApprovalCount,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
      console.error('Get users error:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
