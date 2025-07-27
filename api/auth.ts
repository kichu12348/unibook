import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create authenticated axios instance for auth operations
const createAuthApi = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

// Base axios instance for non-authenticated requests
export const authApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Authentication API functions
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export const registerUser = async (formData: RegisterFormData): Promise<RegisterResponse> => {
  try {
    const response = await authApi.post('/auth/register', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export const verifyUserOtp = async (data: VerifyOtpData): Promise<VerifyOtpResponse> => {
  try {
    const response = await authApi.post('/auth/verify-email', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'OTP verification failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export const fetchMe = async (): Promise<UserProfile> => {
  try {
    const api = await createAuthApi();
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(error.response.data.message || 'Failed to fetch user profile');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Set authorization header for subsequent requests
export const setAuthToken = (token: string) => {
  authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Remove authorization header
export const removeAuthToken = () => {
  delete authApi.defaults.headers.common['Authorization'];
};
