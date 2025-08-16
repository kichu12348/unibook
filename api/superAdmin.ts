import axios from "axios";
import { authenticatedApi } from "./auth";
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

export interface CreateCollegeAdminData {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateCollegeData {
  name?: string;
  domainName?: string;
  hasPaid?: boolean;
}

// Fetch all colleges
export const fetchColleges = async (): Promise<College[]> => {
  try {
    const response = await authenticatedApi.get("/sa/colleges");
    return response.data;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw new Error("Failed to fetch colleges. Please try again.");
  }
};

// Create a new college
export const createCollege = async (
  data: CreateCollegeData
): Promise<College> => {
  try {
    const response = await authenticatedApi.post("/sa/colleges", data);
    return response.data;
  } catch (error) {
    console.error("Error creating college:", error);

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error || "Failed to create college.";
      throw new Error(message);
    }

    throw new Error(
      "Network error. Please check your connection and try again."
    );
  }
};

// Fetch college details by ID
export const fetchCollegeDetails = async (
  collegeId: string
): Promise<College> => {
  try {
    const response = await authenticatedApi.get(`/sa/colleges/${collegeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching college details:", error);
    throw new Error("Failed to fetch college details. Please try again.");
  }
};

// Fetch college administrators
export const fetchCollegeAdmins = async (
  collegeId: string
): Promise<CollegeAdmin[]> => {
  try {
    const response = await authenticatedApi.get(
      `/sa/colleges/${collegeId}/admins`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching college admins:", error);

    throw new Error(
      "Failed to fetch college administrators. Please try again."
    );
  }
};

// Create college administrator
export const createCollegeAdmin = async (
  collegeId: string,
  adminData: CreateCollegeAdminData
): Promise<CollegeAdmin> => {
  try {
    const response = await authenticatedApi.post(
      `/sa/colleges/${collegeId}/admins`,
      adminData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating college admin:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to create college administrator"
      );
    }

    throw new Error(
      "Failed to create college administrator. Please try again."
    );
  }
};

// Update college
export const updateCollege = async (
  collegeId: string,
  updateData: UpdateCollegeData
): Promise<College> => {
  try {
    const response = await authenticatedApi.put(
      `/sa/colleges/${collegeId}/update`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating college:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Failed to update college"
      );
    }

    throw new Error("Failed to update college. Please try again.");
  }
};
