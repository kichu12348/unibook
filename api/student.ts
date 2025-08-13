import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageContentFit } from "expo-image";

// Create authenticated axios instance
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

// --- Interfaces ---
export interface StaffMember {
  id: string;
  fullName: string;
  assignmentRole: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  bannerImage?: string;
  resizeMode: ImageContentFit;
  registrationLink?: string;
  forum: {
    id: string;
    name: string;
  };
  venue: {
    name: string;
    locationDetails: string;
  } | null;
  organizer: {
    id: string;
    fullName: string;
  };
  staff?: StaffMember[];
}

/**
 * Fetches all upcoming public events for the student's college.
 * Calls GET /public/events
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get("/public/events");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to fetch events");
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Fetches the full details of a single public event.
 * Calls GET /public/events/:eventId
 */
export const fetchEventById = async (eventId: string): Promise<Event> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/public/events/${eventId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch event details"
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
};
