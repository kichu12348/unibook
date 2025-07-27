import { create } from 'zustand';
import { College, fetchColleges, createCollege, CreateCollegeData } from '../api/superAdmin';
import { Alert } from 'react-native';

interface SuperAdminState {
  colleges: College[];
  isLoading: boolean;
  error: string | null;
  getColleges: () => Promise<void>;
  addCollege: (data: CreateCollegeData) => Promise<void>;
  clearError: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set, get) => ({
  colleges: [],
  isLoading: false,
  error: null,

  getColleges: async () => {
    set({ isLoading: true, error: null });
    try {
      const colleges = await fetchColleges();
      set({ colleges, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch colleges';
      set({ error: errorMessage, isLoading: false });
      console.error('Get colleges error:', error);
    }
  },

  addCollege: async (data: CreateCollegeData) => {
    set({ isLoading: true, error: null });
    try {
      await createCollege(data);
      
      // Show success message
      Alert.alert(
        'Success!',
        'College created successfully.',
        [{ text: 'OK' }]
      );
      
      // Refresh the colleges list
      await get().getColleges();
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create college';
      set({ error: errorMessage, isLoading: false });
      
      // Show error message
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
