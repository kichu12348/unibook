import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create authenticated axios instance for Super Admin
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

// College interfaces
export interface College {
  id: string;
  name: string;
  domainName: string;
  hasPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeAdmin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  collegeId: string;
}

export interface CreateCollegeData {
  name: string;
  domainName: string;
}

// Fetch all colleges
export const fetchColleges = async (): Promise<College[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get('/sa/colleges');
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    
    // Return mock data for development
    if (__DEV__) {
      return [
        {
          id: '1',
          name: 'University of California, Berkeley',
          domainName: 'berkeley.edu',
          hasPaid: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Stanford University',
          domainName: 'stanford.edu',
          hasPaid: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Massachusetts Institute of Technology',
          domainName: 'mit.edu',
          hasPaid: true,
          createdAt: new Date().toISOString(),
        },
      ];
    }
    
    throw new Error('Failed to fetch colleges. Please try again.');
  }
};

// Create a new college
export const createCollege = async (data: CreateCollegeData): Promise<College> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post('/sa/colleges', data);
    return response.data;
  } catch (error) {
    console.error('Error creating college:', error);
    
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to create college.';
      throw new Error(message);
    }
    
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// Fetch college details by ID
export const fetchCollegeDetails = async (collegeId: string): Promise<College> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/sa/colleges/${collegeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching college details:', error);
    
    // Return mock data for development
    if (__DEV__) {
      return {
        id: collegeId,
        name: 'Sample University',
        domainName: 'sample.edu',
        hasPaid: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    throw new Error('Failed to fetch college details. Please try again.');
  }
};

// Fetch college administrators
export const fetchCollegeAdmins = async (collegeId: string): Promise<CollegeAdmin[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/sa/colleges/${collegeId}/admins`);
    return response.data;
  } catch (error) {
    console.error('Error fetching college admins:', error);
    
    // Return mock data for development
    if (__DEV__) {
      return [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john.doe@sample.edu',
          role: 'college_admin',
          createdAt: new Date().toISOString(),
          collegeId: collegeId,
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane.smith@sample.edu',
          role: 'college_admin',
          createdAt: new Date().toISOString(),
          collegeId: collegeId,
        },
      ];
    }
    
    throw new Error('Failed to fetch college administrators. Please try again.');
  }
};

export default createAuthenticatedApi;
