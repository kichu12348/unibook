import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuperAdminTabNavigator from './SuperAdminTabNavigator';
import CreateCollegeScreen from '../../screens/SuperAdmin/CreateCollegeScreen';
import CollegeDetailsScreen from '../../screens/SuperAdmin/CollegeDetailsScreen';
import CreateCollegeAdminScreen from '../../screens/SuperAdmin/CreateCollegeAdminScreen';
import EditCollegeScreen from '../../screens/SuperAdmin/EditCollegeScreen';
import { College } from '../../api/superAdmin';

export type SuperAdminStackParamList = {
  SuperAdminTabs: undefined;
  CreateCollege: undefined;
  CollegeDetails: { collegeId: string };
  CreateCollegeAdmin: { collegeId: string , collegeName?: string };
  EditCollege: { college: College };
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
      <Stack.Screen name="CreateCollegeAdmin" component={CreateCollegeAdminScreen} />
      <Stack.Screen name="EditCollege" component={EditCollegeScreen} />
    </Stack.Navigator>
  );
};

export default SuperAdminNavigator;
