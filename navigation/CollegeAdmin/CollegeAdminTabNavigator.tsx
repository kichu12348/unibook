import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CollegeAdminTabParamList } from '../types';
import CustomTabNavigator from '../../components/CustomTabNavigator';
import DashboardScreen from '../../screens/CollegeAdmin/DashboardScreen';
import UsersScreen from '../../screens/CollegeAdmin/UsersScreen';
import ManagementStack from './ManagementStack';
import ProfileScreen from '../../screens/SuperAdmin/ProfileScreen';

const Tab = createBottomTabNavigator<CollegeAdminTabParamList>();

const tabs = [
  {
    name: 'Dashboard' as keyof CollegeAdminTabParamList,
    label: 'Dashboard',
    icon: 'grid' as const,
    iconOutline: 'grid-outline' as const,
  },
  {
    name: 'Users' as keyof CollegeAdminTabParamList,
    label: 'Users',
    icon: 'people' as const,
    iconOutline: 'people-outline' as const,
  },
  {
    name: 'ForumsAndVenues' as keyof CollegeAdminTabParamList,
    label: 'Forums',
    icon: 'chatbubbles' as const,
    iconOutline: 'chatbubbles-outline' as const,
  },
  {
    name: 'Profile' as keyof CollegeAdminTabParamList,
    label: 'Profile',
    icon: 'person' as const,
    iconOutline: 'person-outline' as const,
  },
];

const CollegeAdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => (
        <CustomTabNavigator
          {...props}
          tabs={tabs}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      <Tab.Screen 
        name="Users" 
        component={UsersScreen}
      />
      <Tab.Screen
        name="ForumsAndVenues"
        component={ManagementStack}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default CollegeAdminTabNavigator;
