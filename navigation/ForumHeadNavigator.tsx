import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForumHeadTabNavigator from './ForumHeadTabNavigator';
// Import the new screens
import CreateEventScreen from '../screens/ForumHead/CreateEventScreen';
import CreateEventPreviewScreen from '../screens/ForumHead/CreateEventPreviewScreen';
import EventDetailsScreen from '../screens/ForumHead/EventDetailsScreen';
import EditEventScreen from '../screens/ForumHead/EditEventScreen';
import ManageStaffScreen from '../screens/ForumHead/ManageStaffScreen';
import { ForumHeadTabParamList } from './types';

export type ForumHeadStackParamList = ForumHeadTabParamList;

const Stack = createNativeStackNavigator<ForumHeadStackParamList>();

const ForumHeadNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="ForumHeadTabs"
    >
      <Stack.Screen name="ForumHeadTabs" component={ForumHeadTabNavigator} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="CreateEventPreview" component={CreateEventPreviewScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} /> 
      <Stack.Screen name="EditEvent" component={EditEventScreen} /> 
      <Stack.Screen name="ManageStaff" component={ManageStaffScreen} /> 
    </Stack.Navigator>
  );
};

export default ForumHeadNavigator;