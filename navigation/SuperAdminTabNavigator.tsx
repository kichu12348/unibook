import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SuperAdminTabParamList } from './types';
import CustomTabNavigator from '../components/CustomTabNavigator';
import CollegeListTabScreen from '../screens/SuperAdmin/CollegeListTabScreen';
import ProfileScreen from '../screens/SuperAdmin/ProfileScreen';

const tabs = [
  {
    name: 'Colleges',
    label: 'Colleges',
    icon: 'school' as const,
    iconOutline: 'school-outline' as const,
  },
  {
    name: 'Profile',
    label: 'Profile',
    icon: 'person' as const,
    iconOutline: 'person-outline' as const,
  },
];

const SuperAdminTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Colleges');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Colleges':
        return <CollegeListTabScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <CollegeListTabScreen />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      <CustomTabNavigator
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
};

export default SuperAdminTabNavigator;
