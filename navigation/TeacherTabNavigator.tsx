import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TeacherTabParamList } from './types';
import CustomTabNavigator from '../components/CustomTabNavigator';
import PendingRequestsScreen from '../screens/Teacher/PendingRequestsScreen';
import ScheduleScreen from '../screens/Teacher/ScheduleScreen';
import ProfileScreen from '../screens/SuperAdmin/ProfileScreen';

const Tab = createBottomTabNavigator<TeacherTabParamList>();

const tabs = [
  {
    name: 'PendingRequests' as const,
    label: 'Requests',
    icon: 'mail' as const,
    iconOutline: 'mail-outline' as const,
  },
  {
    name: 'Schedule' as const,
    label: 'Schedule',
    icon: 'calendar' as const,
    iconOutline: 'calendar-outline' as const,
  },
  {
    name: 'Profile' as const,
    label: 'Profile',
    icon: 'person' as const,
    iconOutline: 'person-outline' as const,
  },
];

const TeacherTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabNavigator {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="PendingRequests" component={PendingRequestsScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TeacherTabNavigator;