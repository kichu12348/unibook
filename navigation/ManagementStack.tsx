import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForumsAndVenuesScreen from "../screens/CollegeAdmin/ForumsAndVenuesScreen";
import CreateForumScreen from "../screens/CollegeAdmin/CreateForumScreen";
import CreateVenueScreen from "../screens/CollegeAdmin/CreateVenueScreen";
import ForumDetailsScreen from "../screens/CollegeAdmin/ForumDetailsScreen";
import EditForumScreen from "../screens/CollegeAdmin/EditForumScreen";
import VenueDetailsScreen from "../screens/CollegeAdmin/VenueDetailsScreen";
import EditVenueScreen from "../screens/CollegeAdmin/EditVenueScreen";
import { Forum, Venue } from "../api/collegeAdmin";

export type ManagementStackParamList = {
  Main: undefined;
  CreateForum: undefined;
  CreateVenue: undefined;
  EditForum: { forum: Forum };
  ForumDetails: { forumId: string };
  VenueDetails: { venueId: string };
  EditVenue: { venue: Venue };
};

const Stack = createNativeStackNavigator();

const ManagementStack: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={ForumsAndVenuesScreen} />
      <Stack.Screen name="CreateForum" component={CreateForumScreen} />
      <Stack.Screen name="CreateVenue" component={CreateVenueScreen} />
      <Stack.Screen name="ForumDetails" component={ForumDetailsScreen} />
      <Stack.Screen name="EditForum" component={EditForumScreen} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreen} />
      <Stack.Screen name="EditVenue" component={EditVenueScreen} />
    </Stack.Navigator>
  );
};

export default ManagementStack;
