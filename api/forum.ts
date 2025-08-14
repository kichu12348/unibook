import axios from "axios";
import { authenticatedApi } from "./auth";

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

export interface Forum {
  id: string;
  name: string;
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
  status: "pending" | "approved" | "rejected";
}

export interface EventDetails extends Event {
  staff: StaffMember[];
  collaboratingForums: { id: string; name: string }[];
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

export interface EventActivity {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface PendingHead {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

/**
 * Fetches a list of all upcoming events for the user's college.
 * Calls the GET /forums/events endpoint.
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await authenticatedApi.get("/forums/events");
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
    const response = await authenticatedApi.get("/forums/venues");
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
    const response = await authenticatedApi.post("/forums/events", eventData);
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
    const response = await authenticatedApi.get(`/forums/events/${eventId}`);
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
export const updateEvent = async (
  eventId: string,
  eventData: UpdateEventData
): Promise<Event> => {
  try {
    const response = await authenticatedApi.put(`/forums/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to update event");
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

/**
 * Deletes an event.
 * Calls the DELETE /forums/events/:eventId endpoint.
 */
export const deleteEvent = async (
  eventId: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.delete(`/forums/events/${eventId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to delete event");
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

/**
 * Searches for available teachers within the college.
 * GET /forums/users/teachers exists.
 */
export const searchTeachers = async (
  searchTerm?: string
): Promise<Teacher[]> => {
  try {
    const endpoint = searchTerm
      ? `/forums/users/teachers?search=${encodeURIComponent(searchTerm)}`
      : "/forums/users/teachers";
    const response = await authenticatedApi.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to search for teachers"
      );
    }
    throw new Error(
      "An unexpected error occurred while searching for teachers."
    );
  }
};

/**
 * Sends a request for a teacher to staff an event.
 * Calls the POST /forums/events/:eventId/staff endpoint.
 */
export const requestStaffForEvent = async (
  eventId: string,
  userId: string,
  assignmentRole: string = "Staff In Charge"
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.post(`/forums/events/${eventId}/staff`, {
      userId,
      assignmentRole,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to send staff request"
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

/**
 * Removes a staff member from an event.
 * Calls the DELETE /forums/events/:eventId/staff/:staffUserId endpoint.
 */
export const removeStaffFromEvent = async (
  eventId: string,
  staffUserId: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.delete(
      `/forums/events/${eventId}/staff/${staffUserId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to remove staff member"
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const requestCollaboration = async (
  eventId: string,
  collaboratingForumId: string
): Promise<any> => {
  const response = await authenticatedApi.post(`/forums/events/${eventId}/collaborators`, {
    collaboratingForumId,
  });
  return response.data;
};

export const fetchPendingCollaborations = async (): Promise<any[]> => {
  const response = await authenticatedApi.get("/forums/collaborations/pending");
  return response.data;
};

export const respondToCollaboration = async (
  collaborationId: string,
  status: "accepted" | "rejected"
): Promise<any> => {
  const response = await authenticatedApi.put(
    `/forums/collaborations/${collaborationId}/respond`,
    { status }
  );
  return response.data;
};

export const removeCollaborator = async (
  eventId: string,
  collaboratorForumId: string
): Promise<{ message: string }> => {
  const response = await authenticatedApi.delete(
    `/forums/events/${eventId}/collaborators/${collaboratorForumId}`
  );
  return response.data;
};


/**
 * [NEW] Fetches the event activity count for a given year.
 * Calls the GET /forums/events/yearly-activity endpoint.
 */
export const fetchYearlyEventActivity = async (year: number): Promise<EventActivity[]> => {
  try {
    const response = await authenticatedApi.get(`/forums/events/yearly-activity?year=${year}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch event activity');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};


/**
 * [NEW] Fetches all events for a specific month and year.
 * Calls the GET /forums/events/by-month endpoint.
 */
export const fetchEventsByMonth = async (year: number, month: number): Promise<Event[]> => {
  try {
    const response = await authenticatedApi.get(`/forums/events/by-month?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch monthly events');
    }
    throw new Error('An unexpected network error occurred.');
  }
};


/**
 * Fetches pending forum heads for the current user's forums.
 * Calls GET /forums/heads/pending
 */
export const fetchPendingForumHeads = async (): Promise<PendingHead[]> => {
  try {
    const response = await authenticatedApi.get("/forums/heads/pending");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch pending approvals');
    }
    throw new Error('An unexpected network error occurred.');
  }
};

/**
 * Approves a pending forum head.
 * Calls POST /forums/heads/:userId/approve
 */
export const approvePendingForumHead = async (userId: string): Promise<any> => {
  try {
    const response = await authenticatedApi.post(`/forums/heads/${userId}/approve`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to approve user');
    }
    throw new Error('An unexpected network error occurred.');
  }
};

/**
 * Rejects a pending forum head.
 * Calls POST /forums/heads/:userId/reject
 */
export const rejectPendingForumHead = async (userId: string): Promise<any> => {
  try {
    const response = await authenticatedApi.post(`/forums/heads/${userId}/reject`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to reject user');
    }
    throw new Error('An unexpected network error occurred.');
  }
};