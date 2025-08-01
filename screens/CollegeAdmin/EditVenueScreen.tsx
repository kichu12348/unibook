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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/ManagementStack";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;
type EditVenueRouteProp = RouteProp<ManagementStackParamList, "EditVenue">;

const EditVenueScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditVenueRouteProp>();
  const { venue } = route.params;

  const { updateVenue, isSubmitting } = useCollegeAdminStore();

  const [name, setName] = useState(venue.name);
  const [capacity, setCapacity] = useState(String(venue.capacity));
  const [locationDetails, setLocationDetails] = useState(
    venue.locationDetails || ""
  );
  const [errors, setErrors] = useState({ name: "", capacity: "" });

  const validateForm = () => {
    // ... (Add validation logic similar to CreateVenueScreen) ...
    return true; // Placeholder
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await updateVenue(venue.id, {
      name: name.trim(),
      capacity: parseInt(capacity, 10),
      locationDetails: locationDetails.trim(),
    });

    if (success) {
      // Refresh the main venues list and then go back
      useCollegeAdminStore.getState().getVenues();
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
      padding: 24,
      paddingBottom: insets.bottom + 24,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
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
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Venue</Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <StyledTextInput
          label="Venue Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <StyledTextInput
          label="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
          error={errors.capacity}
        />
        <StyledTextInput
          label="Location Details"
          value={locationDetails}
          onChangeText={setLocationDetails}
          multiline
        />
      </ScrollView>
      <View style={styles.footer}>
        <StyledButton
          title={isSubmitting ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          loading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditVenueScreen;
