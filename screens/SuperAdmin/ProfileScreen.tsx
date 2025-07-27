import React, { use } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import StyledButton from "../../components/StyledButton";

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 100,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 32,
    },
    profileCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    profileItem: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: theme.colors.text,
    },
    logoutButton: {
      borderWidth: 2,
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.background,
    },
    logoutButtonText: {
      color: theme.colors.error,
      fontWeight: "bold",
    },
  });

  console.log(user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{user?.fullName || "N/A"}</Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || "N/A"}</Text>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>
              {user?.role.replace("_", " ") || "N/A"}
            </Text>
          </View>
          {user.approvalStatus && (
            <View style={styles.profileItem}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{user?.approvalStatus || "N/A"}</Text>
            </View>
          )}
        </View>

        <StyledButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyles={styles.logoutButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
