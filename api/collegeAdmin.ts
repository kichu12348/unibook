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
  role: 'teacher' | 'forum_head' | 'student';
 approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  collegeId: string;
}

// Event interfaces (for future implementation)
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  forumId: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// Forum interfaces
export interface Forum {
  id: string;
  name: string;
  description: string;
  collegeId: string;
  heads: User[];
  events?: Event[]; // Optional for future events functionality
  createdAt: string;
  updatedAt?: string;
}

export interface CreateForumData {
  name: string;
  description: string;
  headIds: string[];
}

// Fetch all users in the admin's college
export const fetchUsers = async (searchTerm?: string): Promise<User[]> => {
  try {
    const api = await createAuthenticatedApi();
    
    // Build the URL with optional search parameter
    const endpoint = searchTerm 
      ? `/admin/users?search=${encodeURIComponent(searchTerm)}`
      : '/admin/users';
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('Failed to fetch users. Please try again.');
  }
};

// Fetch all forums in the admin's college
export const fetchForums = async (): Promise<Forum[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get('/admin/forums');
    return response.data;
  } catch (error) {
    console.error('Error fetching forums:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch forums');
    }
    throw new Error('Failed to fetch forums. Please try again.');
  }
};

// Fetch details of a specific forum
export const fetchForumDetails = async (forumId: string): Promise<Forum> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/admin/forums/${forumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forum details:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch forum details');
    }
    throw new Error('Failed to fetch forum details. Please try again.');
  }
};

// Create a new forum
export const createForum = async (forumData: CreateForumData): Promise<Forum> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post('/admin/forums', forumData);
    return response.data;
  } catch (error) {
    console.error('Error creating forum:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create forum');
    }
    throw new Error('Failed to create forum. Please try again.');
  }
};

export default createAuthenticatedApi;
