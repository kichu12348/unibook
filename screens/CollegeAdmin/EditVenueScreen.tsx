import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";
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

  const { updateVenue, isSubmitting, deleteVenue } = useCollegeAdminStore();

  const [name, setName] = useState(venue.name);
  const [capacity, setCapacity] = useState(String(venue.capacity));
  const [locationDetails, setLocationDetails] = useState(
    venue.locationDetails || ""
  );
  const [errors, setErrors] = useState({ name: "", capacity: "" });

  const handleDelete = () => {
    Alert.alert(
      "Delete Venue",
      "Are you sure you want to permanently delete this venue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteVenue(venue.id);
            if (success) {
              navigation.pop(2);
            }
          },
        },
      ]
    );
  };

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
    //check if details are the same then don't update
    if (
      venue.name === name.trim() &&
      venue.capacity === capNum &&
      venue.locationDetails === locationDetails.trim()
    ) {
      return false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return navigation.goBack();

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
        <View style={styles.footer}>
          <StyledButton
            title={isSubmitting ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            loading={isSubmitting}
          />
        </View>
        <StyledButton
          title="Delete Venue"
          onPress={handleDelete}
          variant="secondary"
          style={{ borderColor: theme.colors.error, marginTop: 24 }}
          textStyles={{ color: theme.colors.error }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditVenueScreen;
