import axios from "axios";
import { authenticatedApi } from "./auth";
import { ImageContentFit } from "expo-image";

// --- Interfaces ---
export interface PendingRequest {
  id: string;
  assignmentRole: string;
  status: "pending";
  createdAt: string;
  event: {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    organizer: {
      fullName: string;
    };
    venue: {
      name: string;
      locationDetails: string;
    } | null;
  };
}

export interface AcceptedEvent {
  id: string;
  assignmentId: string;
  name: string;
  startTime: string;
  endTime: string;
  myAssignmentRole: string;
  venue: {
    name: string;
    locationDetails: string;
  } | null;
  organizer: {
    fullName: string;
  };
}

export interface Assignment {
  id: string;
  assignmentRole: string;
  status: "pending" | "approved" | "rejected";
  event: {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    bannerImage?: string;
    organizer: {
      fullName: string;
    };
    resizeMode: ImageContentFit;
    venue: {
      name: string;
      locationDetails: string;
    } | null;
    forum: { name: string; id: string };
  };
}

/**
 * Fetches all pending event staff requests for the current teacher.
 * Calls GET /teachers/requests/pending
 */
export const fetchPendingRequests = async (): Promise<PendingRequest[]> => {
  try {
    const response = await authenticatedApi.get("/teachers/requests/pending");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch pending requests"
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Accepts a pending event staff request.
 * Calls POST /teachers/requests/:assignmentId/accept
 */
export const acceptRequest = async (
  assignmentId: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.post(
      `/teachers/requests/${assignmentId}/accept`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to accept request");
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Rejects a pending event staff request.
 * Calls POST /teachers/requests/:assignmentId/reject
 */
export const rejectRequest = async (
  assignmentId: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.post(
      `/teachers/requests/${assignmentId}/reject`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to reject request");
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Fetches all accepted event assignments for the current teacher.
 * Calls GET /teachers/events/accepted
 */
export const fetchAcceptedEvents = async (): Promise<AcceptedEvent[]> => {
  try {
    const response = await authenticatedApi.get("/teachers/events/accepted");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch accepted events"
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Cancels an accepted event assignment.
 * Calls POST /teachers/requests/:assignmentId/cancel
 */
export const cancelAssignment = async (
  assignmentId: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedApi.post(
      `/teachers/requests/${assignmentId}/cancel`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to cancel assignment"
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
};

/**
 * Fetches the details of a single event assignment.
 * Calls GET /teachers/requests/:assignmentId
 */
export const fetchAssignmentDetails = async (
  assignmentId: string
): Promise<Assignment> => {
  try {
    const response = await authenticatedApi.get(
      `/teachers/requests/${assignmentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch assignment details"
      );
    }
    throw new Error("An unexpected network error occurred.");
  }
};
