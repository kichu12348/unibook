import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create authenticated axios instance for College Admin
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

// User interfaces
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "teacher" | "forum_head" | "student";
  approvalStatus: "pending" | "approved" | "rejected";
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

export interface UpdateForumData {
  name?: string;
  description?: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  locationDetails?: string;
}

export interface CreateVenueData {
  name: string;
  capacity: number;
  locationDetails?: string;
}

export interface UpdateVenueData {
  name?: string;
  capacity?: number;
  locationDetails?: string;
}

// Fetch all users in the admin's college
export const fetchUsers = async (searchTerm?: string): Promise<User[]> => {
  try {
    const api = await createAuthenticatedApi();
    const endpoint = searchTerm
      ? `/admin/users/search?search=${encodeURIComponent(searchTerm)}`
      : '/admin/users';

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users');
    }
    throw new Error('Failed to fetch users. Please try again.');
  }
};

// Fetch all forums in the admin's college
export const fetchForums = async (
  searchTerm?: string
): Promise<{ id: string; name: string; description: string }[]> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(
      searchTerm
        ? `/admin/forums?search=${encodeURIComponent(searchTerm)}`
        : "/admin/forums"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching forums:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to fetch forums");
    }
    throw new Error("Failed to fetch forums. Please try again.");
  }
};

// Fetch details of a specific forum
export const fetchForumDetails = async (forumId: string): Promise<Forum> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/admin/forums/${forumId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forum details:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to fetch forum details"
      );
    }
    throw new Error("Failed to fetch forum details. Please try again.");
  }
};

// Create a new forum
export const createForum = async (
  forumData: CreateForumData
): Promise<Forum> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post("/admin/forums", forumData);
    return response.data;
  } catch (error) {
    console.error("Error creating forum:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to create forum");
    }
    throw new Error("Failed to create forum. Please try again.");
  }
};

// Approve a user
export const approveUser = async (userId: string): Promise<User> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.put(`/admin/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to approve user");
    }
    throw new Error("Failed to approve user. Please try again.");
  }
};

// Reject a user
export const rejectUser = async (userId: string): Promise<User> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.put(`/admin/users/${userId}/reject`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to reject user");
    }
    throw new Error("Failed to reject user. Please try again.");
  }
};

// Delete a user
export const deleteUser = async (
  userId: string
): Promise<{ message: string }> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to delete user");
    }
    throw new Error("Failed to delete user. Please try again.");
  }
};

export const updateForum = async (
  forumId: string,
  data: UpdateForumData
): Promise<Forum> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.put(`/admin/forums/${forumId}/update`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to update forum");
    }
    throw new Error("Failed to update forum. Please try again.");
  }
};

export const fetchVenues = async (searchTerm?: string): Promise<Venue[]> => {
  try {
    const api = await createAuthenticatedApi();
    const endpoint = searchTerm
      ? `/admin/venues?search=${encodeURIComponent(searchTerm)}`
      : "/admin/venues";

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch venues");
    }
    throw new Error("Failed to fetch venues. Please try again.");
  }
};

// Create a new venue
export const createVenue = async (
  venueData: CreateVenueData
): Promise<Venue> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.post("/admin/venues", venueData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to create venue");
    }
    throw new Error("Failed to create venue. Please try again.");
  }
};

export const fetchVenueDetails = async (venueId: string): Promise<Venue> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.get(`/admin/venues/${venueId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch venue details"
      );
    }
    throw new Error("Failed to fetch venue details. Please try again.");
  }
};

export const updateVenue = async (
  venueId: string,
  data: UpdateVenueData
): Promise<Venue> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.put(`/admin/venues/${venueId}/update`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to update venue");
    }
    throw new Error("Failed to update venue. Please try again.");
  }
};

// Delete a forum
export const deleteForum = async (forumId: string): Promise<{ message: string }> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.delete(`/admin/forums/${forumId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete forum');
    }
    throw new Error('Failed to delete forum. Please try again.');
  }
};

// Delete a venue
export const deleteVenue = async (venueId: string): Promise<{ message: string }> => {
  try {
    const api = await createAuthenticatedApi();
    const response = await api.delete(`/admin/venues/${venueId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete venue');
    }
    throw new Error('Failed to delete venue. Please try again.');
  }
};

export default createAuthenticatedApi;
