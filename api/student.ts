import axios from "axios";
import { authenticatedApi } from "./auth";
import { ImageContentFit } from "expo-image";

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
    const response = await authenticatedApi.get("/public/events");
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
    const response = await authenticatedApi.get(`/public/events/${eventId}`);
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
