// api/teacher.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, EventDetails } from './forum'; // Reuse types from forum API

// Create an authenticated axios instance for Teacher role
const createAuthenticatedApi = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

/**
 * Fetches all public events for the logged-in user's college.
 * Calls GET /public/events
 */
export const fetchPublicEvents = async (): Promise<Event[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get('/public/events');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch events');
    }
    throw new Error('An unexpected network error occurred.');
  }
};

/**
 * Fetches the details for a single public event.
 * Calls GET /public/events/:eventId
 */
export const fetchPublicEventDetails = async (eventId: string): Promise<EventDetails> => {
    try {
        const api = await createAuthenticatedApi();
        const response = await api.get(`/public/events/${eventId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Failed to fetch event details');
        }
        throw new Error('An unexpected error occurred.');
    }
};