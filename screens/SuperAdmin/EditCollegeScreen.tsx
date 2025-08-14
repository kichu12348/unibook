import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { SuperAdminStackParamList } from "../../navigation/SuperAdmin/SuperAdminNavigator";
import { useTheme } from "../../hooks/useTheme";
import { useSuperAdminStore } from "../../store/superAdminStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import StyledSwitch from "../../components/StyledSwitch";

type NavigationProp = NativeStackNavigationProp<
  SuperAdminStackParamList,
  "EditCollege"
>;
type RouteProp_EditCollege = RouteProp<SuperAdminStackParamList, "EditCollege">;

const EditCollegeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp_EditCollege>();
  const { college } = route.params;
  const { editCollege, isSubmitting } = useSuperAdminStore();

  // Form state initialized with existing college data
  const [formData, setFormData] = useState({
    name: college.name,
    domainName: college.domainName,
    hasPaid: college.hasPaid || false,
  });

  // Form validation
  const [errors, setErrors] = useState({
    name: "",
    domainName: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      domainName: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "College name is required";
    }

    if (!formData.domainName.trim()) {
      newErrors.domainName = "Domain name is required";
    } else if (
      !formData.domainName.match(
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      )
    ) {
      newErrors.domainName = "Please enter a valid domain name";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Only send changed fields
      const updateData: any = {};
      if (formData.name !== college.name) {
        updateData.name = formData.name;
      }
      if (formData.domainName !== college.domainName) {
        updateData.domainName = formData.domainName;
      }
      if (formData.hasPaid !== (college.hasPaid || false)) {
        updateData.hasPaid = formData.hasPaid;
      }

      // If no changes were made
      if (Object.keys(updateData).length === 0) {
        return navigation.goBack();
      }

      await editCollege(college.id, updateData);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating college:", error);
    }
  };

  const handleBack = () => {
    // Check if form has unsaved changes
    const hasChanges =
      formData.name !== college.name ||
      formData.domainName !== college.domainName ||
      formData.hasPaid !== (college.hasPaid || false);

    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    buttonContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Edit College</Text>
            <Text style={styles.subtitle}>{college.name}</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <StyledTextInput
              label="College Name"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter college name"
              error={errors.name}
              autoCapitalize="words"
            />

            <StyledTextInput
              label="Domain Name"
              value={formData.domainName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, domainName: text }))
              }
              placeholder="example.edu"
              error={errors.domainName}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Status</Text>

            <StyledSwitch
              label="Payment Status"
              value={formData.hasPaid}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, hasPaid: value }))
              }
              description={
                formData.hasPaid ? "College has paid" : "College has not paid"
              }
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={[
            styles.buttonContainer,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          <StyledButton
            title={isSubmitting ? "Saving Changes..." : "Save Changes"}
            onPress={handleSave}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditCollegeScreen;
