import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SuperAdminStackParamList } from "../../navigation/SuperAdmin/SuperAdminNavigator";
import { useTheme } from "../../hooks/useTheme";
import { useSuperAdminStore } from "../../store/superAdminStore";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<
  SuperAdminStackParamList,
  "CreateCollegeAdmin",
  "collegeName"
>;
type RouteProps = RouteProp<SuperAdminStackParamList, "CreateCollegeAdmin">;

const CreateCollegeAdminScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { collegeId, collegeName } = route.params;
  const { addCollegeAdmin, isSubmitting, clearError } = useSuperAdminStore();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    let isValid = true;

    // Full Name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await addCollegeAdmin(collegeId, {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      // Navigate back to college details on success
      navigation.goBack();
    } catch (error) {
      // Error is handled in the store
      console.error("Create admin error:", error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear error when component unmounts or user starts typing
  React.useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

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
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    form: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 32,
      textAlign: "center",
      paddingHorizontal: 16,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    passwordContainer: {
      position: "relative",
    },
    passwordToggle: {
      zIndex: 1,
    },
    submitButton: {
      marginTop: 20,
      backgroundColor: theme.colors.primary,
    },
    submitButtonText: {
      color: theme.colors.background,
      fontWeight: "bold",
    },
    disabledButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    mainText: {
      fontWeight: "bold",
      color: theme.colors.text,
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Admin</Text>
        </View>
        <Text style={styles.subtitle}>
          Create a new administrator account for{" "}
          <Text style={[styles.subtitle, styles.mainText]}>
            {collegeName || "this college"}
          </Text>
        </Text>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <StyledTextInput
                placeholder="Enter administrator's full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
                error={errors.fullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <StyledTextInput
                placeholder="Enter administrator's email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <StyledTextInput
                  placeholder="Enter administrator's password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  rightElement={
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={togglePasswordVisibility}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>

            {/* Submit Button */}
            <StyledButton
              title={isSubmitting ? "Creating Admin..." : "Create Admin"}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                isSubmitting && styles.disabledButton,
              ]}
              textStyles={styles.submitButtonText}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateCollegeAdminScreen;
