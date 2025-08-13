// components/Modals/EventDayView.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "../../api/forum";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  data: { date: string; events: Event[] };
}

const EventDayView: React.FC<Props> = ({ isVisible, onClose, data }) => {
  const { colors } = useTheme();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeString: string) =>
    new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.dateTitle, { color: colors.text }]}>
            {formatDate(data.date)}
          </Text>
          <ScrollView>
            {data.events.map((event) => (
              <View
                key={event.id}
                style={[styles.eventCard, { borderColor: colors.border }]}
              >
                <Text style={[styles.eventName, { color: colors.primary }]}>
                  {event.name}
                </Text>
                <Text
                  style={[styles.eventTime, { color: colors.textSecondary }]}
                >
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Text>
                <Text
                  style={[styles.eventVenue, { color: colors.textSecondary }]}
                >
                  Venue: {event.venue?.name || "Not specified"}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "60%",
    borderRadius: 12,
    padding: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  eventCard: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  eventName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  eventTime: { fontSize: 14 },
  eventVenue: { fontSize: 14, marginTop: 2 },
});

export default EventDayView;
