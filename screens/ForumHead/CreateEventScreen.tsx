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
  ImageResizeMode,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHead/ForumHeadNavigator";
import { useForumHeadStore } from "../../store/forumHeadStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledPicker from "../../components/StyledPicker";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAuthStore } from "../../store/authStore";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;

const CreateEventScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { venues, getVenues, isLoading } = useForumHeadStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    getVenues();
  }, [getVenues]);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venueId, setVenueId] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [resizeMode, setResizeMode] = useState<ImageResizeMode>("cover");
  const [registrationLink, setRegistrationLink] = useState("");

  // Date state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState(new Date());

  // Picker visibility and configuration state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerConfig, setPickerConfig] = useState<{
    target: "start" | "end";
    mode: "date" | "time";
  } | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleShowPicker = (target: "start" | "end", mode: "date" | "time") => {
    const currentDate = target === "start" ? startDate : endDate;
    setTempDate(currentDate || new Date());
    setPickerConfig({ target, mode });
    setShowPicker(true);
  };

  const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate && pickerConfig) {
        handleConfirmDate(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = (dateToConfirm: Date) => {
    if (pickerConfig) {
      if (pickerConfig.target === "start") {
        setStartDate(dateToConfirm);
      } else {
        setEndDate(dateToConfirm);
      }
    }
    setShowPicker(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Event name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!startDate) newErrors.startTime = "Start date and time are required.";
    if (!endDate) newErrors.endTime = "End date and time are required.";

    if (startDate && endDate && startDate >= endDate) {
      newErrors.endTime = "End time must be after the start time.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      const eventData = {
        name: name.trim(),
        description: description.trim(),
        startTime: startDate!.toISOString(),
        endTime: endDate!.toISOString(),
        venueId,
        bannerImage: bannerImage.trim(),
        registrationLink: registrationLink.trim(),
        resizeMode,
        forumId: user.forum_heads[0].forumId,
      };
      navigation.navigate("CreateEventPreview", { eventData });
    } else {
      Alert.alert(
        "Validation Error",
        "Please fill out all required fields correctly."
      );
    }
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
    errorText: { fontSize: 14, color: theme.colors.error, marginTop: 4 },
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
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

  const renderDatePickerModal = () => (
    <Modal
      visible={showPicker && Platform.OS === "ios"}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPicker(false)}
    >
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
            <Text style={styles.modalTitle}>Select {pickerConfig?.mode}</Text>
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
  );

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
        <Text style={styles.title}>Create New Event</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StyledTextInput
          label="Event Name"
          placeholder="Enter the event title"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <StyledTextInput
          label="Description"
          placeholder="Tell us about your event"
          multiline
          value={description}
          onChangeText={setDescription}
          error={errors.description}
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
              <Text
                style={
                  startDate ? styles.datePickerText : styles.placeholderText
                }
              >
                {startDate ? startDate.toLocaleDateString() : "Select Date"}
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
              <Text
                style={
                  startDate ? styles.datePickerText : styles.placeholderText
                }
              >
                {startDate
                  ? startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select Time"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.startTime && (
            <Text style={styles.errorText}>{errors.startTime}</Text>
          )}
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
              <Text
                style={endDate ? styles.datePickerText : styles.placeholderText}
              >
                {endDate ? endDate.toLocaleDateString() : "Select Date"}
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
              <Text
                style={endDate ? styles.datePickerText : styles.placeholderText}
              >
                {endDate
                  ? endDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select Time"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.endTime && (
            <Text style={styles.errorText}>{errors.endTime}</Text>
          )}
        </View>

        {Platform.OS === "ios"
          ? renderDatePickerModal()
          : showPicker &&
            pickerConfig && (
              <DateTimePicker
                value={
                  (pickerConfig.target === "start" ? startDate : endDate) ||
                  new Date()
                }
                mode={pickerConfig.mode}
                is24Hour={true}
                display="default"
                onChange={onPickerChange}
              />
            )}

        <StyledPicker
          label="Venue (Optional)"
          placeholder="Select a venue"
          items={venueOptions}
          selectedValue={venueId}
          onValueChange={setVenueId}
          disabled={isLoading}
        />
        <StyledTextInput
          label="Banner Image URL (Optional)"
          placeholder="https://example.com/image.png"
          value={bannerImage}
          onChangeText={setBannerImage}
        />
        <StyledPicker
          label="Image Fit (Optional)"
          placeholder="Select image fit"
          items={resizeModeOptions}
          selectedValue={resizeMode}
          onValueChange={(value) => setResizeMode(value as ImageResizeMode)}
        />
        <StyledTextInput
          label="Registration Link (Optional)"
          placeholder="https://forms.gle/..."
          value={registrationLink}
          onChangeText={setRegistrationLink}
        />
        <StyledButton
          title="Preview Event"
          onPress={handlePreview}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateEventScreen;
