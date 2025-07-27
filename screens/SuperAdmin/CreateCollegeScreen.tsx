import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SuperAdminStackParamList } from "../../navigation/SuperAdminNavigator";
import { useTheme } from "../../hooks/useTheme";
import { useSuperAdminStore } from "../../store/superAdminStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<
  SuperAdminStackParamList,
  "CreateCollege"
>;

const CreateCollegeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { addCollege, isLoading } = useSuperAdminStore();

  const [formData, setFormData] = useState({
    name: "",
    domainName: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    domainName?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate college name
    if (!formData.name.trim()) {
      newErrors.name = "College name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "College name must be at least 2 characters";
    }

    // Validate domain name
    if (!formData.domainName.trim()) {
      newErrors.domainName = "Domain name is required";
    } else if (
      !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.domainName.trim())
    ) {
      newErrors.domainName = "Please enter a valid domain (e.g., college.edu)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addCollege({
        name: formData.name.trim(),
        domainName: formData.domainName.trim().toLowerCase(),
      });

      // Navigate back to college list
      navigation.goBack();
    } catch (error) {
      // Error is handled by the store and displayed via Alert
      console.error("Create college error:", error);
    }
  };

  const handleCancel = () => {
    if (formData.name.trim() || formData.domainName.trim()) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const isFormValid = formData.name.trim() && formData.domainName.trim();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    scrollContent: {
      paddingHorizontal: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 8,
    },
    requiredAsterisk: {
      color: "#FF3B30",
    },
    helpText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 6,
      lineHeight: 16,
    },
    exampleText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginTop: 4,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 24,
      paddingVertical: 20,
      paddingBottom: 40,
    },
    cancelButton: {
      flex: 1,
      marginRight: 12,
    },
    submitButton: {
      flex: 1,
      marginLeft: 12,
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Create College</Text>
            <Text style={styles.subtitle}>Add a new college to the system</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>College Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                College Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <StyledTextInput
                placeholder="Enter college name"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, name: text }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                error={errors.name}
                leftElement={
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                }
              />
              <Text style={styles.helpText}>
                The official name of the college or university
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Domain Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <StyledTextInput
                placeholder="college.edu"
                value={formData.domainName}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, domainName: text }));
                  if (errors.domainName) {
                    setErrors((prev) => ({ ...prev, domainName: undefined }));
                  }
                }}
                error={errors.domainName}
                keyboardType="url"
                autoCapitalize="none"
                leftElement={
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                }
              />
              <Text style={styles.helpText}>
                The official domain name of the college website
              </Text>
              <Text style={styles.exampleText}>
                Example: ceconline.edu
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <StyledButton
            title="Cancel"
            onPress={handleCancel}
            variant="secondary"
            style={styles.cancelButton}
          />
          <StyledButton
            title="Create College"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!isFormValid}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateCollegeScreen;
