// navigation/TeacherNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherTabNavigator from './TeacherTabNavigator';
import EventDetailsScreen from '../screens/Teacher/EventDetailsScreen';
import { TeacherStackParamList } from './types'; 


const Stack = createNativeStackNavigator<TeacherStackParamList>();

const TeacherNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="TeacherTabs"
    >
      <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;