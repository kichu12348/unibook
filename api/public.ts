import axios from "axios";
import { authenticatedApi, publicApi as api } from "./auth";

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

export const fetchColleges = async (): Promise<College[]> => {
  try {
    let response;
    try {
      response = await api.get("/public/colleges");
    } catch (error) {
      response = await api.get("/sa/colleges");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw new Error("Failed to fetch colleges. Please try again.");
  }
};

// Fetch forums for a specific college
export const fetchForumsByCollege = async (
  collegeId: string
): Promise<Forum[]> => {
  try {
    const response = await api.get(`/public/forums/${collegeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forums:", error);
    throw new Error("Failed to fetch forums. Please try again.");
  }
};

// Registration data interface
export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  collegeId: string;
  role: "student" | "teacher" | "forum_head";
  forumId?: string;
}

export interface ForumSearchResult {
  id: string;
  name: string;
  college: {
    name: string;
  };
}

// Register user
export const registerUser = async (
  formData: RegisterFormData
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      throw new Error(message);
    }
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  }
};

export const searchAllForums = async (
  searchTerm: string,
  organizingForumId: string
): Promise<ForumSearchResult[]> => {
  const response = await authenticatedApi.get(
    `/public/forums/search?search=${encodeURIComponent(
      searchTerm
    )}&organizingForumId=${organizingForumId}`
  );
  return response.data;
};

export default api;
