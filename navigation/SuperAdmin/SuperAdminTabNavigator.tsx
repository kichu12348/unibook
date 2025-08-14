import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SuperAdminTabParamList } from '../types';
import CustomTabNavigator from '../../components/CustomTabNavigator';
import CollegeListTabScreen from '../../screens/SuperAdmin/CollegeListTabScreen';
import ProfileScreen from '../../screens/SuperAdmin/ProfileScreen';

const Tab = createBottomTabNavigator<SuperAdminTabParamList>();

const tabs = [
  {
    name: 'Colleges' as keyof SuperAdminTabParamList,
    label: 'Colleges',
    icon: 'school' as const,
    iconOutline: 'school-outline' as const,
  },
  {
    name: 'Profile' as keyof SuperAdminTabParamList,
    label: 'Profile',
    icon: 'person' as const,
    iconOutline: 'person-outline' as const,
  },
];

const SuperAdminTabNavigator: React.FC = () => {
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
        name="Colleges" 
        component={CollegeListTabScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default SuperAdminTabNavigator;
