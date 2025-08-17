import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  loginUser,
  registerUser,
  verifyUserOtp,
  fetchMe,
  LoginCredentials,
  RegisterFormData,
  VerifyOtpData,
  setLocalAuthToken,
  removeLocalAuthToken,
  resendUserOtp,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetUserPassword,
  ForgotPasswordData,
  VerifyResetOtpData,
  ResetPasswordData,
} from "../api/auth";
import { APP_CONFIG } from "../constants/config";

const { TOKEN_KEY, USER_KEY } = APP_CONFIG;

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
  };
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
  verifyOtp: (data: VerifyOtpData, fullName: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  requestPasswordReset: (data: ForgotPasswordData) => Promise<boolean>;
  verifyPasswordResetOtp: (data: VerifyResetOtpData) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

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
        setLocalAuthToken(token);

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
          console.error("Token validation failed:", error);
          await get().logout();
          set({ appIsReady: true });
        }
      } else {
        set({ appIsReady: true });
      }
    } catch (error) {
      console.error("Error initializing app:", error);
      set({ appIsReady: true, error: "Failed to initialize app" });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await loginUser(credentials);
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      setLocalAuthToken(response.token);
      const user = await fetchMe();
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      if (error && error.code === "NOT_VERIFIED") {
        set({
          isLoading: false,
          error: null,
        });
        throw {
          ...error,
          isVerificationError: true,
        };
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.";
        set({
          isLoading: false,
          error: errorMessage,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        throw error;
      }
    }
  },

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(formData);
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  verifyOtp: async (data: VerifyOtpData, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyUserOtp(data);
      if (response.token) {
        setLocalAuthToken(response.token);
        const user = await fetchMe();
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        set({
          user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        const pendingUser: User = {
          id: "",
          fullName: fullName,
          email: data.email,
          role: "student",
          approvalStatus: "pending",
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };
        set({
          user: pendingUser,
          isAuthenticated: true,
          token: null,
          isLoading: false,
        });
        Alert.alert("Verification Successful!", response.message);
        return true;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed.";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  resendOtp: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await resendUserOtp(email);
      set({ isLoading: false });
      Alert.alert("Success", "A new OTP has been sent to your email.");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  requestPasswordReset: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await requestPasswordReset(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Request failed";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  verifyPasswordResetOtp: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await verifyPasswordResetOtp(data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  resetPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await resetUserPassword(data);
      set({ isLoading: false });
      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please log in."
      );
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);

      removeLocalAuthToken();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
