import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ForumHeadTabParamList } from '../types';
import CustomTabNavigator from '../../components/CustomTabNavigator';
import ProfileScreen from '../../screens/Common/ProfileScreen';
import EventsScreen from '../../screens/ForumHead/EventsScreen';
import CalendarScreen from '../../screens/ForumHead/CalendarScreen';
import PeerApprovalsScreen from '../../screens/ForumHead/PeerApprovalsScreen';

const Tab = createBottomTabNavigator<ForumHeadTabParamList>();

const tabs = [
  {
    name: 'Events' as const,
    label: 'Events',
    icon: 'calendar' as const,
    iconOutline: 'calendar-outline' as const,
  },
  {
    name: 'Calendar' as const,
    label: 'Calendar',
    icon: 'calendar-number' as const,
    iconOutline: 'calendar-number-outline' as const,
  },
  {
    name: 'PeerApprovals' as const,
    label: 'Approvals',
    icon: 'people' as const,
    iconOutline: 'people-outline' as const,
  },
  {
    name: 'Profile' as const,
    label: 'Profile',
    icon: 'person' as const,
    iconOutline: 'person-outline' as const,
  },
];

const ForumHeadTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <CustomTabNavigator {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="PeerApprovals" component={PeerApprovalsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ForumHeadTabNavigator;