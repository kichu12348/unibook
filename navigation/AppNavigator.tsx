import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import AuthNavigator from './AuthNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, appIsReady } = useAuthStore();
  const theme = useTheme();

  if (!appIsReady) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return isAuthenticated ? <SuperAdminNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
