import { create } from 'zustand';
import { 
  College, 
  CollegeAdmin,
  fetchColleges, 
  createCollege, 
  CreateCollegeData,
  createCollegeAdmin,
  CreateCollegeAdminData,
  fetchCollegeAdmins,
  updateCollege,
  UpdateCollegeData
} from '../api/superAdmin';
import { Alert } from 'react-native';

interface SuperAdminState {
  colleges: College[];
  collegeAdmins: { [collegeId: string]: CollegeAdmin[] };
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  getColleges: () => Promise<void>;
  addCollege: (data: CreateCollegeData) => Promise<void>;
  editCollege: (collegeId: string, updateData: UpdateCollegeData) => Promise<void>;
  getCollegeAdmins: (collegeId: string) => Promise<void>;
  addCollegeAdmin: (collegeId: string, adminData: CreateCollegeAdminData) => Promise<void>;
  clearError: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set, get) => ({
  colleges: [],
  collegeAdmins: {},
  isLoading: false,
  isSubmitting: false,
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

  editCollege: async (collegeId: string, updateData: UpdateCollegeData) => {
    set({ isSubmitting: true, error: null });
    try {
      await updateCollege(collegeId, updateData);
      
      // Show success message
      Alert.alert(
        'Success!',
        'College updated successfully.',
        [{ text: 'OK' }]
      );
      
      // Refresh the colleges list to get the updated data
      await get().getColleges();
      set({ isSubmitting: false });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update college';
      set({ error: errorMessage, isSubmitting: false });
      
      // Show error message
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  },

  getCollegeAdmins: async (collegeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const admins = await fetchCollegeAdmins(collegeId);
      set((state) => ({
        collegeAdmins: {
          ...state.collegeAdmins,
          [collegeId]: admins
        },
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch college admins';
      set({ error: errorMessage, isLoading: false });
      console.error('Get college admins error:', error);
    }
  },

  addCollegeAdmin: async (collegeId: string, adminData: CreateCollegeAdminData) => {
    set({ isSubmitting: true, error: null });
    try {
      const newAdmin = await createCollegeAdmin(collegeId, adminData);
      
      // Update the local state with the new admin
      set((state) => ({
        collegeAdmins: {
          ...state.collegeAdmins,
          [collegeId]: [...(state.collegeAdmins[collegeId] || []), newAdmin]
        },
        isSubmitting: false
      }));
      
      // Show success message
      Alert.alert(
        'Success!',
        'College administrator created successfully.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error && typeof error === 'object' && 'response' in error) 
          ? (error.response as any).error 
          : 'Failed to create college administrator';
      set({ error: errorMessage, isSubmitting: false });
      
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
