import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHead/ForumHeadNavigator";
import { EventDetails, fetchEventDetails, StaffMember } from "../../api/forum";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StyledButton from "../../components/StyledButton";
import { Image, ImageContentFit } from "expo-image";
import { useForumHeadStore } from "../../store/forumHeadStore";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;
type RouteProps = RouteProp<ForumHeadStackParamList, "EventDetails">;

const EventDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;

  const removeStaff = useForumHeadStore((state) => state.removeStaff);
  const removeCollaborator = useForumHeadStore(
    (state) => state.removeCollaborator
  );

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRemoveStaff = (staffMember: StaffMember) => {
    Alert.alert(
      "Remove Staff",
      `Are you sure you want to remove ${staffMember.fullName} from this event?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeStaff(eventId, staffMember.id);
            if (success && event) {
              // For immediate UI feedback, update the local state
              setEvent({
                ...event,
                staff: event.staff.filter((s) => s.id !== staffMember.id),
              });
            }
          },
        },
      ]
    );
  };

  const handleRemoveCollaborator = (forum: any) => {
    Alert.alert(
      "Remove Collaborator",
      `Are you sure you want to remove ${forum.name}?`,
      [
        { text: "Cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeCollaborator(eventId, forum.id);
            if (success) loadEventDetails();
          },
        },
      ]
    );
  };

  const loadEventDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchEventDetails(eventId);
      setEvent(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", message, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, navigation]);

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      alignItems: "center",
    },
    header: {
      position: "absolute",
      top: insets.top,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      zIndex: 10,
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: { paddingBottom: 100 },
    bannerContainer: {
      width: "100%",
      height: 300,
      backgroundColor: theme.colors.surface,
    },
    bannerImage: { width: "100%", height: "100%" },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "60%",
    },
    eventName: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      paddingHorizontal: 24,
      marginTop: -60, // Pulls the title up over the gradient
      marginBottom: 24,
    },
    detailsSection: { paddingHorizontal: 24 },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    iconContainer: { width: 30, alignItems: "center", paddingTop: 2 },
    detailTextContainer: { flex: 1, marginLeft: 16 },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: { fontSize: 16, color: theme.colors.text, fontWeight: "500" },
    staffCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    staffInfo: { marginLeft: 12 },
    staffName: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    staffRole: { fontSize: 14, color: theme.colors.textSecondary },
    registerButton: {
      marginTop: 24,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
      borderWidth: 1.5,
      borderRadius: 8,
      borderStyle: "dashed",
      alignItems: "center",
    },
    registerButtonText: {
      color: theme.colors.primary,
    },
    staffSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    staffAddButton: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1.5,
      borderRadius: 8,
      borderStyle: "dashed",
    },
    staffAddButtonText: {
      color: theme.colors.primary,
    },
    removeButton: {
      padding: 8,
      borderWidth: 1,
      borderColor: theme.colors.error,
      borderRadius: 8,
      borderStyle: "dashed",
    },
  });

  const getColorBasedOnStatus = (status: string) => {
    switch (status) {
      case "pending":
        return theme.colors.warning;
      case "approved":
        return theme.colors.success;
      case "rejected":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            navigation.navigate("EditEvent", { event });
          }}
        >
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadEventDetails}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
      >
        <View style={styles.bannerContainer}>
          {event.bannerImage && (
            <Image
              source={{ uri: event.bannerImage }}
              style={styles.bannerImage}
              contentFit={(event.resizeMode as ImageContentFit) || "cover"}
              cachePolicy="memory-disk"
            />
          )}
          <LinearGradient
            colors={[
              "transparent",
              `${theme.colors.background}99`,
              theme.colors.background,
            ]}
            style={styles.gradient}
          />
        </View>
        <Text style={styles.eventName}>{event.name}</Text>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="time-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Start Time</Text>
              <Text style={styles.detailValue}>
                {formatDate(event.startTime)}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="flag-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>End Time</Text>
              <Text style={styles.detailValue}>
                {formatDate(event.endTime)}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>
                {event.venue?.name || "Not specified"}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            {event.forum?.name && (
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Organizer</Text>
                <Text style={styles.detailValue}>{event.forum.name}</Text>
              </View>
            )}
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>About this Event</Text>
              <Text style={[styles.detailValue, { lineHeight: 24 }]}>
                {event.description}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <View style={styles.staffSectionHeader}>
              <Text style={styles.sectionTitle}>
                Event Staff ({event.staff.length})
              </Text>
              <StyledButton
                title="Add Staff"
                size="small"
                onPress={() =>
                  navigation.navigate("ManageStaff", {
                    eventId: event.id,
                    eventName: event.name,
                  })
                }
                style={styles.staffAddButton}
                variant="secondary"
              />
            </View>
            {event.staff.length > 0 ? (
              event.staff.map((staff) => (
                <View key={staff.id} style={styles.staffCard}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="person-circle-outline"
                      size={40}
                      color={theme.colors.primary}
                    />
                    <View style={styles.staffInfo}>
                      <Text style={styles.staffName}>{staff.fullName}</Text>
                      <Text style={styles.staffRole}>
                        {staff.assignmentRole}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "column", gap: 4 }}>
                    <Text style={styles.staffName}>Status</Text>
                    <Text
                      style={[
                        styles.staffRole,
                        {
                          color: getColorBasedOnStatus(staff.status),
                        },
                      ]}
                    >
                      {staff.status}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveStaff(staff)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.detailValue}>No staff assigned yet.</Text>
            )}
          </View>

          <View style={{ marginTop: 16 }}>
            <View style={styles.staffSectionHeader}>
              <Text style={styles.sectionTitle}>
                Collaborators ({event.collaboratingForums.length})
              </Text>
              <StyledButton
                title="Add Collaborator"
                size="small"
                onPress={() =>
                  navigation.navigate("ManageCollaborators", {
                    eventId: event.id,
                    eventName: event.name,
                  })
                }
                style={styles.staffAddButton}
                variant="secondary"
              />
            </View>
            {event.collaboratingForums.length > 0 ? (
              event.collaboratingForums.map((forum) => (
                <View key={forum.id} style={styles.staffCard}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="business-outline"
                      size={40}
                      color={theme.colors.primary}
                    />
                    <View style={styles.staffInfo}>
                      <Text style={styles.staffName}>{forum.name}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveCollaborator(forum)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.detailValue}>No collaborators yet.</Text>
            )}
          </View>

          {event.registrationLink && (
            <StyledButton
              title="Register for Event"
              onPress={() => Linking.openURL(event.registrationLink)}
              style={styles.registerButton}
              textStyles={styles.registerButtonText}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EventDetailsScreen;
