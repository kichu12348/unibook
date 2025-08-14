import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CollegeAdminTabParamList } from "../../navigation/types";
import { useTheme } from "../../hooks/useTheme";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { useAuthStore } from "../../store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledButton from "../../components/StyledButton";
import Footer from "../../components/CommonFooter";

type NavigationProp = BottomTabNavigationProp<
  CollegeAdminTabParamList,
  "Dashboard"
>;

const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const {
    users,
    pendingApprovalCount,
    isLoading,
    error,
    getUsers,
    clearError,
  } = useCollegeAdminStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  const loadDashboardData = async () => {
    await getUsers();
  };

  const handlePendingApprovalsPress = () => {
    navigation.navigate("Users", { filter: "pending" });
  };

  const handleCreateForum = () => {
    navigation.navigate("ForumsAndVenues", { screen: "CreateForum" });
  };

  const handleCreateVenue = () => {
    navigation.navigate("ForumsAndVenues", { screen: "CreateVenue" });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 24,
    },
    list: {
      flex: 1,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    metricsGrid: {
      flexDirection: "row",
      marginHorizontal: -8,
    },
    metricCard: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
      marginHorizontal: 8,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    metricCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    metricIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    metricTitle: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: theme.colors.text,
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
      color: theme.colors.success,
    },
    metricSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    quickActionsGrid: {
      flexDirection: "row",
      marginHorizontal: -8,
    },
    quickActionButton: {
      flex: 1,
      marginHorizontal: 8,
    },
    arrowContainer: {
      opacity: 0.6,
    },
  });
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back, {user?.fullName || "Admin"}! Manage your college
          efficiently.
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDashboardData}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.background}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        <View style={styles.metricsGrid}>
          {/* Pending Approvals Card */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={handlePendingApprovalsPress}
            activeOpacity={0.7}
          >
            <View style={styles.metricCardHeader}>
              <View
                style={[
                  styles.metricIconContainer,
                  { backgroundColor: theme.colors.warning + "20" },
                ]}
              >
                <MaterialIcons
                  name="pending-actions"
                  size={24}
                  color={theme.colors.warning}
                />
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.arrowContainer}
              />
            </View>

            <Text style={styles.metricTitle}>Pending Approvals</Text>
            <Text style={[styles.metricValue, { color: theme.colors.warning }]}>
              {pendingApprovalCount.toString()}
            </Text>
            <Text style={styles.metricSubtitle}>Users Awaiting Approval</Text>
          </TouchableOpacity>

          {/* Total Users Card */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("Users")}
            activeOpacity={0.7}
          >
            <View style={styles.metricCardHeader}>
              <View
                style={[
                  styles.metricIconContainer,
                  { backgroundColor: theme.colors.success + "20" },
                ]}
              >
                <MaterialIcons
                  name="group"
                  size={24}
                  color={theme.colors.success}
                />
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.arrowContainer}
              />
            </View>

            <Text style={styles.metricTitle}>Total Users</Text>
            <Text style={styles.metricValue}>{users.length.toString()}</Text>
            <Text style={styles.metricSubtitle}>Teachers & Forum Heads</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        {/* <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActionsGrid}>
          <StyledButton
            title="Create Forum"
            onPress={handleCreateForum}
            style={[styles.quickActionButton, { borderStyle: "dashed" }]}
            variant="secondary"
          />

          <StyledButton
            title="Create Venue"
            onPress={handleCreateVenue}
            style={styles.quickActionButton}
            variant="secondary"
          />
        </View> */}
        <Footer />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
