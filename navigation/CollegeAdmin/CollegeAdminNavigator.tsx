import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CollegeAdminTabNavigator from './CollegeAdminTabNavigator';
import { CollegeAdminTabParamList } from '../types';

export type CollegeAdminStackParamList = {
  CollegeAdminTabs: undefined;
  // Add future stack screens here like CreateUser, EditUser, etc.
};

const Stack = createNativeStackNavigator<CollegeAdminStackParamList>();

const CollegeAdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="CollegeAdminTabs"
    >
      <Stack.Screen name="CollegeAdminTabs" component={CollegeAdminTabNavigator} />
    </Stack.Navigator>
  );
};

export default CollegeAdminNavigator;
