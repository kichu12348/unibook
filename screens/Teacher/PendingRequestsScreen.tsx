import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTeacherStore } from "../../store/teacherStore";
import { PendingRequest } from "../../api/teacher";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TeacherStackParamList } from "../../navigation/Teacher/TeacherNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const PendingRequestsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { pendingRequests, isLoading, isSubmitting, getPendingRequests } =
    useTeacherStore();

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    getPendingRequests();
  }, [getPendingRequests]);

  const handleAccept = (request: PendingRequest) => {
    Alert.alert(
      "Accept Request",
      `Are you sure you want to accept the staff role for "${request.event.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => useTeacherStore.getState().acceptRequest(request.id),
        },
      ]
    );
  };

  const handleReject = (request: PendingRequest) => {
    Alert.alert(
      "Reject Request",
      `Are you sure you want to reject the staff role for "${request.event.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => useTeacherStore.getState().rejectRequest(request.id),
        },
      ]
    );
  };

  const RequestCard = ({ item }: { item: PendingRequest }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("EventDetails", {
          assignmentId: item.id,
          eventName: item.event.name,
        })
      }
      activeOpacity={0.7}
    >
      <Text style={styles.eventName}>{item.event.name}</Text>
      <Text style={styles.organizer}>
        Requested by: {item.event.organizer.fullName}
      </Text>

      <View style={styles.detailRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>
          {new Date(item.event.startTime).toLocaleString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}{" "}
          -{" "}
          {new Date(item.event.endTime).toLocaleString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>
          {item.event.venue?.name || "Venue TBD"}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <StyledButton
          title="Reject"
          variant="secondary"
          size="small"
          onPress={() => handleReject(item)}
          style={{ borderColor: theme.colors.error, marginRight: 8 }}
          textStyles={{ color: theme.colors.error }}
          disabled={isSubmitting}
        />
        <StyledButton
          title="Accept"
          size="small"
          onPress={() => handleAccept(item)}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    listContainer: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: insets.bottom + 80,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    eventName: { fontSize: 18, fontWeight: "600", color: theme.colors.text },
    organizer: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginVertical: 8,
    },
    detailRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    detailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Requests</Text>
        <Text style={styles.subtitle}>
          Review and respond to event staff invitations
        </Text>
      </View>
      <FlatList
        data={pendingRequests}
        renderItem={RequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getPendingRequests}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="mail-open-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                You have no pending requests.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default PendingRequestsScreen;
