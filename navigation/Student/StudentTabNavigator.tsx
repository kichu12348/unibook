import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StudentTabParamList } from '../types';
import CustomTabNavigator from '../../components/CustomTabNavigator';
import EventsScreen from '../../screens/Student/EventsScreen';
import ProfileScreen from '../../screens/Common/ProfileScreen';

const Tab = createBottomTabNavigator<StudentTabParamList>();

const tabs = [
  {
    name: 'Events' as const,
    label: 'Events',
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

const StudentTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabNavigator {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;