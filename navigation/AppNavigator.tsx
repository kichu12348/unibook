import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../hooks/useTheme";
import AuthNavigator from "./Auth/AuthNavigator";
import SuperAdminNavigator from "./SuperAdmin/SuperAdminNavigator";
import CollegeAdminNavigator from "./CollegeAdmin/CollegeAdminNavigator";
import ForumHeadNavigator from "./ForumHead/ForumHeadNavigator";
import TeacherNavigator from "./Teacher/TeacherNavigator";
import StudentNavigator from "./Student/StudentNavigator";
import PendingApprovalScreen from "../screens/Auth/PendingApprovalScreen";

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  
  if (user) {
    const isApproved = user.approvalStatus === 'approved';
    const role = user.role;

    if (role === 'teacher' || role === 'forum_head') {
      if (!isApproved) {
        return <PendingApprovalScreen />;
      }
    }
    switch (role) {
      case "super_admin":
        return <SuperAdminNavigator />;
      case "college_admin":
        return <CollegeAdminNavigator />;
      case "forum_head":
        return <ForumHeadNavigator />;
      case "teacher":
        return <TeacherNavigator />;
      case "student":
        return <StudentNavigator />;
      default:
        return <AuthNavigator />;
    }
  }

  //fallback
  return <AuthNavigator />;
};

export default AppNavigator;
