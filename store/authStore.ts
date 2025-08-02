import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { 
  loginUser, 
  registerUser, 
  verifyUserOtp, 
  fetchMe, 
  setAuthToken, 
  removeAuthToken,
  LoginCredentials,
  RegisterFormData,
  VerifyOtpData 
} from '../api/auth';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  collegeId?: string;
  approvalStatus: string;
  isEmailVerified: boolean;
  createdAt: string;
  forum_heads?: {
    forumId: string;
    isVerified: boolean;
    forum: { name: string };
  }[];
  college?: {
    id: string;
    name: string;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  appIsReady: boolean;
  initializeApp: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<boolean>;
  verifyOtp: (data: VerifyOtpData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  appIsReady: false,

  initializeApp: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (token) {
        // Set token in axios headers
        setAuthToken(token);
        
        try {
          // Fetch user profile to validate token
          const user = await fetchMe();
          set({
            token,
            user,
            isAuthenticated: true,
            appIsReady: true,
            error: null,
          });
        } catch (error) {
          // Token is invalid, clear it
          console.error('Token validation failed:', error);
          await get().logout();
          set({ appIsReady: true });
        }
      } else {
        set({ appIsReady: true });
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ appIsReady: true, error: 'Failed to initialize app' });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await loginUser(credentials);
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      
      // Set token in axios headers for immediate use
      setAuthToken(response.token);
      
      // Fetch user details using the token
      const user = await fetchMe();
      
      // Save user data to AsyncStorage
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user ? user : {}));

      set({
        user: user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      throw error;
    }
  },

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerUser(formData);
      
      // Show success message
      Alert.alert(
        'Registration Successful!',
        response.message || 'Please check your email for a verification code.',
        [{ text: 'OK' }]
      );
      
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  verifyOtp: async (data: VerifyOtpData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyUserOtp(data);
      
      if (response.token) {
        // Set token in axios headers first
        setAuthToken(response.token);
        
        let user = response.user;
        
        // If no user object provided, fetch user details
        if (!user) {
          user = await fetchMe();
        }
        
        // User is approved, handle like login
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        
        set({
          user: user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        Alert.alert(
          'Verification Successful!',
          'Welcome! You have been logged in successfully.',
          [{ text: 'OK' }]
        );
        
        return true; // User is authenticated
      } else {
        // User verification successful but pending approval
        set({ isLoading: false, error: null });
        
        Alert.alert(
          'Verification Successful!',
          response.message || 'Your account is pending approval. You will be notified once approved.',
          [{ text: 'OK' }]
        );
        
        return false; // User not authenticated yet, pending approval
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      
      Alert.alert('Verification Failed', errorMessage, [{ text: 'OK' }]);
      
      return false;
    }
  },

  logout: async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      // Remove token from axios headers
      removeAuthToken();
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
