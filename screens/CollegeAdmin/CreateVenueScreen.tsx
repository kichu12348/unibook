import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

const CreateVenueScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const addVenue = useCollegeAdminStore((state) => state.addVenue);
  const isSubmitting = useCollegeAdminStore((state) => state.isSubmitting);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [errors, setErrors] = useState({ name: "", capacity: "" });

  const validateForm = () => {
    const newErrors = { name: "", capacity: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Venue name is required";
      isValid = false;
    }
    const capNum = parseInt(capacity, 10);
    if (!capacity.trim() || isNaN(capNum) || capNum <= 0) {
      newErrors.capacity = "Please enter a valid positive number for capacity";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const success = await addVenue({
      name: name.trim(),
      capacity: parseInt(capacity, 10),
      locationDetails: locationDetails.trim(),
    });

    if (success) {
      navigation.goBack();
    }
  };

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
    content: { flex: 1 },
    scrollContent: { padding: 24 },
    footer: {
      paddingBottom: insets.bottom + 24 + TAB_BAR_HEIGHT,
      backgroundColor: theme.colors.background,
      marginTop: 16,
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
        <Text style={styles.title}>Create New Venue</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Ensures taps on buttons work even when keyboard is open
        showsVerticalScrollIndicator={false}
      >
        <StyledTextInput
          label="Venue Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Main Auditorium"
          error={errors.name}
        />
        <StyledTextInput
          label="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          placeholder="e.g., 500"
          keyboardType="number-pad"
          error={errors.capacity}
        />
        <StyledTextInput
          label="Location Details (Optional)"
          value={locationDetails}
          onChangeText={setLocationDetails}
          placeholder="e.g., Central Building, First Floor"
          multiline
          numberOfLines={3}
          style={{ maxHeight: 200, minHeight: 100, textAlignVertical: "top" }}
        />

        <View style={styles.footer}>
          <StyledButton
            title={isSubmitting ? "Creating..." : "Create Venue"}
            onPress={handleCreate}
            loading={isSubmitting}
            disabled={isSubmitting}
            activeOpacity={0.7}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateVenueScreen;
