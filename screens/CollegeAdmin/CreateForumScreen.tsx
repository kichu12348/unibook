import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";
import { Ionicons } from "@expo/vector-icons";
import StyledButton from "../../components/StyledButton";
import StyledTextInput from "../../components/StyledTextInput";
import UserMultiSelect from "../../components/UserMultiSelect";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { useDebounce } from "../../hooks/useDebounce";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

const CreateForumScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const { users, isCreatingForum, isSearchingUsers, addForum, getUsers } =
    useCollegeAdminStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedHeadIds: [] as string[],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    heads: "",
  });

  // Filter approved students for forum head selection
  const eligibleUsers = useMemo(() => {
    const filtered = users.filter(
      (user) => user.approvalStatus === "approved" && user.role === "student"
    );

    return filtered;
  }, [users]);

  // Load initial users and handle search
  useEffect(() => {
    // Load initial users on component mount
    getUsers();
  }, [getUsers]);

  // Handle debounced search
  useEffect(() => {
    // Only search if there's a search term, otherwise load all users
    if (debouncedSearchTerm.trim()) {
      getUsers(debouncedSearchTerm);
    } else {
      getUsers();
    }
  }, [debouncedSearchTerm, getUsers]);

  const validateForm = (): boolean => {
    const newErrors = { name: "", description: "", heads: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Forum name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Forum name must be at least 3 characters";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    if (formData.selectedHeadIds.length === 0) {
      newErrors.heads = "At least one forum head must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await addForum({
      name: formData.name.trim(),
      description: formData.description.trim(),
      headIds: formData.selectedHeadIds,
    });

    if (success) {
      // Reset search and navigate back
      setSearchTerm("");
      navigation.goBack();
    }
  };

  const handleGoBack = () => {
    const hasChanges =
      formData.name.trim() ||
      formData.description.trim() ||
      formData.selectedHeadIds.length > 0;

    if (hasChanges) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              // Reset search and navigate back
              setSearchTerm("");
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      // Reset search and navigate back
      setSearchTerm("");
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
      paddingVertical: 16,
      paddingTop: insets.top + 16,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
      borderRadius: 8,
    },
    headerTitleContainer: {
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
      marginTop: 2,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: insets.bottom + 34 + TAB_BAR_HEIGHT,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    inputContainer: {
      marginBottom: 16,
    },
    errorText: {
      fontSize: 14,
      color: theme.colors.error,
      marginTop: 4,
      marginLeft: 4,
    },
    headsContainer: {
      height: 400,
      marginBottom: 16,
    },
    footer: { marginBottom: 30 },
    submitButton: {
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Create New Forum</Text>
          <Text style={styles.subtitle}>
            Set up a new forum for your college
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <StyledTextInput
              label="Forum Name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, name: text }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Enter forum name"
              error={errors.name}
            />
          </View>

          <View style={styles.inputContainer}>
            <StyledTextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, description: text }));
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe the purpose and scope of this forum"
              multiline
              numberOfLines={4}
              error={errors.description}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <StyledButton
            title={isCreatingForum ? "Creating Forum..." : "Create Forum"}
            onPress={handleSubmit}
            loading={isCreatingForum}
            disabled={isCreatingForum}
            style={styles.submitButton}
          />
        </View>

        {/* Forum Heads Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assign Forum Heads</Text>

          <View style={styles.headsContainer}>
            <UserMultiSelect
              users={eligibleUsers}
              selectedUserIds={formData.selectedHeadIds}
              onSelectionChange={(selectedIds) => {
                setFormData((prev) => ({
                  ...prev,
                  selectedHeadIds: selectedIds,
                }));
                if (errors.heads) setErrors((prev) => ({ ...prev, heads: "" }));
              }}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isSearching={isSearchingUsers}
              title={null}
              placeholder="Search approved users..."
            />
          </View>

          {errors.heads ? (
            <Text style={styles.errorText}>{errors.heads}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateForumScreen;
