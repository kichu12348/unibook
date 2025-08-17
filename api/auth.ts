import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG,APP_CONFIG } from "../constants/config";

export const publicApi = axios.create({
  baseURL: API_CONFIG.BASE_URI,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

let authToken: string | null;

export function setLocalAuthToken(token: string): void {
  authToken = token;
}

export function removeLocalAuthToken(): void {
  authToken = null;
}

export const authenticatedApi = axios.create({
  baseURL: API_CONFIG.BASE_URI,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

authenticatedApi.interceptors.request.use(
  async (config) => {
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    } else {
      const token = await AsyncStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        setLocalAuthToken(token);
      } else {
        delete config.headers["Authorization"];
        throw new Error("No valid token found");
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  collegeId: string;
  forumIds?: string[];
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  requiresVerification: boolean;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    collegeId?: string;
    approvalStatus: string;
    isEmailVerified: boolean;
    createdAt: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  collegeId?: string;
  approvalStatus: string;
  isEmailVerified: boolean;
  createdAt: string;
}


export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetOtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

// Authentication API functions
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await publicApi.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        message: error.response.data.error || "Login failed",
        code: error.response.data.code,
        email: error.response.data.email
      };
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const registerUser = async (
  formData: RegisterFormData
): Promise<RegisterResponse> => {
  try {
    const response = await publicApi.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Registration failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const verifyUserOtp = async (
  data: VerifyOtpData
): Promise<VerifyOtpResponse> => {
  try {
    const response = await publicApi.post("/auth/verify-email", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "OTP verification failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const fetchMe = async (): Promise<UserProfile> => {
  try {
    const response = await authenticatedApi.get("/auth/me");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(
        error.response.data.error || "Failed to fetch user profile"
      );
    }
    throw new Error("Network error. Please check your connection.");
  }
};


export const resendUserOtp = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await publicApi.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to resend OTP");
    }
    throw new Error("Network error. Please check your connection.");
  }
};


export const requestPasswordReset = async (
  data: ForgotPasswordData
): Promise<{ message: string }> => {
  try {
    const response = await publicApi.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Request failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const verifyPasswordResetOtp = async (
  data: VerifyResetOtpData
): Promise<{ message: string }> => {
  try {
    const response = await publicApi.post("/auth/verify-reset-otp", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "OTP verification failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const resetUserPassword = async (
  data: ResetPasswordData
): Promise<{ message: string }> => {
  try {
    const response = await publicApi.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Password reset failed");
    }
    throw new Error("Network error. Please check your connection.");
  }
};