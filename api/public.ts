import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// College interface
export interface College {
  id: string;
  name: string;
  domainName?: string;
  hasPaid?: boolean;
  createdAt?: string;
}

// Forum interface
export interface Forum {
  id: string;
  name: string;
}

// Fetch all colleges from public endpoint
export const fetchColleges = async (): Promise<College[]> => {
  try {
    // Try the public endpoint first
    let response;
    try {
      response = await api.get('/public/colleges');
    } catch (error) {
      // Fallback to super admin endpoint for development
      response = await api.get('/sa/colleges');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    
    // Return mock data for development if API is not available
    if (__DEV__) {
      return [
        { id: '1', name: 'University of California, Berkeley' },
        { id: '2', name: 'Stanford University' },
        { id: '3', name: 'Massachusetts Institute of Technology' },
        { id: '4', name: 'Harvard University' },
        { id: '5', name: 'Princeton University' },
      ];
    }
    
    throw new Error('Failed to fetch colleges. Please try again.');
  }
};

// Fetch forums for a specific college
export const fetchForumsByCollege = async (collegeId: string): Promise<Forum[]> => {
  try {
    const response = await api.get(`/public/forums/${collegeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forums:', error);
    
    // Return mock data for development if API is not available
    if (__DEV__) {
      return [
        { id: '1', name: 'Computer Science Forum' },
        { id: '2', name: 'Engineering Forum' },
        { id: '3', name: 'Arts & Literature Forum' },
        { id: '4', name: 'Sports & Recreation Forum' },
        { id: '5', name: 'Student Council Forum' },
      ];
    }
    
    throw new Error('Failed to fetch forums. Please try again.');
  }
};

// Registration data interface
export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  collegeId: string;
  role: 'student' | 'teacher' | 'forum_head';
  forumId?: string;
}

// Register user
export const registerUser = async (formData: RegisterFormData): Promise<{ message: string }> => {
  try {
    const response = await api.post('/auth/register', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export default api;
