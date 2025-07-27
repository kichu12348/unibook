import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuperAdminTabNavigator from './SuperAdminTabNavigator';
import CreateCollegeScreen from '../screens/SuperAdmin/CreateCollegeScreen';
import CollegeDetailsScreen from '../screens/SuperAdmin/CollegeDetailsScreen';

export type SuperAdminStackParamList = {
  SuperAdminTabs: undefined;
  CreateCollege: undefined;
  CollegeDetails: { collegeId: string };
};

const Stack = createNativeStackNavigator<SuperAdminStackParamList>();

const SuperAdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SuperAdminTabs"
    >
      <Stack.Screen name="SuperAdminTabs" component={SuperAdminTabNavigator} />
      <Stack.Screen name="CreateCollege" component={CreateCollegeScreen} />
      <Stack.Screen name="CollegeDetails" component={CollegeDetailsScreen} />
    </Stack.Navigator>
  );
};

export default SuperAdminNavigator;
