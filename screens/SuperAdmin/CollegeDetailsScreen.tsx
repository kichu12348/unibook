import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SuperAdminStackParamList } from "../../navigation/SuperAdminNavigator";
import { useTheme } from "../../hooks/useTheme";
import { useSuperAdminStore } from "../../store/superAdminStore";
import {
  College,
  CollegeAdmin,
  fetchCollegeDetails,
} from "../../api/superAdmin";
import StyledButton from "../../components/StyledButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<
  SuperAdminStackParamList,
  "CollegeDetails",
  "collegeName"
>;
type RouteProps = RouteProp<SuperAdminStackParamList, "CollegeDetails">;

const CollegeDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { collegeId } = route.params;
  const { collegeAdmins, getCollegeAdmins, isLoading } = useSuperAdminStore();

  const [college, setCollege] = useState<College | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const admins = collegeAdmins[collegeId] || [];

  useEffect(() => {
    loadCollegeData();
  }, [collegeId]);

  const loadCollegeData = async () => {
    try {
      setError(null);
      const [collegeData] = await Promise.all([
        fetchCollegeDetails(collegeId),
        getCollegeAdmins(collegeId),
      ]);

      setCollege(collegeData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load college details";
      setError(errorMessage);
      console.error("Load college details error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCollegeData();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddAdmin = () => {
    navigation.navigate("CreateCollegeAdmin", {
      collegeId,
      collegeName: college?.name,
    });
  };

  const handleEditCollege = () => {
    if (college) {
      navigation.navigate("EditCollege", { college });
    }
  };

  const handleError = () => {
    Alert.alert("Error", error || "Something went wrong", [
      { text: "Retry", onPress: loadCollegeData },
      { text: "Go Back", onPress: handleBack },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    section: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIcon: {
      marginRight: 12,
      width: 20,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      minWidth: 100,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 2,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    adminItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 8,
    },
    adminIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    adminInfo: {
      flex: 1,
    },
    adminName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 2,
    },
    adminEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    addAdminButton: {
      backgroundColor: "transparent",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
    },
    addAdminButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: "transparent",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    editButtonText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },
  });

  const insets = useSafeAreaInsets();

  if (error) {
    handleError();
    return null;
  }

  if (isLoading || !college) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>College Details</Text>
            <Text style={styles.subtitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading college details...</Text>
        </View>
      </View>
    );
  }

  const isPaid = college.hasPaid;
  const statusColor = isPaid ? "#4CAF50" : "#FF9800";
  const statusBgColor = isPaid ? "#4CAF50" + "20" : "#FF9800" + "20";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{college.name}</Text>
          <Text style={styles.subtitle}>College Details</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.background}
          />
        }
      >
        {/* College Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>College Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditCollege}
            >
              <Ionicons
                name="pencil"
                size={16}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="school-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{college.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="globe-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Domain:</Text>
            <Text style={styles.infoValue}>{college.domainName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoLabel}>Status:</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusBgColor }]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {isPaid ? "Paid" : "Unpaid"}
              </Text>
            </View>
          </View>

          {college.createdAt && (
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {formatDate(college.createdAt)}
              </Text>
            </View>
          )}
        </View>

        {/* College Administrators */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              College Administrators ({admins.length})
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addAdminButton}
            onPress={handleAddAdmin}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={theme.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addAdminButtonText}>Add New Administrator</Text>
          </TouchableOpacity>

          {admins.length > 0 ? (
            admins.map((admin) => (
              <View key={admin.id} style={styles.adminItem}>
                <View style={styles.adminIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
                <View style={styles.adminInfo}>
                  <Text style={styles.adminName}>{admin.fullName}</Text>
                  <Text style={styles.adminEmail}>{admin.email}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                No administrators assigned to this college yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CollegeDetailsScreen;
