import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import StyledButton from "../../components/StyledButton";
import ThemeSwitch from "../../components/ThemeSwitch";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Footer from "../../components/CommonFooter";

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const initializeTheme = useThemeStore((s) => s.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "rejected":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.background,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    profileItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileItemLast: {
      borderBottomWidth: 0,
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    logoutButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderRadius: 12,
      borderColor: theme.colors.error,
      marginTop: 16,
    },
    logoutButtonText: {
      color: theme.colors.error,
      fontWeight: "bold",
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.content}>
          {/* Header with Avatar */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={styles.userName}>
              {user?.fullName || "Unknown User"}
            </Text>
            <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <View style={styles.card}>
              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>{user?.fullName || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <Ionicons
                    name="mail"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Email Address</Text>
                  <Text style={styles.value}>{user?.email || "N/A"}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.profileItem,
                  !user?.approvalStatus && styles.profileItemLast,
                ]}
              >
                <View style={styles.profileIcon}>
                  <Ionicons
                    name="briefcase"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Role</Text>
                  <Text style={styles.value}>
                    {getRoleDisplayName(user?.role || "N/A")}
                  </Text>
                </View>
              </View>

              {user?.approvalStatus && (
                <View style={[styles.profileItem, styles.profileItemLast]}>
                  <View style={styles.profileIcon}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.label}>Account Status</Text>
                    <Text
                      style={[
                        styles.statusValue,
                        { color: getStatusColor(user.approvalStatus) },
                      ]}
                    >
                      {user.approvalStatus}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.card}>
              <ThemeSwitch />
            </View>
          </View>

          {/* Logout Button */}
          <StyledButton
            title="Sign Out"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyles={styles.logoutButtonText}
          />
        </View>
        <Footer marginTop={20}/>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
