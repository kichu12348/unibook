import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForumsAndVenuesScreen from '../screens/CollegeAdmin/ForumsAndVenuesScreen';
import CreateForumScreen from '../screens/CollegeAdmin/CreateForumScreen';
import CreateVenueScreen from '../screens/CollegeAdmin/CreateVenueScreen';
import ForumDetailsScreen from '../screens/CollegeAdmin/ForumDetailsScreen';

export type ManagementStackParamList = {
  Main: undefined;
  CreateForum: undefined;
  CreateVenue: undefined;
  ForumDetails: { forumId: string };
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
      <Stack.Screen
        name="Main"
        component={ForumsAndVenuesScreen}
      />
      <Stack.Screen
        name="CreateForum"
        component={CreateForumScreen}
      />
      <Stack.Screen
        name="CreateVenue"
        component={CreateVenueScreen}
      />
      <Stack.Screen
        name="ForumDetails"
        component={ForumDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default ManagementStack;
