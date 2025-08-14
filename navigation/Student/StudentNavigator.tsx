import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabNavigator from './StudentTabNavigator';
import EventDetailsScreen from '../../screens/Student/EventDetailsScreen';
import { StudentTabParamList } from '../types';

export type StudentStackParamList = StudentTabParamList & {
  StudentTabs: undefined;
};

const Stack = createNativeStackNavigator<StudentStackParamList>();

const StudentNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StudentTabs"
    >
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

export default StudentNavigator;