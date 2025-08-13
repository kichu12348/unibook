import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeacherStackParamList } from "../../navigation/TeacherNavigator";
import { useTeacherStore } from "../../store/teacherStore";
import { fetchAssignmentDetails, Assignment } from "../../api/teacher";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;
type RouteProps = RouteProp<TeacherStackParamList, "EventDetails">;

const EventDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assignmentId, eventName } = route.params;

  const { acceptRequest, rejectRequest, cancelAssignment, isSubmitting } =
    useTeacherStore();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAssignmentDetails(assignmentId);
      setAssignment(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error Loading Details", message, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId, navigation]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Actions
  const handleAccept = async () => {
    const success = await acceptRequest(assignmentId);
    if (success) navigation.goBack();
  };
  const handleReject = async () => {
    const success = await rejectRequest(assignmentId);
    if (success) navigation.goBack();
  };
  const handleCancel = async () => {
    const success = await cancelAssignment(assignmentId);
    if (success) navigation.goBack();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Styles (can be memoized or moved outside if preferred)
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    header: {
      position: "absolute",
      top: insets.top,
      left: 16 + insets.left,
      zIndex: 10,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      alignItems: "center",
      padding: 2,
      justifyContent: "center",
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: { paddingBottom: 120 },
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
      marginTop: -60,
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
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      padding: 24,
    },
  });

  if (isLoading || !assignment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>
          Loading event details...
        </Text>
      </View>
    );
  }

  const isPending = assignment.status === "pending";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadDetails} />
        }
      >
        <View style={styles.bannerContainer}>
          {assignment.event.bannerImage && (
            <Image
              source={{ uri: assignment.event.bannerImage }}
              style={styles.bannerImage}
              contentFit={assignment.event.resizeMode || "cover"}
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
        <Text style={styles.eventName}>{assignment.event.name}</Text>
        <View style={styles.detailsSection}>
          {/* Detail Rows */}
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
                {formatDate(assignment.event.startTime)}
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
                {formatDate(assignment.event.endTime)}
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
                {assignment.event.venue?.name || "Not specified"}
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
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Organizer</Text>
              <Text style={styles.detailValue}>
                {assignment.event.forum.name}
              </Text>
            </View>
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
              <Text style={styles.detailLabel}>About</Text>
              <Text style={[styles.detailValue, { lineHeight: 24 }]}>
                {assignment.event.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {isPending ? (
          <>
            <StyledButton
              title="Reject"
              variant="secondary"
              style={{
                flex: 1,
                marginRight: 8,
                borderColor: theme.colors.error,
              }}
              textStyles={{ color: theme.colors.error }}
              onPress={handleReject}
              disabled={isSubmitting}
            />
            <StyledButton
              title="Accept"
              style={{ flex: 1, marginLeft: 8 }}
              onPress={handleAccept}
              loading={isSubmitting}
            />
          </>
        ) : (
          <StyledButton
            title="Cancel Assignment"
            variant="secondary"
            style={{
              flex: 1,
              borderColor: theme.colors.error,
              borderStyle: "dashed",
            }}
            textStyles={{ color: theme.colors.error }}
            onPress={handleCancel}
            loading={isSubmitting}
          />
        )}
      </View>
    </View>
  );
};

export default EventDetailsScreen;
