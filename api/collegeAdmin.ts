import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create authenticated axios instance for College Admin
const createAuthenticatedApi = async () => {
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

// User interfaces
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'teacher' | 'forum_head';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  collegeId: string;
}

// Fetch all users in the admin's college
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('Failed to fetch users. Please try again.');
  }
};

export default createAuthenticatedApi;
