import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create authenticated axios instance for Forum Head
const createAuthenticatedApi = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  locationDetails?: string;
}

export interface Organizer {
  id: string;
  fullName: string;
}

export interface Forum{
    id:string;
    name:string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  bannerImage?: string;
  registrationLink?: string;
  resizeMode?: string;
  createdAt: string;
  venue: {
    id: string;
    name: string;
    locationDetails: string;
  } | null;
  organizer: Organizer;
  forum?: Forum;
}

export interface CreateEventData {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  venueId?: string;
  registrationLink?: string;
  bannerImage?: string;
  resizeMode?: string;
  forumId: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  assignmentRole: string;
}

export interface EventDetails extends Event {
  staff: StaffMember[];
}

export interface UpdateEventData {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  venueId?: string | null;
  registrationLink?: string | null;
  bannerImage?: string | null;
  resizeMode?: string | null;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
}

/**
 * Fetches a list of all upcoming events for the user's college.
 * Calls the GET /forums/events endpoint.
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get("/forums/events");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch events");
    }
    throw new Error("Failed to fetch events. Please try again.");
  }
};

/**
 * Fetches a list of all available venues in the user's college.
 * Calls the GET /forums/venues endpoint.
 */
export const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get("/forums/venues");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch venues");
    }
    throw new Error("Failed to fetch venues. Please try again.");
  }
};

/**
 * Creates a new event.
 * Calls the POST /forums/events endpoint.
 * @param eventData - The data for the new event.
 */
export const createEvent = async (
  eventData: CreateEventData
): Promise<Event> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post("/forums/events", eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // The backend sends 'error' instead of 'message' on conflict
      throw new Error(error.response.data.error || "Failed to create event");
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

/**
 * Fetches the full details for a single event.
 * Calls the GET /forums/events/:eventId endpoint.
 */
export const fetchEventDetails = async (
  eventId: string
): Promise<EventDetails> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/forums/events/${eventId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch event details"
      );
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};


/**
 * Updates an existing event.
 * Calls the PUT /forums/events/:eventId endpoint.
 */
export const updateEvent = async (eventId: string, eventData: UpdateEventData): Promise<Event> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.put(`/forums/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to update event');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

/**
 * Deletes an event.
 * Calls the DELETE /forums/events/:eventId endpoint.
 */
export const deleteEvent = async (eventId: string): Promise<{ message: string }> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.delete(`/forums/events/${eventId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to delete event');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

/**
 * Searches for available teachers within the college.
 * GET /forums/users/teachers exists.
 */
export const searchTeachers = async (searchTerm?: string): Promise<Teacher[]> => {
  try {
    const api = await createAuthenticatedApi();
    const endpoint = searchTerm ? `/forums/users/teachers?search=${encodeURIComponent(searchTerm)}` : '/forums/users/teachers';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to search for teachers');
    }
    throw new Error('An unexpected error occurred while searching for teachers.');
  }
};

/**
 * Sends a request for a teacher to staff an event.
 * Calls the POST /forums/events/:eventId/staff endpoint.
 */
export const requestStaffForEvent = async (eventId: string, userId: string, assignmentRole: string = 'Staff'): Promise<{ message: string }> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post(`/forums/events/${eventId}/staff`, { userId, assignmentRole });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to send staff request');
    }
    throw new Error('An unexpected error occurred.');
  }
};