import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../hooks/useTheme";
import AuthNavigator from "./AuthNavigator";
import SuperAdminNavigator from "./SuperAdminNavigator";
import CollegeAdminNavigator from "./CollegeAdminNavigator";

const AppNavigator: React.FC = () => {
  const { isAuthenticated, appIsReady, user } = useAuthStore();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (user && user.role === "super_admin") {
    return <SuperAdminNavigator />;
  }

  if (user && user.role === "college_admin") {
    return <CollegeAdminNavigator />;
  }

  // Default fallback - should not reach here with proper authentication
  return <AuthNavigator />;
};

export default AppNavigator;
