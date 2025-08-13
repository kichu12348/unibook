import { EventDetails } from "../api/forum";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: { email: string };
};

export type SuperAdminTabParamList = {
  Colleges: undefined;
  Profile: undefined;
};

export type CollegeAdminTabParamList = {
  Dashboard: undefined;
  Users: { filter?: "pending" | "all" } | undefined;
  Profile: undefined;
  ForumsAndVenues: { screen?: string } | undefined;
};

export interface EventFormData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId?: string;
  registrationLink?: string;
  bannerImage?: string;
  resizeMode?: string;
  forumId: string;
}

export type ForumHeadTabParamList = {
  Events: undefined;
  Calendar: undefined;
  PeerApprovals: undefined;
  Profile: undefined;
  CreateEvent: undefined;
  CreateEventPreview: { eventData: EventFormData };
  ForumHeadTabs: undefined;
  EventDetails: { eventId: string };
  EditEvent: { event: EventDetails };
  ManageStaff: { eventId: string; eventName: string };
};

export type RootStackParamList = {
  Auth: undefined;
  SuperAdmin: undefined;
  CollegeAdmin: undefined;
  ForumHead: undefined;
};