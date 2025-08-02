import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHeadNavigator";
import { useForumHeadStore } from "../../store/forumHeadStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledPicker from "../../components/StyledPicker";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;
type RouteProps = RouteProp<ForumHeadStackParamList, "EditEvent">;

const EditEventScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { event } = route.params;

  const {
    venues,
    getVenues,
    isLoading,
    updateEvent,
    deleteEvent,
    isSubmitting,
  } = useForumHeadStore();

  useEffect(() => {
    getVenues();
  }, [getVenues]);

  // Form state initialized with event data
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [venueId, setVenueId] = useState(event.venue?.id || "");
  const [bannerImage, setBannerImage] = useState(event.bannerImage || "");
  const [resizeMode, setResizeMode] = useState<string>(
    event.resizeMode || "cover"
  );
  const [registrationLink, setRegistrationLink] = useState(
    event.registrationLink || ""
  );

  // Date state
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(event.startTime)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date(event.endTime));
  const [tempDate, setTempDate] = useState(new Date());

  // Picker state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState<{
    target: "start" | "end";
    mode: "date" | "time";
  } | null>(null);

  const handleShowPicker = (target: "start" | "end", mode: "date" | "time") => {
    setTempDate((target === "start" ? startDate : endDate) || new Date());
    setPickerConfig({ target, mode });
    setShowPicker(true);
  };

  const onPickerChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (e.type === "set" && selectedDate) handleConfirmDate(selectedDate);
    } else if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmDate = (dateToConfirm: Date) => {
    if (pickerConfig) {
      if (pickerConfig.target === "start") setStartDate(dateToConfirm);
      else setEndDate(dateToConfirm);
    }
    setShowPicker(false);
  };

  const handleSaveChanges = async () => {
    // Add validation if needed
    const success = await updateEvent(event.id, {
      name: name.trim(),
      description: description.trim(),
      startTime: startDate?.toISOString(),
      endTime: endDate?.toISOString(),
      venueId,
      bannerImage: bannerImage.trim(),
      registrationLink: registrationLink.trim(),
      resizeMode,
    });
    if (success) {
      navigation.pop(2); // Go back from Edit -> Details -> List
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to permanently delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteEvent(event.id);
            if (success) {
              navigation.pop(2);
            }
          },
        },
      ]
    );
  };

  const venueOptions = venues.map((v) => ({ label: v.name, value: v.id }));
  const resizeModeOptions = [
    { label: "Cover (Fills the space, may crop)", value: "cover" },
    { label: "Contain (Shows full image, may have bars)", value: "contain" },
    { label: "Fill (Stretches to fill space)", value: "fill" },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    backButton: { marginRight: 16, padding: 8 },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    content: { paddingHorizontal: 24, paddingBottom: insets.bottom + 40 },
    datePickerContainer: { marginBottom: 16 },
    datePickerLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 8,
    },
    dateInputRow: { flexDirection: "row", justifyContent: "space-between" },
    datePickerButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    datePickerIcon: { marginRight: 8 },
    datePickerText: { fontSize: 16, color: theme.colors.text },
    placeholderText: { fontSize: 16, color: theme.colors.placeholder },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      width: "90%",
      elevation: 5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: { fontSize: 18, fontWeight: "600", color: theme.colors.text },
    modalButton: { padding: 8 },
    modalButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Event</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StyledTextInput
          label="Event Name"
          value={name}
          onChangeText={setName}
        />
        <StyledTextInput
          label="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Start Time</Text>
          <View style={styles.dateInputRow}>
            <TouchableOpacity
              style={[styles.datePickerButton, { marginRight: 8 }]}
              onPress={() => handleShowPicker("start", "date")}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.datePickerIcon}
              />
              <Text style={styles.datePickerText}>
                {startDate?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, { marginLeft: 8 }]}
              onPress={() => handleShowPicker("start", "time")}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.datePickerIcon}
              />
              <Text style={styles.datePickerText}>
                {startDate?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>End Time</Text>
          <View style={styles.dateInputRow}>
            <TouchableOpacity
              style={[styles.datePickerButton, { marginRight: 8 }]}
              onPress={() => handleShowPicker("end", "date")}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.datePickerIcon}
              />
              <Text style={styles.datePickerText}>
                {endDate?.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, { marginLeft: 8 }]}
              onPress={() => handleShowPicker("end", "time")}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.textSecondary}
                style={styles.datePickerIcon}
              />
              <Text style={styles.datePickerText}>
                {endDate?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {Platform.OS === "ios" ? (
          <Modal visible={showPicker} transparent animationType="fade">
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowPicker(false)}
            >
              <Pressable style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>
                    Select {pickerConfig?.mode}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleConfirmDate(tempDate)}
                  >
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode={pickerConfig?.mode}
                  is24Hour={true}
                  display="spinner"
                  onChange={onPickerChange}
                  textColor={theme.colors.text}
                />
              </Pressable>
            </Pressable>
          </Modal>
        ) : (
          showPicker &&
          pickerConfig && (
            <DateTimePicker
              value={tempDate}
              mode={pickerConfig.mode}
              is24Hour={true}
              display="default"
              onChange={onPickerChange}
            />
          )
        )}

        <StyledPicker
          label="Venue (Optional)"
          items={venueOptions}
          selectedValue={venueId}
          onValueChange={setVenueId}
          disabled={isLoading}
        />
        <StyledTextInput
          label="Banner Image URL (Optional)"
          value={bannerImage}
          onChangeText={setBannerImage}
        />
        <StyledPicker
          label="Image Fit (Optional)"
          items={resizeModeOptions}
          selectedValue={resizeMode}
          onValueChange={(value) => setResizeMode(value as "cover" | "contain" | "fill")}
        />
        <StyledTextInput
          label="Registration Link (Optional)"
          value={registrationLink}
          onChangeText={setRegistrationLink}
        />
        <StyledButton
          title="Save Changes"
          onPress={handleSaveChanges}
          style={{ marginTop: 24 }}
          loading={isSubmitting}
        />
        <StyledButton
          title="Delete Event"
          onPress={handleDelete}
          variant="secondary"
          style={{ borderColor: theme.colors.error, marginTop: 16 }}
          textStyles={{ color: theme.colors.error }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditEventScreen;
