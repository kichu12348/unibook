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
import { AcceptedEvent } from "../../api/teacher";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeacherStackParamList } from "../../navigation/Teacher/TeacherNavigator";

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const ScheduleScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { acceptedEvents, isLoading, getAcceptedEvents, cancelAssignment } =
    useTeacherStore();

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    getAcceptedEvents();
  }, [getAcceptedEvents]);

  const handleCancel = (event: AcceptedEvent) => {
    Alert.alert(
      "Cancel Assignment",
      `Are you sure you want to cancel your staff role for "${event.name}"?`,
      [
        { text: "Keep Assignment", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelAssignment(event.assignmentId),
        },
      ]
    );
  };

  const EventCard = ({ item }: { item: AcceptedEvent }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("EventDetails", {
          assignmentId: item.assignmentId,
          eventName: item.name,
        })
      }
      activeOpacity={0.7}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.assignmentRole}>
        Your Role: {item.myAssignmentRole}
      </Text>

      <View style={styles.detailRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>
          {new Date(item.startTime).toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>{item.venue?.name || "Venue TBD"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons
          name="person-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>
          Organizer: {item.organizer.fullName}
        </Text>
      </View>

      <StyledButton
        title="Cancel Assignment"
        variant="secondary"
        size="small"
        onPress={() => handleCancel(item)}
        style={styles.cancelButton}
        textStyles={{ color: theme.colors.error }}
      />
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
    assignmentRole: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.primary,
      marginVertical: 8,
    },
    detailRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    detailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    cancelButton: {
      borderColor: theme.colors.error,
      borderStyle: "dashed",
      marginTop: 16,
      alignSelf: "flex-end",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>Events you have committed to staff</Text>
      </View>
      <FlatList
        data={acceptedEvents}
        renderItem={EventCard}
        keyExtractor={(item) => item.assignmentId}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getAcceptedEvents}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                You have no upcoming events in your schedule.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ScheduleScreen;
