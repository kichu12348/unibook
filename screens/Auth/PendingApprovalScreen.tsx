import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PendingApprovalScreen: React.FC = () => {
  const theme = useTheme();
  const { logout, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    iconContainer: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },
    logoutButton: {
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="time-outline" size={80} color={theme.colors.warning} />
      </View>
      <Text style={styles.title}>Approval Pending</Text>
      <Text style={styles.message}>
        Thank you for registering, {user?.fullName}. Your account as a{" "}
        {user?.role?.replace("_", " ")} is currently awaiting approval from a
        college administrator.
      </Text>
      <StyledButton
        title="Logout"
        onPress={logout}
        style={styles.logoutButton}
        variant="secondary"
      />
    </View>
  );
};

export default PendingApprovalScreen;
